import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo withTagline />
          <p className="max-w-xs text-[14px] text-muted">
            Maquillaje, skincare, cabello, perfumes y herramientas originales. Desde {site.city} para toda Venezuela.
          </p>
          <div className="flex gap-2">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink">
              <InstagramIcon size={18} />
            </a>
            <a href={waLink("¡Hola Isabella Studio! ✨")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink">
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>
        <FooterCol title="Tienda">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`}>{c.name}</Link>
          ))}
          <Link href="/tienda">Ver todo</Link>
        </FooterCol>
        <FooterCol title="Ayuda">
          <Link href="/ayuda#envios">Envíos</Link>
          <Link href="/ayuda#pagos">Métodos de pago</Link>
          <Link href="/ayuda#cashea">Compra con Cashea</Link>
          <Link href="/ayuda#cambios">Cambios y garantía</Link>
        </FooterCol>
        <FooterCol title="Isabella">
          <Link href="/nuestra-historia">Nuestra historia</Link>
          <Link href="/club">Club Isabella</Link>
          <Link href="/ig">Link en bio</Link>
          <Link href="/admin/inventario">Panel de inventario</Link>
        </FooterCol>
      </div>
      <div className="border-t border-line">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-5 text-[12px] text-muted md:flex-row">
          <p>© Isabella Studio · {site.city}</p>
          <p>Pago Móvil · Zelle · Binance USDT · Efectivo · Cashea</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <nav className="mt-4 flex flex-col gap-2.5 text-[14px] text-ink [&_a:hover]:text-accent-ink">{children}</nav>
    </div>
  );
}
