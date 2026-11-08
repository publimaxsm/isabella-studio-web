"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { stockLevel } from "@/lib/catalog";
import { formatUSD } from "@/lib/currency";
import { normalize } from "@/lib/search";
import type { Product } from "@/types";

/**
 * Panel de inventario (DEMO).
 * En producción: protegido con login (Supabase Auth, rol "staff"), lee la vista
 * `inventory_view` y se actualiza en tiempo real (Supabase Realtime) con cada
 * venta web, venta en tienda (POS) o ajuste manual registrado en `stock_movements`.
 */
export function InventoryTable({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  // Ajustes locales para demostrar la edición de stock
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const rows = useMemo(
    () =>
      products.flatMap((p) =>
        p.variants.map((v) => {
          const stock = overrides[v.id] ?? v.stock;
          return { p, v: { ...v, stock }, level: stockLevel({ ...v, stock }) };
        }),
      ),
    [products, overrides],
  );

  const filtered = rows.filter(
    (r) =>
      (cat === "todas" || r.p.category === cat) &&
      (!onlyAlerts || r.level !== "ok") &&
      (!q || normalize(`${r.p.name} ${r.v.name} ${r.v.sku} ${r.p.brand}`).includes(normalize(q))),
  );

  const units = rows.reduce((n, r) => n + r.v.stock, 0);
  const value = rows.reduce((n, r) => n + r.v.stock * (r.v.price ?? r.p.price), 0);
  const low = rows.filter((r) => r.level === "low").length;
  const out = rows.filter((r) => r.level === "out").length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Variantes (SKU)" value={String(rows.length)} />
        <Kpi label="Unidades en stock" value={String(units)} />
        <Kpi label="Valor a precio de venta" value={formatUSD(value)} />
        <Kpi label="Alertas" value={`${low} bajas · ${out} agotadas`} tone={low + out > 0 ? "alert" : undefined} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, tono o SKU…" className="field max-w-xs" aria-label="Buscar en inventario" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="field max-w-[200px]" aria-label="Categoría">
          <option value="todas">Todas las categorías</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          <input type="checkbox" checked={onlyAlerts} onChange={(e) => setOnlyAlerts(e.target.checked)} className="h-4 w-4 accent-[var(--accent-text)]" />
          Solo alertas de reposición
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-surface-2 text-[11px] tracking-[0.14em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-normal">SKU</th>
              <th className="px-4 py-3 font-normal">Producto</th>
              <th className="px-4 py-3 font-normal">Variante</th>
              <th className="px-4 py-3 font-normal">Categoría</th>
              <th className="px-4 py-3 text-right font-normal">Precio</th>
              <th className="px-4 py-3 text-center font-normal">Stock</th>
              <th className="px-4 py-3 text-center font-normal">Mínimo</th>
              <th className="px-4 py-3 font-normal">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {filtered.map(({ p, v, level }) => (
              <tr key={v.id} className="hover:bg-bg">
                <td className="px-4 py-3 font-mono text-[12px] text-muted">{v.sku}</td>
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink">
                  <span className="flex items-center gap-2">
                    {v.hex && <span className="h-3 w-3 rounded-full" style={{ background: v.hex }} />}
                    {v.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted capitalize">{p.category}</td>
                <td className="px-4 py-3 text-right text-ink">{formatUSD(v.price ?? p.price)}</td>
                <td className="px-4 py-3">
                  <div className="mx-auto flex w-fit items-center rounded-full border border-line">
                    <button type="button" className="h-7 w-7" onClick={() => setOverrides((o) => ({ ...o, [v.id]: Math.max(0, v.stock - 1) }))} aria-label={`Restar stock ${v.sku}`}>−</button>
                    <span className="w-8 text-center text-ink">{v.stock}</span>
                    <button type="button" className="h-7 w-7" onClick={() => setOverrides((o) => ({ ...o, [v.id]: v.stock + 1 }))} aria-label={`Sumar stock ${v.sku}`}>+</button>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-muted">{v.minStock}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${level === "ok" ? "bg-[#6E9B74]/15 text-[#4E7A55] dark:text-[#9CC7A2]" : level === "low" ? "bg-accent/20 text-accent-ink" : "bg-muted/20 text-muted"}`}>
                    {level === "ok" ? "OK" : level === "low" ? "Reponer" : "Agotado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-muted">{filtered.length} de {rows.length} variantes · Los ajustes de esta demo no se guardan.</p>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "alert" }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "alert" ? "border-accent/60 bg-accent/10" : "border-line bg-surface"}`}>
      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="font-display mt-2 text-[26px] leading-tight text-ink">{value}</p>
    </div>
  );
}
