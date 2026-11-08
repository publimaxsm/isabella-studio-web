-- ============================================================================
-- ISABELLA STUDIO — Esquema de base de datos (Supabase / PostgreSQL)
-- Fuente única de verdad del inventario: web, WhatsApp y tienda física
-- descuentan del mismo stock (tabla variants + stock_movements).
-- Estado: PROPUESTA v0.1 (aún no aplicada). Revisar antes de migrar.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";      -- búsqueda tolerante a errores

-- ---------- Catálogo ----------
create table categories (
  slug        text primary key,                -- maquillaje, skincare…
  name        text not null,
  tagline     text,
  sort_order  int  default 0
);

create table subcategories (
  category_slug text references categories(slug) on delete cascade,
  slug          text not null,
  name          text not null,
  sort_order    int default 0,
  primary key (category_slug, slug)
);

create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  brand         text not null,
  category_slug text not null references categories(slug),
  subcategory   text not null,
  price_usd     numeric(10,2) not null check (price_usd >= 0),
  compare_at    numeric(10,2),
  cost_usd      numeric(10,2),                 -- privado: solo staff
  short         text,
  description   text,
  benefits      text[] default '{}',
  how_to        text[] default '{}',
  ingredients   text,
  size          text,
  skin_types    text[] default '{}',
  needs         text[] default '{}',           -- piel-grasa, manchas, frizz…
  finish        text,
  keywords      text[] default '{}',           -- extra para el buscador
  pairs_with    text[] default '{}',           -- slugs "Completa tu rutina"
  rating        numeric(2,1) default 0,
  reviews_count int default 0,
  status        text not null default 'activo' check (status in ('activo','borrador','archivado')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  foreign key (category_slug, subcategory) references subcategories(category_slug, slug)
);

create table variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  sku         text unique not null,            -- MAQ-LAB-0002-NUDE
  name        text not null,                   -- tono o tamaño
  hex         text,                            -- color de muestra
  barcode     text,
  price_usd   numeric(10,2),                   -- null = precio del producto
  stock       int not null default 0 check (stock >= 0),
  reserved    int not null default 0 check (reserved >= 0),  -- apartado por pedidos pendientes
  min_stock   int not null default 4,
  weight_g    int,
  sort_order  int default 0
);

create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  variant_id  uuid references variants(id) on delete cascade,
  path        text not null,                   -- storage: productos/SKU-01.webp
  alt         text,
  sort_order  int default 0                    -- 0 = foto principal
);

create table collections (
  slug  text primary key,                      -- novedades, mas-vendidos…
  name  text not null,
  description text
);

create table product_collections (
  product_id      uuid references products(id) on delete cascade,
  collection_slug text references collections(slug) on delete cascade,
  primary key (product_id, collection_slug)
);

-- ---------- Movimientos de inventario (auditoría) ----------
create table stock_movements (
  id          bigint generated always as identity primary key,
  variant_id  uuid not null references variants(id),
  delta       int not null,                    -- +entrada / −salida
  reason      text not null check (reason in ('venta_web','venta_whatsapp','venta_tienda','reposicion','ajuste','devolucion','reserva','liberacion')),
  order_id    uuid,
  note        text,
  created_by  uuid,                            -- auth.users
  created_at  timestamptz default now()
);

-- ---------- Clientes, pedidos y leads ----------
create table customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text unique not null,            -- WhatsApp
  id_number   text,                            -- cédula (guías de envío)
  email       text,
  birthday    text,                            -- dd/mm (Club)
  club_member boolean default false,
  created_at  timestamptz default now()
);

create table orders (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,          -- IS-XXXXX
  customer_id   uuid references customers(id),
  channel       text not null default 'web' check (channel in ('web','whatsapp','tienda','instagram')),
  status        text not null default 'pendiente_pago'
                check (status in ('pendiente_pago','pagado','preparando','enviado','entregado','cancelado')),
  delivery      text not null check (delivery in ('retiro','delivery','nacional')),
  carrier       text,
  tracking      text,
  address       text,
  city          text,
  payment       text not null check (payment in ('pago-movil','zelle','usdt','efectivo','cashea')),
  payment_ref   text,
  receipt_path  text,                          -- comprobante en storage
  subtotal_usd  numeric(10,2) not null,
  shipping_usd  numeric(10,2) default 0,
  total_usd     numeric(10,2) not null,
  bcv_rate      numeric(12,4) not null,        -- tasa usada al crear el pedido
  notes         text,
  reserved_until timestamptz,                  -- now() + 24 h
  created_at    timestamptz default now(),
  paid_at       timestamptz
);

