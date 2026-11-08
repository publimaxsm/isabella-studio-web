import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Link en bio", robots: { index: false } };

/** Página propia para el enlace de la bio de Instagram/TikTok (reemplaza Linktree) */
const links = [
  { label: "✨ Novedades", href: "/tienda?coleccion=novedades" },
  { label: "Más vendidos", href: "/tienda?coleccion=mas-vendidos" },
  { label: "Kits y regalos", href: "/tienda?coleccion=kits-regalos" },
  { label: "Menos de $10", href: "/tienda?coleccion=menos-de-10" },
  { label: "Únete al Club · regalo en tu 1.ª compra", href: "/club" },
  { label: "Envíos y pagos", href: "/ayuda" },
];

export default function IgPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 pt-10 pb-6 text-center">
      <span className="emblem h-20 w-20" />
      <p className="font-display mt-4 text-3xl tracking-[0.12em] text-ink">ISABELLA</p>
      <p className="text-[11px] tracking-[0.5em] text-accent-ink">STUDIO</p>
      <p className="mt-3 text-[14px] text-muted">Tu universo de belleza · Coro → toda Venezuela</p>
      <div className="mt-8 grid w-full gap-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full border border-line bg-surface px-6 py-4 text-[14px] tracking-[0.06em] text-ink transition hover:border-ink">
            {l.label}
          </Link>
        ))}
        <a href={waLink("¡Hola Isabella Studio! Vengo de Instagram ✨")} target="_blank" rel="noreferrer" className="btn btn-primary">
          <WhatsAppIcon size={18} /> Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
