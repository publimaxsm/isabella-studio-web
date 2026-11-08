import type { Metadata } from "next";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Panel de inventario", robots: { index: false, follow: false } };

export default function InventarioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Back-office · Demo"
        title="Inventario"
        description="Stock por variante con alertas de reposición. En producción requiere inicio de sesión y se actualiza en tiempo real con cada venta (web, WhatsApp o tienda)."
      />
      <div className="container-lux">
        <InventoryTable products={getAllProducts()} />
      </div>
    </>
  );
}
