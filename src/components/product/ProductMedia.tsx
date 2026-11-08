import type { Product, Variant } from "@/types";
import { ProductVisual } from "./ProductVisual";

/**
 * Muestra la foto real si existe (product.images) o la ilustración provisional.
 * Fotos reales: /public/productos/SKU-01.webp (ver guía de imágenes del plan).
 */
export function ProductMedia({ product, variant, className = "" }: { product: Product; variant?: Variant; className?: string }) {
  const img = product.images?.[0];
  if (img) {
    // eslint-disable-next-line @next/next/no-img-element -- en export estático no hay optimizador de imágenes
    return <img src={img} alt={product.name} className={`h-full w-full object-contain ${className}`} loading="lazy" />;
  }
  const tone = variant?.hex ?? product.tone ?? product.variants[0]?.hex;
  return <ProductVisual kind={product.visual} tone={tone} className={`h-full w-full ${className}`} />;
}
