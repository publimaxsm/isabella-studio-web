import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getAllProducts, getCategory, getPairs, getProductBySlug, getRelated, getSubcategoryName } from "@/lib/catalog";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}


export async function generateMetadata(props: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProductBySlug(slug);
  return { title: p?.name ?? "Producto", description: p?.short };
}

/** El slug es "dato de URL": se lee dentro de Suspense para que la navegación sea instantánea */
export default function ProductoPage(props: PageProps<"/producto/[slug]">) {
  return (
    <Suspense fallback={<div className="container-lux min-h-[70vh]" />}>
      <Content params={props.params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const cat = getCategory(product.category)!;

  return (
    <>
      <div className="hidden md:block">
        <PageHeader
          title=""
          crumbs={[
            { label: cat.name, href: `/categoria/${cat.slug}` },
            { label: getSubcategoryName(product.category, product.subcategory), href: `/categoria/${cat.slug}?sub=${product.subcategory}` },
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetail product={product} pairs={getPairs(product)} related={getRelated(product)} />
    </>
  );
}
