import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className={`container-lux pt-8 md:pt-12 ${title ? "pb-8 md:pb-10" : "pb-0"}`}>
      {crumbs.length > 0 && (
        <nav aria-label="Ruta" className={`${title ? "mb-6" : "mb-0"} flex flex-wrap items-center gap-2 text-[12px] text-muted`}>
          <Link href="/" className="hover:text-ink">Inicio</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h1 className="font-display mt-2 text-5xl leading-[1.05] text-ink md:text-7xl">{title}</h1>}
      {description && <p className="mt-4 max-w-xl text-[16px] text-muted">{description}</p>}
    </header>
  );
}
