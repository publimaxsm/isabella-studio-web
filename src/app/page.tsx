import Link from "next/link";
import { ClubSignup } from "@/components/home/ClubSignup";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { InstagramIcon, StarIcon } from "@/components/ui/Icons";
import { needs } from "@/data/categories";
import { site } from "@/data/site";
import { reviews } from "@/data/reviews";
import { getProductsByCollection } from "@/lib/catalog";
import { Rail } from "@/components/ui/Rail";
import { asset } from "@/lib/asset";


/** Publicaciones DEMO de Instagram (se reemplazan por el feed real) */
const igPosts = [
  { src: "hero-mar.jpg", caption: "Labios Rojo Coro", pos: "75% center" },
  { src: "editorial-vertical-1.jpg", caption: "Glow de atardecer", pos: "center" },
  { src: "editorial-vertical-2.jpg", caption: "Rutina Glow", pos: "center" },
  { src: "hero-mar.jpg", caption: "Body Mist Vainilla", pos: "68% 30%" },
  { src: "editorial-vertical-2.jpg", caption: "Piel de seda", pos: "center 70%" },
  { src: "editorial-vertical-1.jpg", caption: "Brochas Esencial", pos: "center 60%" },
  { src: "hero-mar.jpg", caption: "Flor de Lirio", pos: "80% 60%" },
  { src: "editorial-vertical-2.jpg", caption: "Kits para regalar", pos: "center 40%" },
];

/** Home ordenado por conversión (plan maestro §5.6) */
export default function HomePage() {
  const bestsellers = getProductsByCollection("mas-vendidos");
  const kits = getProductsByCollection("kits-regalos");

  return (
    <>
      <div className="pt-4 md:pt-6">
        <Hero />
      </div>

      <CategoryTiles />

      <section className="container-lux mt-24 md:mt-32">
        <ProductCarousel eyebrow="Favoritos de nuestras clientas" title="Más vendidos" href="/tienda?coleccion=mas-vendidos" products={bestsellers} />
      </section>

      <section className="container-lux mt-24 md:mt-32">
        <ProductCarousel eyebrow="Recién llegados" title="Novedades" href="/tienda?coleccion=novedades" products={getProductsByCollection("novedades")} />
      </section>

      {/* Comprar por necesidad */}
      <section className="container-lux mt-24 text-center">
        <p className="eyebrow">Comprar por necesidad</p>
        <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">¿Qué necesita tu piel hoy?</h2>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {needs.map((n) => (
            <Link
              key={n.slug}
              href={`/tienda?necesidad=${n.slug}`}
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-[14px] text-ink transition hover:border-ink hover:bg-ink hover:text-bg"
            >
              {n.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Banner editorial */}
      <section className="container-lux mt-24 md:mt-32">
        <div className="grid items-center gap-10 overflow-hidden rounded-[28px] bg-surface md:grid-cols-2 md:gap-0">
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full md:min-h-[620px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
            <img src={asset("/img/editorial-vertical-1.jpg")} alt="Editorial Isabella Studio en la costa de Falcón" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="px-7 pb-12 md:px-16 md:py-16">
            <p className="eyebrow">Nuestra historia</p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-ink md:text-[56px]">
              Nacimos en Coro para que te sientas <em className="text-accent-ink">extraordinaria</em>
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Elegimos cada producto pensando en el clima, la piel y el estilo de la mujer venezolana. Originales, bien curados y con asesoría real.
            </p>
            <Link href="/nuestra-historia" className="btn btn-ghost mt-8">Conócenos</Link>
          </div>
        </div>
      </section>

      <section className="container-lux mt-24 md:mt-32">
        <ProductCarousel eyebrow="Listos para regalar" title="Kits y regalos" href="/tienda?coleccion=kits-regalos" products={kits} />
      </section>

      <ClubSignup />

      {/* Reseñas — DEMO: reemplazar por reseñas reales (Judge.me / tabla reviews) */}
      <section className="container-lux mt-24 md:mt-32">
        <Rail
          eyebrow="Lo que dicen de nosotras"
          title="Clientas felices"
          href={site.instagram}
          linkLabel="Ver más reseñas"
          slideClassName="w-[85%] sm:w-[60%] md:w-[44%] lg:w-[calc((100%-3rem)/3.25)]"
        >
          {reviews.map((r) => (
            <figure key={r.name} className="flex h-full flex-col rounded-[22px] border border-line bg-surface p-7 md:p-8">
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={14} />)}
              </div>
              <blockquote className="font-display mt-4 flex-1 text-[22px] leading-snug text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="text-[12px] tracking-[0.16em] text-ink uppercase">{r.name} · {r.city}</p>
                <p className="mt-1 text-[12px] text-muted">Compró: {r.product}</p>
              </figcaption>
            </figure>
          ))}
        </Rail>
        <p className="mt-3 text-[11px] text-muted">* Reseñas de ejemplo para la demo.</p>
      </section>

      {/* Instagram — DEMO: en producción, últimas publicaciones con productos enlazados */}
      <section className="container-lux mt-24 md:mt-32">
        <Rail
          eyebrow="@isabellastudio"
          title="Síguenos y compra el look"
          href={site.instagram}
          linkLabel="Ver en Instagram"
          centered
          label="Instagram de Isabella Studio"
          slideClassName="w-[70%] sm:w-[44%] md:w-[32%] lg:w-[calc((100%-4.5rem)/4.4)]"
        >
          {igPosts.map((post, i) => (
            <a key={i} href={site.instagram} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden rounded-[22px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
              <img src={asset(`/img/${post.src}`)} alt={post.caption} draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: post.pos }} loading="lazy" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
              <span className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[#362C27]">
                <InstagramIcon size={18} />
              </span>
              <span className="absolute inset-x-5 bottom-5 text-left text-[#F9F6F0]">
                <span className="block text-[11px] tracking-[0.2em] uppercase opacity-80">Compra el look</span>
                <span className="font-display mt-1 block text-xl leading-tight">{post.caption}</span>
              </span>
            </a>
          ))}
        </Rail>
      </section>

      <div className="mt-24">
        <TrustBar />
      </div>
    </>
  );
}
