import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function SectionHeader({ eyebrow, title, href, linkLabel = "Ver todo" }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-2 text-[12px] tracking-[0.18em] text-accent-ink uppercase hover:underline sm:inline-flex">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
