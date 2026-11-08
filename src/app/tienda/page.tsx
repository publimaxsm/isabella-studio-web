import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Toda la tienda de Isabella Studio: maquillaje, skincare, cabello, perfumes y herramientas.",
};

export default function TiendaPage() {
  const products = getAllProducts();
  return (
    <>
      <PageHeader eyebrow="Tienda" title="Todo Isabella" description="Maquillaje, skincare, cabello, perfumes y herramientas. Originales y listos para enviar." crumbs={[{ label: "Tienda" }]} />
      <div className="container-lux">
        {/* El listado lee filtros de la URL en el navegador; el fallback es la grilla completa */}
        <Suspense fallback={<ProductGrid products={products} />}>
          <CatalogView products={products} />
        </Suspense>
      </div>
    </>
  );
}
