import type { DeliveryMethod, PaymentMethod } from "@/types";

/**
 * Configuración general de la tienda.
 * ⚠️ Valores DEMO marcados con [DEMO]: reemplazar con datos reales del cliente.
 * En producción la tasa BCV se actualiza sola (tabla `settings` + tarea diaria).
 */
export const site = {
  name: "Isabella Studio",
  tagline: "Tu universo de belleza",
  city: "Coro, Estado Falcón",
  /** [DEMO] Número de WhatsApp en formato internacional sin "+" */
  whatsapp: "584140000000",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  facebook: "https://facebook.com/",
  /** [DEMO] Tasa referencial Bs/USD. NO es la tasa oficial. */
  bcvRate: 200,
  bcvRateLabel: "Tasa referencial (demo)",
  /** Envío gratis desde (USD) — [DEMO] */
  freeShippingFrom: 40,
  /** Horas que se aparta el stock de un pedido pendiente de pago */
  reserveHours: 24,
  announcements: [
    "Envíos a toda Venezuela desde Coro",
    "Paga en Bs, $, USDT o con Cashea",
    "Regalo en tu primera compra · Únete al Club",
  ],
  trust: [
    { title: "100% originales", text: "Productos sellados y garantizados" },
    { title: "Envíos nacionales", text: "MRW · Zoom · Tealca · Liberty" },
    { title: "Paga como prefieras", text: "Pago Móvil, Zelle, USDT, efectivo y Cashea" },
    { title: "Asesoría real", text: "Te ayudamos por WhatsApp" },
  ],
  popularSearches: ["base", "sérum", "splash", "rubor", "brochas", "protector solar"],
} as const;

export const deliveryOptions: { id: DeliveryMethod; label: string; detail: string; price: number }[] = [
  { id: "retiro", label: "Retiro en tienda", detail: "Coro · listo en 2 h hábiles", price: 0 },
  { id: "delivery", label: "Delivery en Coro", detail: "Mismo día en zonas de cobertura", price: 3 },
  { id: "nacional", label: "Envío nacional", detail: "MRW, Zoom, Tealca o Liberty · cobro a destino", price: 0 },
];

export const carriers = ["MRW", "Zoom", "Tealca", "Liberty Express"];

export const paymentOptions: { id: PaymentMethod; label: string; detail: string; instructions: string[] }[] = [
  {
    id: "pago-movil",
    label: "Pago Móvil",
    detail: "En bolívares a la tasa del día",
    instructions: ["Banco: [por definir]", "Teléfono: [por definir]", "RIF/C.I.: [por definir]"],
  },
  { id: "zelle", label: "Zelle", detail: "En dólares", instructions: ["Correo Zelle: [por definir]", "Titular: [por definir]"] },
  { id: "usdt", label: "Binance / USDT", detail: "Binance Pay o red TRC20", instructions: ["Binance Pay ID: [por definir]"] },
  { id: "efectivo", label: "Efectivo ($)", detail: "Al retirar o recibir en Coro", instructions: ["Pagas al momento de la entrega o retiro."] },
  {
    id: "cashea",
    label: "Cashea",
    detail: "Inicial + cuotas sin interés (desde $25)",
    instructions: ["Te enviamos la orden por la app de Cashea para que pagues tu inicial."],
  },
];
