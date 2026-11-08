import Link from "next/link";

/**
 * Logo web: emblema (máscara PNG que toma el color de acento del modo)
 * + wordmark tipográfico. Cuando llegue el SVG oficial, se reemplaza aquí.
 * Regla de marca: el logo va centrado o a la izquierda, nunca a la derecha.
 */
export function Logo({ size = "md", withTagline = false }: { size?: "sm" | "md" | "lg"; withTagline?: boolean }) {
  const s = {
    sm: { emblem: "h-8 w-8", name: "text-[17px]", studio: "text-[8px]" },
    md: { emblem: "h-10 w-10", name: "text-[21px]", studio: "text-[9px]" },
    lg: { emblem: "h-20 w-20", name: "text-[40px]", studio: "text-[13px]" },
  }[size];

  return (
    <Link href="/" aria-label="Isabella Studio — Inicio" className="group inline-flex items-center gap-2.5">
      <span className={`emblem ${s.emblem} shrink-0 transition-transform duration-500 group-hover:rotate-[-6deg]`} />
      <span className="flex flex-col items-start leading-none">
        <span className={`font-display ${s.name} tracking-[0.12em] text-ink`}>ISABELLA</span>
        <span className={`${s.studio} mt-1 tracking-[0.55em] text-accent-ink`}>STUDIO</span>
        {withTagline && <span className="mt-2 text-[10px] tracking-[0.3em] text-muted uppercase">Tu universo de belleza</span>}
      </span>
    </Link>
  );
}
