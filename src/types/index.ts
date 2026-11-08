/**
 * Modelo de datos de Isabella Studio.
 * Refleja 1:1 las tablas de supabase/schema.sql para que el cambio
 * de datos demo → base de datos real no toque los componentes.
 */

export type CategorySlug = "maquillaje" | "skincare" | "cabello" | "perfumes" | "herramientas";

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  subcategories: Subcategory[];
}

/** Forma del dibujo provisional mientras llegan las fotos reales */
export type VisualKind =
  | "lipstick" | "foundation" | "dropper" | "tube" | "jar" | "palette" | "compact"
  | "mascara" | "perfume" | "mist" | "brush" | "sponge" | "curler" | "pump" | "kit";

export interface Variant {
  id: string;
  sku: string;
  /** Tono o tamaño, ej. "Nude Rosé" o "30 ml" */
  name: string;
  /** Color de muestra para tonos (swatch) */
  hex?: string;
  stock: number;
  /** Umbral de alerta de reposición */
  minStock: number;
  /** Precio propio si difiere del producto */
  price?: number;
}

export type Collection =
  | "novedades" | "mas-vendidos" | "ofertas" | "kits-regalos" | "menos-de-10" | "rutinas";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  /** Precio de venta en USD */
  price: number;
  /** Precio anterior (tachado) en USD */
  compareAt?: number;
  rating: number;
  reviews: number;
  short: string;
  description: string;
  benefits: string[];
  howTo: string[];
  ingredients?: string;
  size?: string;
  visual: VisualKind;
  /** Color principal del dibujo provisional cuando no hay variantes con hex */
  tone?: string;
  /** Rutas de fotos reales (cuando existan): /productos/SKU-01.webp … */
  images?: string[];
  variants: Variant[];
  skinTypes?: string[];
  needs?: string[];
  finish?: string;
  collections: Collection[];
  /** Palabras extra para el buscador */
  keywords?: string[];
  /** Slugs de productos para "Completa tu rutina" */
  pairsWith?: string[];
}

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export type DeliveryMethod = "retiro" | "delivery" | "nacional";
export type PaymentMethod = "pago-movil" | "zelle" | "usdt" | "efectivo" | "cashea";

export interface OrderDraft {
  code: string;
  name: string;
  phone: string;
  idNumber: string;
  email?: string;
  delivery: DeliveryMethod;
  address?: string;
  city?: string;
  carrier?: string;
  payment: PaymentMethod;
  notes?: string;
  lines: { name: string; variant: string; qty: number; unit: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}
