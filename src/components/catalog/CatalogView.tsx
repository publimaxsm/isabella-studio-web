"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories, collectionsMeta, needs } from "@/data/categories";
import { isSoldOut } from "@/lib/catalog";
import type { Collection, Product, Subcategory } from "@/types";

type Sort = "destacados" | "precio-asc" | "precio-desc" | "novedades" | "valorados";

/**
 * Listado con filtros (subcategoría, necesidad, colección, disponibilidad) y orden.
 * Lee los filtros iniciales de la URL (?sub=, ?necesidad=, ?coleccion=).
 */
/**
 * Sin filtros activos: una fila deslizable por grupo (subcategoría en la página
 * de categoría, categoría en la tienda). Al filtrar u ordenar: cuadrícula.
 */
export function CatalogView({ products, subcategories }: { products: Product[]; subcategories?: Subcategory[] }) {
  const params = useSearchParams();
  const [sub, setSub] = useState<string | null>(params.get("sub"));
  const [need, setNeed] = useState<string | null>(params.get("necesidad"));
  const [collection, setCollection] = useState<Collection | null>(params.get("coleccion") as Collection | null);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>("destacados");

  const availableNeeds = needs.filter((n) => products.some((p) => p.needs?.includes(n.slug)));

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        (!sub || p.subcategory === sub) &&
        (!need || p.needs?.includes(need)) &&
        (!collection || p.collections.includes(collection)) &&
        (!inStock || !isSoldOut(p)),
    );
    out = [...out];
    if (sort === "precio-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "valorados") out.sort((a, b) => b.rating - a.rating);
    if (sort === "novedades") out.sort((a, b) => Number(b.collections.includes("novedades")) - Number(a.collections.includes("novedades")));
    if (sort === "destacados") out.sort((a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b)) || b.reviews - a.reviews);
    return out;
  }, [products, sub, need, collection, inStock, sort]);

  const activeCount = [sub, need, collection].filter(Boolean).length + (inStock ? 1 : 0);

  // Filas por grupo cuando no hay filtros ni orden especial
  const groups = subcategories
    ? subcategories
        .map((s) => ({ key: s.slug, title: s.name, items: list.filter((p) => p.subcategory === s.slug), href: undefined as string | undefined, onSeeAll: () => { setSub(s.slug); window.scrollTo({ top: 0, behavior: "smooth" }); } }))
        .filter((g) => g.items.length > 0)
    : categories
        .map((c) => ({ key: c.slug, title: c.name, items: list.filter((p) => p.category === c.slug), href: `/categoria/${c.slug}` as string | undefined, onSeeAll: undefined as (() => void) | undefined }))
        .filter((g) => g.items.length > 0);
  const grouped = activeCount === 0 && sort === "destacados" && groups.length > 1;

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-5 border-b border-line bg-bg/90 px-5 py-3 backdrop-blur-xl md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none lg:top-[84px]">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {subcategories && (
            <>
              <Chip active={!sub} onClick={() => setSub(null)}>Todo</Chip>
              {subcategories
                .filter((s) => products.some((p) => p.subcategory === s.slug))
                .map((s) => (
                  <Chip key={s.slug} active={sub === s.slug} onClick={() => setSub(sub === s.slug ? null : s.slug)}>
                    {s.name}
                  </Chip>
                ))}
              <span className="mx-1 h-5 w-px shrink-0 bg-line" />
            </>
          )}
          {availableNeeds.map((n) => (
            <Chip key={n.slug} active={need === n.slug} onClick={() => setNeed(need === n.slug ? null : n.slug)} subtle>
              {n.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
          <span>{list.length} {list.length === 1 ? "producto" : "productos"}</span>
          {collection && (
            <Chip active onClick={() => setCollection(null)}>{collectionsMeta[collection].name} ✕</Chip>
          )}
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[var(--accent-text)]" />
            Solo disponibles
          </label>
          {activeCount > 0 && (
            <button
              type="button"
              className="text-accent-ink underline-offset-4 hover:underline"
              onClick={() => {
                setSub(null);
                setNeed(null);
                setCollection(null);
                setInStock(false);
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-line bg-surface px-3 py-2 text-[13px] text-ink">
            <option value="destacados">Destacados</option>
            <option value="valorados">Mejor valorados</option>
            <option value="novedades">Novedades</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>

      <div className="mt-10">
        {grouped ? (
          <div className="space-y-16 md:space-y-20">
            {groups.map((g) => (
              <ProductCarousel
                key={g.key}
                title={g.title}
                products={g.items}
                compact
                linkLabel="Ver todo"
                {...(g.href ? { href: g.href } : { onSeeAll: g.onSeeAll })}
              />
            ))}
          </div>
        ) : list.length > 0 ? (
          <ProductGrid products={list} />
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-3xl text-ink">No hay productos con estos filtros</p>
            <p className="mt-2 text-muted">Prueba quitando alguno o escríbenos por WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ children, active, onClick, subtle }: { children: React.ReactNode; active?: boolean; onClick: () => void; subtle?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-[13px] transition ${
        active ? "border-ink bg-ink text-bg" : subtle ? "border-line text-muted hover:text-ink" : "border-line text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
