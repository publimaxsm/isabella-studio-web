"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { useShop } from "@/components/providers/ShopProvider";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { getPairs } from "@/lib/catalog";
import { formatBs, formatUSD } from "@/lib/currency";
import { cartToWhatsApp, waLink } from "@/lib/whatsapp";

/** Bolsa lateral: no saca a la clienta de la página que está viendo */
export function CartDrawer() {
  const { lines, subtotal, count, cartOpen, setCartOpen, setQty, remove, add } = useShop();
  const missing = Math.max(0, site.freeShippingFrom - subtotal);
  const progress = Math.min(100, (subtotal / site.freeShippingFrom) * 100);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  // Sugerencia: 1 complemento del último producto que no esté en la bolsa
  const last = lines[lines.length - 1];
  const suggestion = last
    ? getPairs(last.product).find((p) => !lines.some((l) => l.productId === p.id) && p.variants.some((v) => v.stock > 0))
    : undefined;

  const waText = cartToWhatsApp(
    lines.map((l) => ({ name: l.product.name, variant: l.product.variants.length > 1 ? l.variant.name : "", qty: l.qty, unit: l.unit })),
    subtotal,
  );

  return (
    <div className={`fixed inset-0 z-[55] overflow-hidden ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu bolsa"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-bg shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-6">
          <h2 className="font-display text-2xl text-ink">
            Tu bolsa <span className="text-base text-muted">({count})</span>
          </h2>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar bolsa" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <BagIcon size={40} className="text-accent" />
            <p className="font-display text-3xl text-ink">Tu bolsa está vacía</p>
            <p className="text-muted">Descubre nuestros favoritos y empieza tu ritual de belleza.</p>
            <Link href="/tienda" onClick={() => setCartOpen(false)} className="btn btn-primary mt-2">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-line px-6 py-4">
              <p className="text-[13px] text-ink">
                {missing > 0 ? (
                  <>
                    Te faltan <strong className="font-medium text-accent-ink">{formatUSD(missing)}</strong> para el <strong className="font-medium">envío gratis</strong>
                  </>
                ) : (
                  <>✨ ¡Tienes <strong className="font-medium">envío gratis</strong>!</>
                )}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-4 py-5">
                  <Link href={`/producto/${l.product.slug}`} onClick={() => setCartOpen(false)} className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-media p-2">
                    <ProductMedia product={l.product} variant={l.variant} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[10px] tracking-[0.18em] text-muted uppercase">{l.product.brand}</p>
                        <p className="font-display text-[18px] leading-tight text-ink">{l.product.name}</p>
                        {l.product.variants.length > 1 && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
                            {l.variant.hex && <span className="h-3 w-3 rounded-full" style={{ background: l.variant.hex }} />}
                            {l.variant.name}
                          </p>
                        )}
                      </div>
                      <p className="text-[14px] text-accent-ink">{formatUSD(l.unit * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button type="button" onClick={() => setQty(l.productId, l.variantId, l.qty - 1)} className="grid h-8 w-8 place-items-center" aria-label="Quitar uno">
                          <MinusIcon size={14} />
                        </button>
                        <span className="w-6 text-center text-[13px]">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.productId, l.variantId, Math.min(l.variant.stock, l.qty + 1))}
                          disabled={l.qty >= l.variant.stock}
                          className="grid h-8 w-8 place-items-center disabled:opacity-30"
                          aria-label="Agregar uno"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.productId, l.variantId)} className="text-[12px] text-muted underline-offset-4 hover:underline">
                        Eliminar
                      </button>
                    </div>
                    {l.qty >= l.variant.stock && <p className="mt-1 text-[11px] text-accent-ink">Máximo disponible: {l.variant.stock}</p>}
                  </div>
                </li>
              ))}

              {suggestion && (
                <li className="py-5">
                  <p className="eyebrow">Completa tu rutina</p>
                  <div className="mt-3 flex items-center gap-4 rounded-2xl border border-line p-3">
                    <div className="h-16 w-14 shrink-0 rounded-lg bg-media p-1.5">
                      <ProductMedia product={suggestion} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-[17px] leading-tight text-ink">{suggestion.name}</p>
                      <p className="text-[13px] text-accent-ink">{formatUSD(suggestion.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => add(suggestion.id, (suggestion.variants.find((v) => v.stock > 0) ?? suggestion.variants[0]).id)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-ink"
                      aria-label={`Agregar ${suggestion.name}`}
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </li>
              )}
            </ul>

            <footer className="shrink-0 space-y-3 border-t border-line px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] tracking-[0.16em] text-muted uppercase">Subtotal</span>
                <div className="text-right">
                  <p className="text-xl text-ink">{formatUSD(subtotal)}</p>
                  <p className="text-[12px] text-muted">{formatBs(subtotal)}</p>
                </div>
              </div>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary w-full">
                Finalizar compra
              </Link>
              <a href={waLink(waText)} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">
                <WhatsAppIcon size={17} /> Pedir por WhatsApp
              </a>
              <p className="text-center text-[11px] text-muted">Pago Móvil · Zelle · USDT · Efectivo · Cashea</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
