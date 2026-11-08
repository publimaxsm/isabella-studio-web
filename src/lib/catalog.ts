import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { CategorySlug, Collection, Product, Variant } from "@/types";

/**
 * Capa de acceso al catálogo.
 * Hoy lee los datos demo; mañana cada función se reemplaza por una consulta
 * a Supabase con la misma firma, sin tocar páginas ni componentes.
 */

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getProductsByCollection(c: Collection, limit?: number): Product[] {
  const list = products.filter((p) => p.collections.includes(c));
  return limit ? list.slice(0, limit) : list;
}

export function getProductsByNeed(need: string): Product[] {
  return products.filter((p) => p.needs?.includes(need));
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategoryName(category: CategorySlug, sub: string) {
  return getCategory(category)?.subcategories.find((s) => s.slug === sub)?.name ?? sub;
}

export function getPairs(product: Product): Product[] {
  const explicit = (product.pairsWith ?? [])
    .map((s) => getProductBySlug(s))
    .filter((p): p is Product => Boolean(p));
  if (explicit.length >= 3) return explicit.slice(0, 3);
  const fill = products.filter(
    (p) => p.category === product.category && p.id !== product.id && !explicit.includes(p),
  );
  return [...explicit, ...fill].slice(0, 3);
}

/** Para el carrusel de la ficha: primero sus complementos, luego misma categoría */
export function getRelated(product: Product, limit = 8): Product[] {
  const pairs = getPairs(product);
  const rest = products.filter((p) => p.id !== product.id && !pairs.includes(p) && p.category === product.category);
  const others = products.filter((p) => p.id !== product.id && !pairs.includes(p) && !rest.includes(p) && p.needs?.some((n) => product.needs?.includes(n)));
  return [...pairs, ...rest, ...others].slice(0, limit);
}

/* ---------- Stock ---------- */

export function totalStock(p: Product): number {
  return p.variants.reduce((n, v) => n + v.stock, 0);
}

export function isSoldOut(p: Product): boolean {
  return totalStock(p) === 0;
}

export function firstAvailableVariant(p: Product): Variant {
  return p.variants.find((v) => v.stock > 0) ?? p.variants[0];
}

export type StockLevel = "ok" | "low" | "out";

export function stockLevel(v: Variant): StockLevel {
  if (v.stock <= 0) return "out";
  if (v.stock <= v.minStock) return "low";
  return "ok";
}

export function variantPrice(p: Product, v?: Variant): number {
  return v?.price ?? p.price;
}
