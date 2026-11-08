import { site } from "@/data/site";
import { formatBs, formatUSD } from "@/lib/currency";
import type { OrderDraft } from "@/types";

export function waLink(text: string, phone: string = site.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function cartToWhatsApp(lines: { name: string; variant: string; qty: number; unit: number }[], total: number) {
  const items = lines.map((l) => `• ${l.qty} × ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${formatUSD(l.unit * l.qty)}`);
  return [
    "¡Hola Isabella Studio! ✨ Quiero hacer este pedido:",
    "",
    ...items,
    "",
    `Total: ${formatUSD(total)} · ${formatBs(total)}`,
  ].join("\n");
}

export function orderToWhatsApp(o: OrderDraft, paymentLabel: string, deliveryLabel: string) {
  const items = o.lines.map((l) => `• ${l.qty} × ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${formatUSD(l.unit * l.qty)}`);
  return [
    `¡Hola Isabella Studio! ✨ Acabo de hacer el pedido *${o.code}*`,
    "",
    ...items,
    "",
    `Total: *${formatUSD(o.total)}* · ${formatBs(o.total)}`,
    `Entrega: ${deliveryLabel}${o.carrier ? ` (${o.carrier})` : ""}${o.city ? ` · ${o.city}` : ""}`,
    `Pago: ${paymentLabel}`,
    `Nombre: ${o.name} · C.I. ${o.idNumber}`,
    "",
    "Te envío el comprobante de pago 👇",
  ].join("\n");
}
