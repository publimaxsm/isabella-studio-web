import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { carriers, deliveryOptions, paymentOptions, site } from "@/data/site";

export const metadata: Metadata = { title: "Envíos y pagos", description: "Cómo comprar en Isabella Studio: envíos, métodos de pago, Cashea y cambios." };

export default function AyudaPage() {
  return (
    <>
      <PageHeader eyebrow="Ayuda" title="Envíos y pagos" description="Todo lo que necesitas saber para comprar con tranquilidad." crumbs={[{ label: "Ayuda" }]} />
      <div className="container-lux grid max-w-4xl gap-14">
        <Block id="envios" title="Envíos">
          <ul className="space-y-3">
            {deliveryOptions.map((d) => (
              <li key={d.id}><strong className="font-medium text-ink">{d.label}:</strong> {d.detail}.</li>
            ))}
          </ul>
          <p className="mt-4">Trabajamos con {carriers.join(", ")}. Envío gratis en delivery local desde ${site.freeShippingFrom}.</p>
        </Block>
        <Block id="pagos" title="Métodos de pago">
          <ul className="space-y-3">
            {paymentOptions.map((p) => (
              <li key={p.id}><strong className="font-medium text-ink">{p.label}:</strong> {p.detail}.</li>
            ))}
          </ul>
          <p className="mt-4">Los precios están en dólares y mostramos el equivalente en bolívares a la tasa del día. Tu pedido se aparta por {site.reserveHours} horas mientras confirmas el pago.</p>
        </Block>
        <Block id="cashea" title="Compra con Cashea">
          <p>Para compras desde $25: eliges Cashea en el checkout, pagas tu inicial desde la app y el resto en cuotas sin interés. Te enviamos la orden para que la apruebes.</p>
        </Block>
        <Block id="cambios" title="Cambios y garantía">
          <p>[Por definir con el cliente] Aceptamos cambios de productos sellados dentro de los primeros 7 días. Por higiene, los productos abiertos no tienen cambio salvo defecto de fábrica.</p>
        </Block>
      </div>
    </>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-8">
      <h2 className="font-display text-4xl text-ink">{title}</h2>
      <div className="mt-4 text-[16px] text-muted">{children}</div>
    </section>
  );
}
