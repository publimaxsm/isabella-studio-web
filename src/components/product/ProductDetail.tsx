"use client";

import { useState } from "react";
import { useShop } from "@/components/providers/ShopProvider";
import { CardIcon, CheckIcon, ChevronDown, MinusIcon, PlusIcon, ShieldIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { firstAvailableVariant, stockLevel, variantPrice } from "@/lib/catalog";
import { formatUSD } from "@/lib/currency";
import { waLink } from "@/lib/whatsapp";
import type { Product } from "@/types";
import { Price } from "./Price";
import { ProductCarousel } from "./ProductCarousel";
import { ProductMedia } from "./ProductMedia";
import { Rating } from "./Rating";

export function ProductDetail({ product, pairs, related }: { product: Product; pairs: Product[]; related: Product[] }) {
  const { add } = useShop();
  const [variant, setVariant] = useState(() => firstAvailableVariant(product));
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"producto" | "textura">("producto");
  const level = stockLevel(variant);
  const price = variantPrice(product, variant);
  const hasShades = product.variants.some((v) => v.hex) && product.variants.length > 1;
  const hasSizes = !hasShades && product.variants.length > 1;

  function addToBag() {
    if (variant.stock > 0) add(product.id, variant.id, qty);
  }

  function addRoutine() {
    [product, ...pairs].forEach((p) => {
      const v = p.id === product.id ? variant : firstAvailableVariant(p);
      if (v.stock > 0) add(p.id, v.id, 1);
    });
  }

  const routineTotal = price + pairs.reduce((n, p) => n + p.price, 0);

  return (
    <>
      <div className="container-lux grid grid-cols-1 gap-10 pt-6 pb-28 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pt-8 lg:gap-20">
        {/* Galería */}
        <div className="min-w-0 md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-media">
            {view === "producto" ? (
              <div className="rise absolute inset-0 p-[14%]" key={variant.id}>
                <ProductMedia product={product} variant={variant} />
              </div>
            ) : (
              <Swatch color={variant.hex ?? product.tone ?? "#C88A75"} />
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            <Thumb active={view === "producto"} onClick={() => setView("producto")} label="Producto">
              <div className="h-full w-full p-2.5"><ProductMedia product={product} variant={variant} /></div>
            </Thumb>
            <Thumb active={view === "textura"} onClick={() => setView("textura")} label="Textura">
              <span className="block h-full w-full" style={{ background: `radial-gradient(circle at 40% 40%, ${variant.hex ?? product.tone ?? "#C88A75"}, ${variant.hex ?? product.tone ?? "#C88A75"}cc 60%, transparent 61%)` }} />
            </Thumb>
          </div>
          <p className="mt-3 text-[12px] text-muted">Ilustración provisional · aquí irán las fotos reales y los swatches en piel.</p>
        </div>

        {/* Información */}
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.22em] text-muted uppercase">{product.brand}</p>
          <h1 className="font-display mt-2 text-[40px] leading-[1.05] text-ink md:text-[54px]">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} count={product.reviews} /></div>
          <p className="mt-5 text-[16px] text-muted">{product.short}</p>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-line py-5">
            <Price amount={price} compareAt={product.compareAt} size="lg" />
            {price >= 25 && (
              <p className="rounded-full bg-surface-2 px-3 py-1.5 text-[12px] text-ink">
                Llévalo con <strong className="font-medium">Cashea</strong> · inicial + cuotas sin interés
              </p>
            )}
          </div>

          {(hasShades || hasSizes) && (
            <fieldset className="mt-6">
              <legend className="text-[13px] text-ink">
                {hasShades ? "Tono" : "Presentación"}: <span className="text-muted">{variant.name}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.variants.map((v) =>
                  hasShades ? (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => { setVariant(v); setQty(1); }}
                      aria-pressed={variant.id === v.id}
                      aria-label={`${v.name}${v.stock === 0 ? " (agotado)" : ""}`}
                      title={v.name}
                      className={`relative h-11 w-11 rounded-full ring-offset-[3px] ring-offset-bg transition ${variant.id === v.id ? "ring-[1.5px] ring-ink" : "hover:ring-1 hover:ring-line"}`}
                      style={{ background: v.hex }}
                    >
                      {v.stock === 0 && <span className="absolute inset-0 m-auto h-px w-[120%] -translate-x-[8%] rotate-45 bg-[#F9F6F0]" />}
                    </button>
                  ) : (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => { setVariant(v); setQty(1); }}
                      aria-pressed={variant.id === v.id}
                      className={`rounded-full border px-4 py-2 text-[13px] ${variant.id === v.id ? "border-ink bg-ink text-bg" : "border-line text-ink"}`}
                    >
                      {v.name}
                    </button>
                  ),
                )}
              </div>
            </fieldset>
          )}

          {product.size && !hasSizes && <p className="mt-4 text-[13px] text-muted">Contenido: {product.size}</p>}

          {/* Stock honesto */}
          <p className={`mt-5 flex items-center gap-2 text-[13px] ${level === "out" ? "text-muted" : "text-ink"}`}>
            <span className={`h-2 w-2 rounded-full ${level === "ok" ? "bg-[#6E9B74]" : level === "low" ? "bg-accent" : "bg-muted"}`} />
            {level === "ok" && "Disponible · listo para enviar"}
            {level === "low" && <>Quedan <strong className="font-medium">{variant.stock}</strong> · ¡casi agotado!</>}
            {level === "out" && "Agotado en este tono"}
          </p>

          {level === "out" ? (
            <NotifyMe productName={`${product.name}${hasShades ? ` (${variant.name})` : ""}`} />
          ) : (
            <div className="mt-5 flex gap-3">
              <div className="flex h-12 items-center rounded-full border border-line">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-11 place-items-center" aria-label="Menos">
                  <MinusIcon size={16} />
                </button>
                <span className="w-6 text-center" aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(variant.stock, q + 1))} disabled={qty >= variant.stock} className="grid h-12 w-11 place-items-center disabled:opacity-30" aria-label="Más">
                  <PlusIcon size={16} />
                </button>
              </div>
              <button type="button" onClick={addToBag} className="btn btn-primary min-w-0 flex-1 !px-4">
                Agregar<span className="hidden sm:inline">&nbsp;a mi bolsa</span> · {formatUSD(price * qty)}
              </button>
            </div>
          )}

          <a
            href={waLink(`¡Hola Isabella Studio! ✨ Me interesa: ${product.name}${hasShades ? ` — tono ${variant.name}` : ""}. ¿Me asesoran?`)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            <WhatsAppIcon size={16} /> ¿Dudas con el tono? Te asesoramos por WhatsApp
          </a>

          <ul className="mt-7 grid gap-3 rounded-2xl bg-surface p-5 text-[13px] text-ink">
            <li className="flex items-center gap-3"><TruckIcon size={20} className="text-accent" /> Envío a toda Venezuela · retiro gratis en Coro</li>
            <li className="flex items-center gap-3"><ShieldIcon size={20} className="text-accent" /> 100% original y sellado</li>
            <li className="flex items-center gap-3"><CardIcon size={20} className="text-accent" /> Pago Móvil, Zelle, USDT, efectivo o Cashea</li>
          </ul>

          <div className="mt-8 divide-y divide-line border-y border-line">
            <Accordion title="Beneficios" defaultOpen>
              <ul className="space-y-2">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2"><CheckIcon size={16} className="mt-1 shrink-0 text-accent" /> {b}</li>
                ))}
              </ul>
              <p className="mt-4">{product.description}</p>
            </Accordion>
            <Accordion title="Modo de uso">
              <ol className="list-decimal space-y-1.5 pl-5">
                {product.howTo.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </Accordion>
            {product.ingredients && <Accordion title="Ingredientes"><p>{product.ingredients}</p></Accordion>}
            {(product.skinTypes || product.finish) && (
              <Accordion title="Ideal para">
                {product.skinTypes && <p>Tipo de piel: {product.skinTypes.join(", ")}</p>}
                {product.finish && <p className="mt-1">Acabado: {product.finish}</p>}
              </Accordion>
            )}
            <Accordion title="Envíos y pagos">
              <p>Retiro gratis en nuestra tienda de Coro, delivery en la ciudad y envíos nacionales por MRW, Zoom, Tealca o Liberty Express. Tu pedido se aparta por 24 horas mientras confirmas el pago.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Completa tu rutina */}
      {pairs.length > 0 && (
        <section className="container-lux border-t border-line pt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Completa tu rutina</p>
              <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">Combina perfecto con</h2>
            </div>
            <button type="button" onClick={addRoutine} className="btn btn-ghost">
              Agregar los {pairs.length + 1} · {formatUSD(routineTotal)}
            </button>
          </div>
          <ProductCarousel products={related} />
        </section>
      )}

      {/* Barra fija de compra en móvil */}
      {level !== "out" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-3 pr-14">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-ink">{product.name}</p>
              <p className="text-[13px] text-accent-ink">{formatUSD(price)}{hasShades && <span className="text-muted"> · {variant.name}</span>}</p>
            </div>
            <button type="button" onClick={addToBag} className="btn btn-primary !min-h-11 !px-5">Agregar</button>
          </div>
        </div>
      )}
    </>
  );
}

