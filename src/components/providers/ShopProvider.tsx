"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, variantPrice } from "@/lib/catalog";
import { readStore, writeStore } from "@/lib/storage";
import type { CartLine, Product, Variant } from "@/types";

/**
 * Estado global de la tienda en el navegador: bolsa, buscador y menú.
 * La bolsa se guarda en localStorage. En producción, al confirmar el pedido
 * se crea en Supabase (`orders` + `order_items`) y se aparta el stock.
 */

export interface DetailedLine extends CartLine {
  product: Product;
  variant: Variant;
  unit: number;
}

interface ShopState {
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  add: (productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  lastAdded: string | null;
}

const ShopContext = createContext<ShopState | null>(null);
const KEY = "is-cart-v1";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar desde localStorage solo en el cliente
    setRaw(readStore<CartLine[]>(KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStore(KEY, raw);
  }, [raw, hydrated]);

  // Bloquea el scroll del fondo cuando hay un panel abierto
  useEffect(() => {
    const locked = cartOpen || searchOpen || menuOpen;
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [cartOpen, searchOpen, menuOpen]);

  const lines = useMemo<DetailedLine[]>(() => {
    return raw
      .map((l) => {
        const product = getProductById(l.productId);
        const variant = product?.variants.find((v) => v.id === l.variantId);
        if (!product || !variant) return null;
        return { ...l, product, variant, unit: variantPrice(product, variant) };
      })
      .filter((l): l is DetailedLine => l !== null);
  }, [raw]);

  const add = useCallback((productId: string, variantId: string, qty = 1) => {
    setRaw((prev) => {
      const product = getProductById(productId);
      const stock = product?.variants.find((v) => v.id === variantId)?.stock ?? 0;
      const found = prev.find((l) => l.productId === productId && l.variantId === variantId);
      if (found) {
        return prev.map((l) => (l === found ? { ...l, qty: Math.min(stock, l.qty + qty) } : l));
      }
      return [...prev, { productId, variantId, qty: Math.min(stock, qty) }];
    });
    setLastAdded(variantId);
    setCartOpen(true);
  }, []);

  const setQty = useCallback((productId: string, variantId: string, qty: number) => {
    setRaw((prev) =>
      prev
        .map((l) => (l.productId === productId && l.variantId === variantId ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((productId: string, variantId: string) => {
    setRaw((prev) => prev.filter((l) => !(l.productId === productId && l.variantId === variantId)));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value: ShopState = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.unit, 0),
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    lastAdded,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop debe usarse dentro de <ShopProvider>");
  return ctx;
}
