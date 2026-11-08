"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useShop } from "@/components/providers/ShopProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { categories } from "@/data/categories";

export function Header() {
  const { count, setCartOpen, setSearchOpen, menuOpen, setMenuOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Atajo de teclado: "/" o Ctrl+K abren el buscador
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent bg-bg"
      }`}
      onMouseLeave={() => setOpenCat(null)}
    >
      <div className="container-lux grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-[84px] lg:gap-10">
        {/* Logo: siempre primero, a la izquierda */}
        <div className="justify-self-start">
          <Logo />
        </div>

        {/* Navegación (desktop) */}
        <nav className="hidden items-center justify-center gap-7 lg:flex xl:gap-9" aria-label="Categorías">
          {categories.map((c) => (
            <div key={c.slug} onMouseEnter={() => setOpenCat(c.slug)} onFocus={() => setOpenCat(c.slug)}>
              <Link
                href={`/categoria/${c.slug}`}
                className="relative py-2 text-[12px] tracking-[0.18em] text-ink uppercase after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100"
              >
                {c.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Derecha: acciones + menú móvil */}
        <div className="col-start-3 flex items-center justify-end gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full px-2.5 text-ink transition hover:bg-surface-2 lg:px-3"
            aria-label="Buscar productos"
          >
            <SearchIcon />
            <span className="hidden text-[12px] tracking-[0.14em] text-muted uppercase xl:inline">Buscar</span>
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-surface-2"
            aria-label={`Abrir bolsa, ${count} productos`}
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-btn px-1 text-[10px] font-medium text-btn-ink">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>

      {/* Mega menú (desktop) */}
      {openCat && (
        <div className="absolute inset-x-0 top-full hidden border-b border-line bg-bg/95 backdrop-blur-xl lg:block">
          {categories
            .filter((c) => c.slug === openCat)
            .map((c) => (
              <div key={c.slug} className="container-lux grid grid-cols-[1.2fr_2fr] gap-10 py-10">
                <div>
                  <p className="eyebrow">{c.name}</p>
                  <p className="font-display mt-3 text-3xl leading-tight text-ink">{c.tagline}</p>
                  <Link href={`/categoria/${c.slug}`} className="mt-5 inline-block text-[12px] tracking-[0.18em] text-accent-ink uppercase underline-offset-4 hover:underline">
                    Ver todo {c.name.toLowerCase()}
                  </Link>
                </div>
                <ul className="grid grid-cols-3 gap-x-8 gap-y-3">
                  {c.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/categoria/${c.slug}?sub=${s.slug}`} className="text-[15px] text-ink transition hover:text-accent-ink" onClick={() => setOpenCat(null)}>
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-[var(--overlay)] transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-bg shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Menú"
        >
          <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
            <Logo size="sm" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="grid h-10 w-10 place-items-center">
              <CloseIcon />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-6">
            {categories.map((c) => (
              <details key={c.slug} className="group border-b border-line py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3">
                  <span className="font-display text-2xl text-ink">{c.name}</span>
                  <span className="text-xl text-muted transition group-open:rotate-45">+</span>
                </summary>
                <ul className="pb-4 pl-1">
                  <li>
                    <Link href={`/categoria/${c.slug}`} onClick={() => setMenuOpen(false)} className="block py-2 text-[14px] text-accent-ink">
                      Ver todo
                    </Link>
                  </li>
                  {c.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/categoria/${c.slug}?sub=${s.slug}`} onClick={() => setMenuOpen(false)} className="block py-2 text-[14px] text-ink">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <div className="mt-6 flex flex-col gap-3 text-[13px] tracking-[0.14em] uppercase">
              <Link href="/tienda" onClick={() => setMenuOpen(false)}>Toda la tienda</Link>
              <Link href="/club" onClick={() => setMenuOpen(false)}>Club Isabella</Link>
              <Link href="/nuestra-historia" onClick={() => setMenuOpen(false)}>Nuestra historia</Link>
              <Link href="/ayuda" onClick={() => setMenuOpen(false)}>Envíos y pagos</Link>
            </div>
          </nav>
        </aside>
      </div>
    </header>
  );
}