function Thumb({ children, active, onClick, label }: { children: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={active} className={`aspect-square overflow-hidden rounded-2xl bg-media transition ${active ? "ring-1 ring-ink" : "opacity-80 hover:opacity-100"}`}>
      {children}
    </button>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <div className="rise absolute inset-0 grid place-items-center">
      <svg viewBox="0 0 300 300" className="h-[70%] w-[70%]" aria-hidden>
        <path d="M60 170 C40 110 110 60 170 80 C240 100 270 170 230 215 C190 260 85 250 60 170 Z" fill={color} />
        <path d="M95 150 C110 120 150 108 185 118" stroke="rgba(255,255,255,0.35)" strokeWidth="10" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Accordion({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[13px] tracking-[0.16em] text-ink uppercase">
        {title}
        <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-[15px] text-muted">{children}</div>
    </details>
  );
}

function NotifyMe({ productName }: { productName: string }) {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p className="mt-5 rounded-2xl bg-surface-2 p-5 text-[14px] text-ink">
        ✨ Listo. Te avisaremos por WhatsApp apenas llegue <strong className="font-medium">{productName}</strong>.
      </p>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO producción: insertar en `restock_requests` (Supabase)
        setSent(true);
      }}
      className="mt-5 rounded-2xl border border-line p-5"
    >
      <p className="font-display text-2xl text-ink">Avísame cuando llegue</p>
      <p className="mt-1 text-[13px] text-muted">Déjanos tu WhatsApp y te escribimos apenas tengamos stock.</p>
      <div className="mt-4 flex gap-2">
        <input required type="tel" inputMode="tel" placeholder="0414 000 0000" className="field" aria-label="WhatsApp" />
        <button type="submit" className="btn btn-primary">Avísame</button>
      </div>
    </form>
  );
}
