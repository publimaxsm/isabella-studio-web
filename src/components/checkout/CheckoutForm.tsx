"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { useShop } from "@/components/providers/ShopProvider";
import { CheckIcon, ClockIcon, CopyIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { carriers, deliveryOptions, paymentOptions, site } from "@/data/site";
import { formatBs, formatUSD } from "@/lib/currency";
import { orderToWhatsApp, waLink } from "@/lib/whatsapp";
import type { DeliveryMethod, OrderDraft, PaymentMethod } from "@/types";

/**
 * Checkout de 1 página adaptado a Venezuela.
 * Flujo: Datos → Entrega → Pago → Confirmar → instrucciones + comprobante + WhatsApp.
 * TODO producción: `createOrder()` en Supabase con estado "pendiente_pago",
 * reserva de stock por 24 h y cancelación automática si no se confirma.
 */
export function CheckoutForm() {
  const { lines, subtotal, clear } = useShop();
  const [delivery, setDelivery] = useState<DeliveryMethod>("retiro");
  const [payment, setPayment] = useState<PaymentMethod>("pago-movil");
  const [order, setOrder] = useState<OrderDraft | null>(null);

  const deliveryOpt = deliveryOptions.find((d) => d.id === delivery)!;
  const shipping = delivery === "delivery" && subtotal < site.freeShippingFrom ? deliveryOpt.price : 0;
  const total = subtotal + shipping;
  const casheaAvailable = total >= 25;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const draft: OrderDraft = {
      code: newOrderCode(),
      name: String(f.get("name")),
      phone: String(f.get("phone")),
      idNumber: String(f.get("idNumber")),
      email: String(f.get("email") || "") || undefined,
      delivery,
      address: String(f.get("address") || "") || undefined,
      city: String(f.get("city") || "") || undefined,
      carrier: delivery === "nacional" ? String(f.get("carrier")) : undefined,
      payment,
      notes: String(f.get("notes") || "") || undefined,
      lines: lines.map((l) => ({ name: l.product.name, variant: l.product.variants.length > 1 ? l.variant.name : "", qty: l.qty, unit: l.unit })),
      subtotal,
      shipping,
      total,
    };
    setOrder(draft);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (order) return <Confirmation order={order} />;

  if (lines.length === 0)
    return (
      <div className="container-lux py-28 text-center">
        <p className="font-display text-4xl text-ink">Tu bolsa está vacía</p>
        <p className="mt-3 text-muted">Agrega productos para finalizar tu compra.</p>
        <Link href="/tienda" className="btn btn-primary mt-8">Ir a la tienda</Link>
      </div>
    );

  return (
    <div className="container-lux pt-8 md:pt-12">
      <p className="eyebrow">Compra segura</p>
      <h1 className="font-display mt-2 text-5xl text-ink md:text-6xl">Finalizar compra</h1>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="space-y-10">
          <Step n={1} title="Tus datos">
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" required placeholder="Nombre y apellido" className="field sm:col-span-2" autoComplete="name" />
              <input name="phone" required type="tel" inputMode="tel" placeholder="WhatsApp (0414…)" className="field" autoComplete="tel" />
              <input name="idNumber" required inputMode="numeric" placeholder="Cédula (para la guía de envío)" className="field" />
              <input name="email" type="email" placeholder="Correo (opcional, para tu recibo)" className="field sm:col-span-2" autoComplete="email" />
            </div>
          </Step>

          <Step n={2} title="Entrega">
            <div className="grid gap-3">
              {deliveryOptions.map((d) => (
                <Option key={d.id} name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} title={d.label} detail={d.detail}
                  right={d.id === "delivery" ? (subtotal >= site.freeShippingFrom ? "Gratis" : formatUSD(d.price)) : d.id === "retiro" ? "Gratis" : "Cobro a destino"} />
              ))}
            </div>
            {delivery === "delivery" && (
              <div className="mt-4 grid gap-3">
                <input name="address" required placeholder="Dirección exacta y punto de referencia" className="field" autoComplete="street-address" />
              </div>
            )}
            {delivery === "nacional" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input name="city" required placeholder="Ciudad y estado" className="field" autoComplete="address-level2" />
                <select name="carrier" required className="field" defaultValue="">
                  <option value="" disabled>Empresa de envío</option>
                  {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="address" required placeholder="Oficina de la transportadora o dirección" className="field sm:col-span-2" />
              </div>
            )}
          </Step>

          <Step n={3} title="Pago">
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((p) => {
                const disabled = p.id === "cashea" && !casheaAvailable;
                return (
                  <Option key={p.id} name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} title={p.label}
                    detail={disabled ? "Disponible desde $25" : p.id === "pago-movil" ? `${p.detail} · ${formatBs(total)}` : p.detail} disabled={disabled} />
                );
              })}
            </div>
            <textarea name="notes" rows={2} placeholder="Nota para tu pedido (opcional)" className="field mt-4" />
          </Step>
        </div>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[24px] bg-surface p-6 md:p-8">
            <h2 className="font-display text-3xl text-ink">Tu pedido</h2>
            <ul className="mt-5 divide-y divide-line">
              {lines.map((l) => (
                <li key={l.variantId} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-14 shrink-0 rounded-lg bg-media p-1.5">
                    <ProductMedia product={l.product} variant={l.variant} />
                    <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-btn px-1 text-[10px] text-btn-ink">{l.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] text-ink">{l.product.name}</p>
                    {l.product.variants.length > 1 && <p className="text-[12px] text-muted">{l.variant.name}</p>}
                  </div>
                  <p className="text-[14px] text-ink">{formatUSD(l.unit * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[14px]">
              <Row label="Subtotal" value={formatUSD(subtotal)} />
              <Row label="Entrega" value={delivery === "nacional" ? "Cobro a destino" : shipping === 0 ? "Gratis" : formatUSD(shipping)} />
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="text-[13px] tracking-[0.16em] text-muted uppercase">Total</dt>
                <dd className="text-right">
                  <span className="block text-2xl text-ink">{formatUSD(total)}</span>
                  <span className="text-[12px] text-muted">{formatBs(total)} · {site.bcvRateLabel}</span>
                </dd>
              </div>
            </dl>
            <button type="submit" className="btn btn-primary mt-6 w-full">Confirmar pedido</button>
            <p className="mt-3 flex items-start gap-2 text-[12px] text-muted">
              <ClockIcon size={16} className="mt-0.5 shrink-0" /> Apartamos tus productos por {site.reserveHours} horas mientras confirmas el pago.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

/** Código corto legible: IS-XXXXX (en producción lo asigna la base de datos) */
function newOrderCode() {
  return `IS-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 text-[13px] tracking-[0.18em] text-ink uppercase">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-ink text-[12px]">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Option({ name, checked, onChange, title, detail, right, disabled }: {
  name: string; checked: boolean; onChange: () => void; title: string; detail: string; right?: string; disabled?: boolean;
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${checked ? "border-ink bg-surface" : "border-line hover:border-muted"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} className="h-4 w-4 accent-[var(--accent-text)]" />
      <span className="flex-1">
        <span className="block text-[15px] text-ink">{title}</span>
        <span className="block text-[12px] text-muted">{detail}</span>
      </span>
      {right && <span className="text-[13px] text-ink">{right}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function Confirmation({ order }: { order: OrderDraft }) {
  const pay = paymentOptions.find((p) => p.id === order.payment)!;
  const del = deliveryOptions.find((d) => d.id === order.delivery)!;
  const [file, setFile] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  return (
    <div className="container-lux max-w-3xl pt-12 text-center md:pt-16">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-btn text-btn-ink"><CheckIcon size={28} /></span>
      <p className="eyebrow mt-6">Pedido {order.code}</p>
      <h1 className="font-display mt-2 text-5xl text-ink md:text-6xl">¡Gracias, {order.name.split(" ")[0]}!</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Tu pedido está <strong className="font-medium text-ink">reservado por {site.reserveHours} horas</strong>. Completa el pago y envíanos el comprobante para despacharlo.
      </p>

      <div className="mt-10 rounded-[24px] bg-surface p-6 text-left md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
          <p className="text-[13px] tracking-[0.16em] text-muted uppercase">Total a pagar</p>
          <p className="text-right">
            <span className="block text-3xl text-ink">{formatUSD(order.total)}</span>
            {order.payment === "pago-movil" && <span className="text-[14px] text-accent-ink">{formatBs(order.total)}</span>}
          </p>
        </div>
        <p className="mt-5 text-[13px] tracking-[0.16em] text-ink uppercase">Paga con {pay.label}</p>
        <ul className="mt-3 space-y-2">
          {pay.instructions.map((i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-[14px] text-ink">
              {i}
              {i.includes(":") && (
                <button type="button" onClick={() => copy(i.split(":").slice(1).join(":").trim())} className="flex items-center gap-1 text-[12px] text-accent-ink">
                  <CopyIcon size={15} /> {copied === i.split(":").slice(1).join(":").trim() ? "Copiado" : "Copiar"}
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-muted">Entrega: {del.label}{order.carrier ? ` · ${order.carrier}` : ""}{order.city ? ` · ${order.city}` : ""}</p>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-muted/60 p-6 text-center hover:border-ink">
          <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
          <span className="text-[14px] text-ink">{file ? `✓ ${file}` : "Subir comprobante de pago"}</span>
          <span className="text-[12px] text-muted">Captura o PDF · también puedes enviarlo por WhatsApp</span>
        </label>
      </div>

      <a href={waLink(orderToWhatsApp(order, pay.label, del.label))} target="_blank" rel="noreferrer" className="btn btn-primary mt-8 w-full sm:w-auto">
        <WhatsAppIcon size={18} /> Enviar comprobante por WhatsApp
      </a>
      <div className="mt-4">
        <Link href="/tienda" className="text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">Seguir comprando</Link>
      </div>
    </div>
  );
}
