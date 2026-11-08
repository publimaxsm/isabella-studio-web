"use client";

import { Rail } from "@/components/ui/Rail";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

/** Fila deslizable de productos (usa el componente genérico Rail) */
export function ProductCarousel({
  products,
  eyebrow,
  title,
  href,
  linkLabel = "Ver todo",
  onSeeAll,
  compact = false,
}: {
  products: Product[];
  eyebrow?: string;
  title?: string;
  href?: string;
  linkLabel?: string;
  onSeeAll?: () => void;
  compact?: boolean;
}) {
  return (
    <Rail
      eyebrow={eyebrow}
      title={title}
      titleCount={compact ? products.length : undefined}
      href={href}
      onSeeAll={onSeeAll}
      linkLabel={linkLabel}
      compact={compact}
      label={title ?? "Productos relacionados"}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </Rail>
  );
}
