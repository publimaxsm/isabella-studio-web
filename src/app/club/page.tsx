import type { Metadata } from "next";
import { ClubSignup } from "@/components/home/ClubSignup";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Club Isabella", description: "Únete al Club Isabella: regalo en tu primera compra, acceso anticipado y sorpresas de cumpleaños." };

const perks = [
  { t: "Regalo de bienvenida", d: "Un detalle especial en tu primera compra." },
  { t: "Acceso anticipado", d: "Compra los lanzamientos 24 h antes que nadie." },
  { t: "Ofertas privadas", d: "Promociones solo para el Club, directo a tu WhatsApp." },
  { t: "Tu cumpleaños", d: "Una sorpresa en tu mes, cada año." },
];

export default function ClubPage() {
  return (
    <>
      <PageHeader eyebrow="Club Isabella" title="Belleza con beneficios" description="Ser parte del Club es gratis y tiene sus privilegios." crumbs={[{ label: "Club Isabella" }]} />
      <section className="container-lux grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((p, i) => (
          <div key={p.t} className="rounded-[22px] border border-line bg-surface p-7">
            <p className="font-display text-5xl text-accent">0{i + 1}</p>
            <p className="mt-4 text-[14px] tracking-[0.14em] text-ink uppercase">{p.t}</p>
            <p className="mt-2 text-muted">{p.d}</p>
          </div>
        ))}
      </section>
      <div className="container-lux mt-12">
        <ClubSignup variant="card" />
      </div>
    </>
  );
}
