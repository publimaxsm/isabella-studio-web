"use client";

import Link from "next/link";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Fila deslizable genérica (productos, reseñas, Instagram…).
 * - Celular: con el dedo (scroll nativo con "imán" por tarjeta).
 * - Computadora: arrastrando con el cursor, rueda/trackpad o flechas.
 * Siempre se asoma la siguiente tarjeta para invitar a deslizar.
 */
export function Rail({
  children,
  eyebrow,
  title,
  titleCount,
  href,
  onSeeAll,
  linkLabel = "Ver todo",
  slideClassName = "w-[72%] sm:w-[44%] md:w-[31%] lg:w-[calc((100%-4.5rem)/4.3)]",
  compact = false,
  centered = false,
  label,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  titleCount?: number;
  href?: string;
  onSeeAll?: () => void;
  linkLabel?: string;
  /** Ancho de cada tarjeta por tamaño de pantalla */
  slideClassName?: string;
  compact?: boolean;
  centered?: boolean;
  label?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0, pointerId: 0 });
  const [dragging, setDragging] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumb, setThumb] = useState(100);
  const count = Children.count(children);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
    setThumb(Math.min(100, (el.clientWidth / el.scrollWidth) * 100));
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, count]);

  function scrollByPage(dir: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  /* Arrastre con el cursor (el dedo usa el scroll nativo) */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    e.preventDefault(); // evita seleccionar texto o arrastrar imágenes
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: track.current!.scrollLeft, pointerId: e.pointerId };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      track.current!.setPointerCapture(d.pointerId);
    }
    if (d.moved) track.current!.scrollLeft = d.startScroll - dx;
  }

  function endDrag() {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    setDragging(false);
    const el = track.current!;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    if (slide) {
      const step = slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: "smooth" });
    }
  }

  // Si hubo arrastre, el clic final no abre el enlace
  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  const scrollable = thumb < 99.5;
  const seeAll = href ? (
    <Link href={href} className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] whitespace-nowrap text-accent-ink uppercase hover:underline">
      {linkLabel} <ArrowRight size={16} />
    </Link>
  ) : onSeeAll ? (
    <button type="button" onClick={onSeeAll} className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] whitespace-nowrap text-accent-ink uppercase hover:underline">
      {linkLabel} <ArrowRight size={16} />
    </button>
  ) : null;

  return (
    <section aria-roledescription="carrusel" aria-label={label ?? title}>
      {(title || seeAll) && (
        <div className={`flex gap-6 ${centered ? "flex-col items-center text-center" : "items-end justify-between"} ${compact ? "mb-6" : "mb-8 md:mb-10"}`}>
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className={`font-display text-ink ${compact ? "text-3xl md:text-4xl" : "mt-2 text-4xl md:text-5xl"}`}>
                {title}
                {titleCount !== undefined && <span className="ml-3 align-middle text-[13px] tracking-normal text-muted">{titleCount}</span>}
              </h2>
            )}
          </div>
          <div className={`flex shrink-0 items-center gap-4 ${centered ? "hidden" : ""}`}>
            {seeAll}
            {scrollable && (
              <div className="hidden gap-2 md:flex">
                <ArrowButton dir={-1} disabled={atStart} onClick={() => scrollByPage(-1)} />
                <ArrowButton dir={1} disabled={atEnd} onClick={() => scrollByPage(1)} />
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={track}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={`no-scrollbar -mx-5 flex scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 ${
          dragging ? "cursor-grabbing snap-none select-none" : "snap-x snap-mandatory md:cursor-grab"
        }`}
      >
        {Children.map(children, (child) => (
          <div data-slide className={`shrink-0 snap-start ${slideClassName}`}>
            {child}
          </div>
        ))}
      </div>

      {/* Indicador de avance + botón (centrado cuando la sección es centrada) */}
      <div className={`mt-8 flex items-center gap-6 ${centered ? "flex-col" : "justify-center"}`}>
        {scrollable && (
          <div className="flex items-center gap-4">
            {centered && <span className="hidden md:block"><ArrowButton dir={-1} disabled={atStart} onClick={() => scrollByPage(-1)} /></span>}
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-line" aria-hidden>
              <div
                className="h-full rounded-full bg-accent transition-transform duration-150"
                style={{ width: `${thumb}%`, transform: `translateX(${(progress * (100 - thumb) * 100) / thumb}%)` }}
              />
            </div>
            {centered && <span className="hidden md:block"><ArrowButton dir={1} disabled={atEnd} onClick={() => scrollByPage(1)} /></span>}
          </div>
        )}
        {centered && seeAll}
      </div>
    </section>
  );
}

function ArrowButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Ver siguientes" : "Ver anteriores"}
      className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:border-ink disabled:opacity-30 disabled:hover:border-line"
    >
      <ArrowRight size={18} className={dir === -1 ? "rotate-180" : ""} />
    </button>
  );
}
