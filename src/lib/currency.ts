import { site } from "@/data/site";

/** Precios base en USD; Bs se calcula con la tasa del día (settings.bcvRate). */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const bs = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatUSD(amount: number): string {
  return usd.format(amount);
}

export function toBs(amountUsd: number, rate: number = site.bcvRate): number {
  return Math.round(amountUsd * rate * 100) / 100;
}

export function formatBs(amountUsd: number, rate: number = site.bcvRate): string {
  return `Bs. ${bs.format(toBs(amountUsd, rate))}`;
}
