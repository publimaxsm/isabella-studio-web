import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 ${
        cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
