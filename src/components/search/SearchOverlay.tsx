"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { useShop } from "@/components/providers/ShopProvider";
import { ArrowRight, ChatIcon, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";
import { getAllProducts, getProductsByCollection } from "@/lib/catalog";
import { formatUSD } from "@/lib/currency";
import { searchProducts, suggestCategories } from "@/lib/search";
import { readStore, writeStore } from "@/lib/storage";
import { waLink } from "@/lib/whatsapp";

const RECENT_KEY = "is-recent-searches";

/**
 * Buscador elegante a pantalla completa.
 * Vacío → búsquedas populares, recientes y tendencias.
 * Escribiendo → resultados predictivos instantáneos (desde la 2.ª letra).
 * Sin resultados → alternativas + atajo a WhatsApp (y se registra la búsqueda
 * para saber qué productos traer: tabla `search_misses` en Supabase).
 */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!searchOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cargar búsquedas recientes al abrir
    setRecent(readStore<string[]>(RECENT_KEY, []));
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, setSearchOpen]);

  const all = getAllProducts();
  const results = useMemo(() => searchProducts(q, all, 8), [q, all]);
  const cats = useMemo(() => suggestCategories(q), [q]);
  const trending = useMemo(() => getProductsByCollection("mas-vendidos", 4), []);
  const typing = q.trim().length >= 2;

  function remember(term: string) {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5);
    setRecent(next);
    writeStore(RECENT_KEY, next);
  }

  function close() {
    setSearchOpen(false);
    window.setTimeout(() => setQ(""), 300);
  }

  function submit(e?: { preventDefault: () => void }) {
    e?.preventDefault();
    if (!q.trim()) return;
    remember(q);
    close();
    router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] ${searchOpen ? "visible" : "invisible delay-300"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar productos"
    >
      <div
        className={`absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      <div
        className={`relative max-h-[100dvh] overflow-y-auto bg-bg shadow-[var(--shadow)] transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          searchOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="container-lux pt-5 pb-10 md:pt-8 md:pb-14">
          <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink/70 pb-3 md:gap-5">
            <SearchIcon size={26} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="¿Qué estás buscando hoy?"
              className="font-display w-full bg-transparent text-[28px] leading-tight text-ink placeholder:text-muted/70 focus:outline-none focus-visible:outline-none md:text-[44px]"
              aria-label="Buscar"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="button" onClick={close} aria-label="Cerrar buscador" className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2">
              <CloseIcon size={22} />
            </button>
          </form>

          {!typing && (
            <div className="mt-8 grid gap-10 md:grid-cols-[1fr_2fr]">
              <div className="space-y-8">
                <section>
                  <p className="eyebrow">Búsquedas populares</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {site.popularSearches.map((t) => (
                      <button key={t} type="button" onClick={() => setQ(t)} className="rounded-full border border-line px-4 py-2 text-[14px] text-ink transition hover:border-ink">
                        {t}
                      </button>
                    ))}
                  </div>
                </section>
                {recent.length > 0 && (
                  <section>
                    <p className="eyebrow">Tus búsquedas recientes</p>
                    <ul className="mt-3 space-y-1">
                      {recent.map((r) => (
                        <li key={r}>
                          <button type="button" onClick={() => setQ(r)} className="py-1 text-[15px] text-muted hover:text-ink">
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
              <section>
                <p className="eyebrow">Tendencia ahora</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {trending.map((p) => (
                    <MiniCard key={p.id} p={p} onClick={close} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {typing && results.length > 0 && (
            <div className="mt-8 grid gap-10 md:grid-cols-[1fr_3fr]">
              <aside>
                {cats.length > 0 && (
                  <>
                    <p className="eyebrow">Categorías</p>
                    <ul className="mt-3 space-y-2">
                      {cats.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={close} className="text-[15px] text-ink hover:text-accent-ink">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </aside>
              <section>
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">Productos</p>
                  <button type="button" onClick={() => submit()} className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] text-accent-ink uppercase">
                    Ver todos <ArrowRight size={16} />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {results.map((p) => (
                    <MiniCard key={p.id} p={p} onClick={() => { remember(q); close(); }} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {typing && results.length === 0 && (
            <div className="mt-10 grid gap-10 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="font-display text-3xl text-ink">No encontramos “{q}”.</p>
                <p className="mt-3 text-muted">Puede que aún no lo tengamos, o que tenga otro nombre. Escríbenos y te lo conseguimos.</p>
                <a
                  href={waLink(`¡Hola Isabella Studio! Estoy buscando: ${q}. ¿Lo tienen?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary mt-6"
                >
                  <ChatIcon size={18} /> Pregúntanos por WhatsApp
                </a>
              </div>
              <section>
                <p className="eyebrow">Te puede interesar</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {trending.map((p) => (
                    <MiniCard key={p.id} p={p} onClick={close} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ p, onClick }: { p: ReturnType<typeof getAllProducts>[number]; onClick: () => void }) {
  return (
    <Link href={`/producto/${p.slug}`} onClick={onClick} className="group block">
      <div className="aspect-square overflow-hidden rounded-2xl bg-media p-[14%]">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductMedia product={p} />
        </div>
      </div>
      <p className="mt-2.5 text-[11px] tracking-[0.18em] text-muted uppercase">{p.brand}</p>
      <p className="font-display text-[18px] leading-snug text-ink group-hover:text-accent-ink">{p.name}</p>
      <p className="text-[14px] text-accent-ink">{formatUSD(p.price)}</p>
    </Link>
  );
}
