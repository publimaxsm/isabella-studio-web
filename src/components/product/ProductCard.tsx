"use client";

import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { PlusIcon } from "@/components/ui/Icons";
import { firstAvailableVariant, isSoldOut, stockLevel, variantPrice } from "@/lib/catalog";
import type { Product } from "@/types";
import { Price } from "./Price";
import { ProductMedia } from "./ProductMedia";
import { Rating } from "./Rating";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useShop();
  const [variant, setVariant] = useState(() => firstAvailableVariant(product));
  const soldOut = isSoldOut(product);
  const level = stockLevel(variant);
  const shades = product.variants.filter((v) => v.hex);
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
  const href = `/producto/${product.slug}`;

  return (
    <article className={`group relative flex min-w-0 flex-col ${priority ? "rise" : ""}`}>
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-media" aria-label={product.name}>
        <div className="absolute inset-0 p-[12%] transition-transform duration-700 ease-out group-hover:scale-[1.05]">
          <ProductMedia product={product} variant={variant} />
        </div>
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.collections.includes("novedades") && <Badge>Nuevo</Badge>}
          {discount > 0 && <Badge tone="accent">−{discount}%</Badge>}
          {product.collections.includes("mas-vendidos") && !product.collections.includes("novedades") && <Badge>Favorito</Badge>}
        </div>
        {soldOut && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-[#2B2320]/85 py-2 text-center text-[11px] tracking-[0.18em] text-[#F9F6F0] uppercase">
            Agotado · Avísame
          </span>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-1.5 px-1">
        <p className="text-[11px] tracking-[0.2em] text-muted uppercase">{product.brand}</p>
        <h3 className="font-display text-[21px] leading-tight text-ink">
          <Link href={href} className="hover:text-accent-ink">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviews} compact />

        {shades.length > 1 && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Tonos">
            {shades.slice(0, 6).map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={variant.id === s.id}
                aria-label={`${s.name}${s.stock === 0 ? " (agotado)" : ""}`}
                title={s.name}
                onClick={() => setVariant(s)}
                className={`relative h-5 w-5 rounded-full ring-offset-2 ring-offset-bg transition ${
                  variant.id === s.id ? "ring-1 ring-ink" : "ring-0 hover:ring-1 hover:ring-line"
                } ${s.stock === 0 ? "opacity-40" : ""}`}
                style={{ background: s.hex }}
              />
            ))}
            {shades.length > 6 && <span className="text-[11px] text-muted">+{shades.length - 6}</span>}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <Price amount={variantPrice(product, variant)} compareAt={product.compareAt} size="sm" />
          {soldOut ? (
            <Link href={href} className="text-[11px] tracking-[0.16em] text-accent-ink uppercase underline-offset-4 hover:underline">
              Avísame
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => add(product.id, variant.id)}
              disabled={variant.stock === 0}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-ink/80 text-[11px] tracking-[0.16em] text-ink uppercase transition hover:bg-ink hover:text-bg disabled:opacity-40 sm:w-auto sm:px-4"
              aria-label={`Agregar ${product.name}${shades.length > 1 ? ` tono ${variant.name}` : ""} a la bolsa`}
            >
              <PlusIcon size={14} /> <span className="hidden sm:inline">{variant.stock === 0 ? "Agotado" : "Agregar"}</span>
            </button>
          )}
        </div>
        {!soldOut && level === "low" && (
          <p className="text-[12px] text-accent-ink">Quedan {variant.stock} · ¡casi agotado!</p>
        )}
      </div>
    </article>
  );
}

function Badge({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "accent" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase ${
        tone === "accent" ? "bg-[#8E5644] text-[#F9F6F0]" : "bg-[#F9F6F0]/90 text-[#362C27]"
      }`}
    >
      {children}
    </span>
  );
}
