import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Nuestra historia" };

export default function HistoriaPage() {
  return (
    <>
      <PageHeader eyebrow="Nuestra historia" title="Belleza con raíces en Coro" crumbs={[{ label: "Nuestra historia" }]} />
      <section className="container-lux grid items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
        <img src={asset("/img/editorial-vertical-2.jpg")} alt="Editorial Isabella Studio frente al mar" className="aspect-[4/5] w-full rounded-[28px] object-cover" />
        <div className="space-y-5 text-[16px] text-muted">
          <p className="font-display text-3xl leading-snug text-ink md:text-4xl">
            “Queríamos que comprar belleza en Falcón se sintiera tan especial como en cualquier boutique del mundo.”
          </p>
          <p>
            [Texto de ejemplo] Isabella Studio nace en Coro con una idea simple: productos originales, bien elegidos y una atención que te hace sentir en casa. Cada pieza del catálogo se selecciona pensando en nuestro clima, en la piel de la mujer venezolana y en tu presupuesto.
          </p>
          <p>Hoy enviamos a toda Venezuela, pero seguimos atendiendo como el primer día: por WhatsApp, con asesoría real y un detalle en cada pedido.</p>
          <Link href="/tienda" className="btn btn-primary">Descubre la tienda</Link>
        </div>
      </section>
    </>
  );
}
