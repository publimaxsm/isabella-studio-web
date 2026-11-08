import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories } from "@/data/categories";
import { getCategory, getProductsByCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}


export async function generateMetadata(props: PageProps<"/categoria/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const cat = getCategory(slug);
  return { title: cat?.name ?? "Categoría", description: cat?.tagline };
}

/** El slug es "dato de URL": se lee dentro de Suspense para que la navegación sea instantánea */
export default function CategoriaPage(props: PageProps<"/categoria/[slug]">) {
  return (
    <Suspense fallback={<div className="container-lux min-h-[70vh]" />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.slug);

  return (
    <>
      <PageHeader eyebrow="Categoría" title={cat.name} description={cat.tagline} crumbs={[{ label: "Tienda", href: "/tienda" }, { label: cat.name }]} />
      <div className="container-lux">
        <Suspense fallback={<ProductGrid products={products} />}>
          <CatalogView products={products} subcategories={cat.subcategories} />
        </Suspense>
      </div>
    </>
  );
}
