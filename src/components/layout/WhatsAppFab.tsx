import { WhatsAppIcon } from "@/components/ui/Icons";
import { waLink } from "@/lib/whatsapp";

/** Botón flotante discreto de asesoría */
export function WhatsAppFab() {
  return (
    <a
      href={waLink("¡Hola Isabella Studio! ✨ Necesito asesoría")}
      target="_blank"
      rel="noreferrer"
      aria-label="Asesoría por WhatsApp"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid h-12 w-12 place-items-center rounded-full bg-btn text-btn-ink shadow-[var(--shadow)] transition hover:scale-105 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon size={22} />
    </a>
  );
}
