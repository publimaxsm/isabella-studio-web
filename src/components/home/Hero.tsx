import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

export function Hero() {
  return (
    <section className="relative">
      <div className="container-lux">
        <div className="relative isolate overflow-hidden rounded-[28px] md:rounded-[36px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
          <img
            src="/img/hero-mar.jpg"
            alt="Isabella Studio — editorial frente al mar en Falcón"
            className="slow-zoom absolute inset-0 -z-10 h-full w-full object-cover object-[70%_center]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1b1411]/80 via-[#1b1411]/40 to-transparent" />
          <div className="flex min-h-[560px] flex-col justify-end p-7 pb-10 sm:p-12 md:min-h-[640px] md:justify-center md:p-16 lg:p-20">
            <p className="rise text-[11px] tracking-[0.32em] text-[#E9D3B4] uppercase">Coro · Estado Falcón</p>
            <h1 className="rise font-display mt-4 max-w-xl text-[46px] leading-[1.02] text-[#F9F6F0] sm:text-6xl lg:text-[76px]" style={{ animationDelay: "120ms" }}>
              Tu universo <em className="text-[#E3BE84]">de belleza</em>
            </h1>
            <p className="rise mt-5 max-w-md text-[16px] text-[#F3ECE4]/85" style={{ animationDelay: "240ms" }}>
              Maquillaje, skincare, cabello y perfumes originales, elegidos para ti. Compra en minutos y recibe en toda Venezuela.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
              <Link href="/tienda" className="btn bg-[#F9F6F0] text-[#362C27] hover:opacity-90">
                Descubre la colección <ArrowRight size={16} />
              </Link>
              <Link href="/club" className="btn border border-[#F9F6F0]/70 text-[#F9F6F0] hover:bg-[#F9F6F0]/10">
                Únete al Club
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
