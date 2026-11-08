import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-lux py-32 text-center">
      <span className="emblem mx-auto block h-20 w-20" />
      <h1 className="font-display mt-6 text-5xl text-ink">Esta página no existe</h1>
      <p className="mt-3 text-muted">Pero tu próximo favorito sí. Vuelve a la tienda.</p>
      <Link href="/tienda" className="btn btn-primary mt-8">Ir a la tienda</Link>
    </div>
  );
}
