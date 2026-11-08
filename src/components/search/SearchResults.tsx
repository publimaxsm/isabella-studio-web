"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useShop } from "@/components/providers/ShopProvider";
import { ChatIcon, SearchIcon } from "@/components/ui/Icons";
import { getAllProducts, getProductsByCollection } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";
import { waLink } from "@/lib/whatsapp";

export function SearchResults() {
  const q = useSearchParams().get("q") ?? "";
  const { setSearchOpen } = useShop();
  const results = useMemo(() => searchProducts(q, getAllProducts(), 60), [q]);

  return (
    <>
      <PageHeader
        eyebrow="Resultados de búsqueda"
        title={q ? `“${q}”` : "Buscar"}
        description={q ? `${results.length} ${results.length === 1 ? "producto encontrado" : "productos encontrados"}` : undefined}
        crumbs={[{ label: "Buscar" }]}
      />
      <div className="container-lux">
        <button type="button" onClick={() => setSearchOpen(true)} className="mb-10 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13px] text-muted hover:border-ink hover:text-ink">
          <SearchIcon size={16} /> Nueva búsqueda
        </button>
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="grid gap-12">
            <div className="max-w-lg">
              <p className="font-display text-3xl text-ink">No encontramos resultados.</p>
              <p className="mt-2 text-muted">Escríbenos y te ayudamos a conseguirlo.</p>
              <a href={waLink(`¡Hola Isabella Studio! Estoy buscando: ${q}`)} target="_blank" rel="noreferrer" className="btn btn-primary mt-6">
                <ChatIcon size={18} /> Pregúntanos por WhatsApp
              </a>
            </div>
            <div>
              <p className="eyebrow mb-6">Más vendidos</p>
              <ProductGrid products={getProductsByCollection("mas-vendidos", 4)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
