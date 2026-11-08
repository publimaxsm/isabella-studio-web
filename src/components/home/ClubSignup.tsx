"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * Captura de leads del Club Isabella.
 * TODO producción: guardar en Supabase (`leads`) y disparar bienvenida por WhatsApp/correo.
 */
export function ClubSignup({ variant = "band" }: { variant?: "band" | "card" }) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setName(String(data.get("name") ?? "").split(" ")[0]);
    setDone(true);
  }

  const wrapper =
    variant === "band"
      ? "container-lux mt-24"
      : "";

  return (
    <section className={wrapper}>
      <div className="relative overflow-hidden rounded-[28px] bg-surface-2 px-6 py-12 sm:px-12 md:grid md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 md:px-16 md:py-16">
        <span className="emblem pointer-events-none absolute -top-16 -right-16 h-72 w-72 opacity-[0.12]" aria-hidden />
        <div className="relative">
          <p className="eyebrow">Club Isabella</p>
          <h2 className="font-display mt-3 text-4xl leading-tight text-ink md:text-5xl">
            Un regalo te espera <em className="text-accent-ink">en tu primera compra</em>
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Acceso anticipado a lanzamientos, ofertas privadas por WhatsApp y un detalle especial en tu cumpleaños.
          </p>
        </div>

        <div className="relative mt-8 md:mt-0">
          {done ? (
            <div className="rounded-2xl bg-bg p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-btn text-btn-ink">
                <CheckIcon />
              </span>
              <p className="font-display mt-4 text-3xl text-ink">¡Bienvenida{name ? `, ${name}` : ""}!</p>
              <p className="mt-2 text-muted">Ya eres parte del Club. Te escribiremos por WhatsApp con tu regalo.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-3">
              <input name="name" required placeholder="Tu nombre" className="field" autoComplete="given-name" />
              <input name="whatsapp" required type="tel" inputMode="tel" placeholder="WhatsApp (0414…)" className="field" autoComplete="tel" pattern="[0-9+\s-]{10,16}" />
              <input name="birthday" type="text" placeholder="Cumpleaños (dd/mm) · opcional" className="field" />
              <button type="submit" className="btn btn-primary mt-1">Quiero mi regalo</button>
              <p className="text-[11px] text-muted">Sin spam. Puedes salir del Club cuando quieras.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
