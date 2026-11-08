import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = { title: "Buscar", robots: { index: false } };

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="container-lux py-24 text-muted">Buscando…</div>}>
      <SearchResults />
    </Suspense>
  );
}
