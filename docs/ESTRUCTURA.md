# Isabella Studio — Estructura de la app web

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres + Auth + Storage + Realtime) · Vercel
**Estado:** proyecto base funcionando con **datos demo**. Diseño, navegación y flujos de compra listos; backend por conectar.

---

## 1. Mapa de carpetas

```
isabella-studio/
├── docs/ESTRUCTURA.md          ← este documento
├── supabase/schema.sql         ← modelo de datos propuesto (inventario, pedidos, leads)
├── public/
│   ├── brand/                  ← emblema del logo (máscara que se tiñe según el modo)
│   ├── img/                    ← fotos editoriales de la marca
│   └── productos/              ← (pendiente) fotos reales: SKU-01.webp, SKU-02.webp…
└── src/
    ├── app/                    ← RUTAS (cada carpeta = una URL)
    │   ├── layout.tsx          ← estructura global: barra, header, footer, bolsa, buscador
    │   ├── globals.css         ← tokens de diseño claro/oscuro
    │   ├── page.tsx            ← /            Home (ordenado por conversión)
    │   ├── tienda/             ← /tienda      todo el catálogo + filtros
    │   ├── categoria/[slug]/   ← /categoria/maquillaje?sub=labios
    │   ├── producto/[slug]/    ← /producto/base-skin-silk
    │   ├── buscar/             ← /buscar?q=serum
    │   ├── checkout/           ← /checkout    compra en 1 página
    │   ├── club/               ← /club        captura de leads
    │   ├── nuestra-historia/
    │   ├── ayuda/              ← envíos, pagos, Cashea, cambios
    │   ├── ig/                 ← /ig          "link en bio" propio
    │   └── admin/inventario/   ← panel de stock (demo; luego con login)
    ├── components/
    │   ├── layout/             ← Header (mega menú + menú móvil), Footer, AnnouncementBar, WhatsAppFab
    │   ├── search/             ← SearchOverlay (predictivo), SearchResults
    │   ├── cart/               ← CartDrawer (bolsa lateral + envío gratis + upsell)
    │   ├── product/            ← ProductCard, ProductDetail, ProductMedia, ProductVisual, Price, Rating
    │   ├── catalog/            ← CatalogView (filtros y orden)
    │   ├── checkout/           ← CheckoutForm + Confirmación
    │   ├── home/               ← Hero, CategoryTiles, ClubSignup, TrustBar
    │   ├── admin/              ← InventoryTable
    │   ├── theme/              ← ThemeToggle + script anti-parpadeo
    │   ├── providers/          ← ShopProvider (estado de bolsa, buscador y menú)
    │   └── brand/, ui/         ← Logo, íconos
    ├── data/                   ← DATOS DEMO (se reemplazan por Supabase)
    │   ├── products.ts         ← 23 productos ficticios con variantes y stock
    │   ├── categories.ts       ← 5 categorías, subcategorías, colecciones, necesidades
    │   ├── synonyms.ts         ← sinónimos del buscador (editable)
    │   └── site.ts             ← WhatsApp, tasa, envíos, métodos de pago  [DEMO]
    ├── lib/                    ← LÓGICA
    │   ├── catalog.ts          ← acceso al catálogo (única capa que cambia al conectar Supabase)
    │   ├── search.ts           ← buscador: tildes, sinónimos, errores de escritura
    │   ├── currency.ts         ← USD → Bs con la tasa del día
    │   ├── whatsapp.ts         ← mensajes prellenados de pedido
    │   └── storage.ts          ← localStorage seguro
    └── types/index.ts          ← modelo de datos (espejo de schema.sql)
```

**Regla de oro de la arquitectura:** los componentes nunca leen `data/` directamente; siempre pasan por `lib/catalog.ts`. Al conectar Supabase solo se reescribe esa capa.

---

## 2. Lo que ya funciona

| Pieza | Detalle |
|---|---|
| **Modo claro / oscuro** | Respeta el modo del teléfono, botón sol/luna, se recuerda, sin parpadeo al cargar. Las fotos de producto siguen sobre crema en oscuro ("joyas sobre terciopelo"). |
| **Buscador** | Pantalla completa, predictivo desde la 2.ª letra, populares/recientes/tendencias, sin tildes, sinónimos ("pestañina" → máscara), tolera errores ("serun" → sérum), atajo `/` o `Ctrl+K`, "sin resultados" con WhatsApp. |
| **Compra rápida** | "+ Agregar" desde la tarjeta, tonos seleccionables en la tarjeta, bolsa lateral con barra de envío gratis y "Completa tu rutina". |
| **Página de producto** | Tonos, stock honesto ("Quedan 3"), aviso de Cashea desde $25, acordeones, "Avísame cuando llegue", botón fijo en móvil, "Agregar los 4". |
| **Checkout Venezuela** | 1 página: datos + cédula, retiro/delivery/envío nacional (MRW, Zoom, Tealca, Liberty), Pago Móvil en Bs, Zelle, USDT, efectivo, Cashea (≥$25). Confirmación con datos de pago copiables, carga de comprobante y WhatsApp con el pedido escrito. |
| **Pedir por WhatsApp** | Desde la bolsa, con el detalle del pedido. |
| **Club Isabella** | Formulario de leads (nombre, WhatsApp, cumpleaños). |
| **Panel de inventario (demo)** | KPIs, alertas de reposición, filtro por categoría, búsqueda por SKU, ajuste de stock. |
| **Accesibilidad** | Contrastes AA verificados, navegación con teclado, "saltar al contenido", `prefers-reduced-motion`. |

---

## 3. Pendiente para producción (siguiente fase)

1. **Supabase:** crear proyecto, aplicar `supabase/schema.sql`, cargar catálogo real desde la plantilla de inventario (CSV).
2. **Reescribir `lib/catalog.ts`** con consultas a Supabase (mismas firmas).
3. **Pedidos reales:** acción de servidor `createOrder()` → `orders` + `order_items` + `reserve_stock()`; tarea programada `release_expired_orders()` cada 15 min.
4. **Panel admin con login** (Supabase Auth, rol staff): pedidos (confirmar pago → `confirm_payment()`), inventario en tiempo real, entradas de mercancía, leads y búsquedas sin resultado.
5. **Tasa BCV automática** (tarea diaria que actualiza `settings.bcv_rate`).
6. **Leads y avisos:** guardar Club / "Avísame" en Supabase; mensajes por WhatsApp Business.
7. **Fotos reales** en Storage (`productos/SKU-01.webp`) → `ProductMedia` las muestra solas.
8. **Medición:** Meta Pixel + API de Conversiones, GA4, TikTok Pixel.
9. **Logo en SVG** oficial para reemplazar el emblema provisional.
10. Textos reales: historia, políticas de cambio, datos de pago.

---

## 4. Comandos

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo en http://localhost:3000
npm run build        # compilación de producción
STATIC_EXPORT=1 npm run build   # versión estática en /out (para demos sin servidor)
```

## 5. Dónde cambiar cada cosa (para el día a día)

| Quiero cambiar… | Archivo |
|---|---|
| Colores claro/oscuro | `src/app/globals.css` (bloques `[data-theme]`) |
| WhatsApp, tasa, envío gratis, mensajes de la barra | `src/data/site.ts` |
| Métodos de pago y datos bancarios | `src/data/site.ts` → `paymentOptions` |
| Categorías y subcategorías | `src/data/categories.ts` |
| Sinónimos del buscador | `src/data/synonyms.ts` |
| Productos (demo) | `src/data/products.ts` |