create table order_items (
  order_id    uuid references orders(id) on delete cascade,
  variant_id  uuid references variants(id),
  name        text not null,                   -- copia histórica
  variant     text,
  qty         int not null check (qty > 0),
  unit_usd    numeric(10,2) not null,
  primary key (order_id, variant_id)
);

create table leads (                            -- Club Isabella / pop-up
  id         uuid primary key default gen_random_uuid(),
  name       text,
  phone      text not null,
  email      text,
  birthday   text,
  source     text default 'club',              -- club, popup, quiz, ig
  created_at timestamptz default now()
);

create table restock_requests (                 -- "Avísame cuando llegue"
  id          uuid primary key default gen_random_uuid(),
  variant_id  uuid references variants(id) on delete cascade,
  phone       text not null,
  notified_at timestamptz,
  created_at  timestamptz default now()
);

create table search_misses (                    -- búsquedas sin resultado = qué traer
  id         bigint generated always as identity primary key,
  query      text not null,
  created_at timestamptz default now()
);

create table settings (
  key   text primary key,                        -- bcv_rate, free_shipping_from, whatsapp…
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ---------- Vista para el panel de inventario ----------
create view inventory_view as
select v.id as variant_id, v.sku, p.name as product, v.name as variant, p.category_slug,
       coalesce(v.price_usd, p.price_usd) as price_usd,
       v.stock, v.reserved, (v.stock - v.reserved) as available, v.min_stock,
       case when v.stock - v.reserved <= 0 then 'agotado'
            when v.stock - v.reserved <= v.min_stock then 'reponer'
            else 'ok' end as level
from variants v join products p on p.id = v.product_id
where p.status = 'activo';

-- ---------- Reserva de stock al crear pedido (atómico) ----------
create or replace function reserve_stock(p_order uuid) returns void language plpgsql as $$
declare it record;
begin
  for it in select variant_id, qty from order_items where order_id = p_order loop
    update variants set reserved = reserved + it.qty
     where id = it.variant_id and stock - reserved >= it.qty;
    if not found then raise exception 'Sin stock suficiente para %', it.variant_id; end if;
    insert into stock_movements(variant_id, delta, reason, order_id) values (it.variant_id, -it.qty, 'reserva', p_order);
  end loop;
end $$;

-- Al confirmar el pago: la reserva pasa a venta definitiva
create or replace function confirm_payment(p_order uuid) returns void language plpgsql as $$
declare it record;
begin
  for it in select variant_id, qty from order_items where order_id = p_order loop
    update variants set stock = stock - it.qty, reserved = reserved - it.qty where id = it.variant_id;
  end loop;
  update orders set status = 'pagado', paid_at = now() where id = p_order;
end $$;

-- Libera pedidos vencidos (programar cada 15 min con pg_cron)
create or replace function release_expired_orders() returns void language plpgsql as $$
declare o record; it record;
begin
  for o in select id from orders where status = 'pendiente_pago' and reserved_until < now() loop
    for it in select variant_id, qty from order_items where order_id = o.id loop
      update variants set reserved = greatest(0, reserved - it.qty) where id = it.variant_id;
      insert into stock_movements(variant_id, delta, reason, order_id) values (it.variant_id, it.qty, 'liberacion', o.id);
    end loop;
    update orders set status = 'cancelado' where id = o.id;
  end loop;
end $$;

-- ---------- Índices ----------
create index on products using gin (name gin_trgm_ops);
create index on products (category_slug, subcategory);
create index on variants (product_id);
create index on orders (status, created_at desc);

-- ---------- Seguridad (RLS) ----------
alter table products enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;
alter table leads enable row level security;
-- Lectura pública del catálogo activo. OJO: RLS filtra filas, no columnas;
-- para no exponer cost_usd, el navegador debe leer una vista sin esa columna
-- (o mover el costo a una tabla aparte solo para staff) antes de abrir la lectura pública.
create policy "catalogo publico" on products for select using (status = 'activo');
create policy "variantes publicas" on variants for select using (true);
-- Escritura solo para staff (rol en app_metadata) — completar al configurar Auth.
-- Pedidos y leads se crean desde el servidor (service role), nunca desde el navegador.
