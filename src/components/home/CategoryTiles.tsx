import Link from "next/link";
import { ProductVisual } from "@/components/product/ProductVisual";
import { categories } from "@/data/categories";
import type { CategorySlug, VisualKind } from "@/types";

const art: Record<CategorySlug, { kind: VisualKind; tone: string }> = {
  maquillaje: { kind: "lipstick", tone: "#A4553F" },
  skincare: { kind: "dropper", tone: "#E9DCC8" },
  cabello: { kind: "jar", tone: "#E7C9A9" },
  perfumes: { kind: "perfume", tone: "#F3E3CF" },
  herramientas: { kind: "brush", tone: "#C88A75" },
};

export function CategoryTiles() {
  return (
    <section className="container-lux mt-20 md:mt-28">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Explora</p>
          <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">Todo tu ritual, en un lugar</h2>
        </div>
      </div>
      <div className="no-scrollbar -mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className="group w-[42%] shrink-0 snap-start sm:w-[30%] md:w-auto"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-[22px] bg-media p-[18%]">
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06] group-hover:-rotate-2">
                <ProductVisual kind={art[c.slug].kind} tone={art[c.slug].tone} className="h-full w-full" />
              </div>
            </div>
            <p className="font-display mt-3 text-center text-2xl text-ink group-hover:text-accent-ink">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
