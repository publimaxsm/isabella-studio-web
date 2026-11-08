import { CardIcon, ChatIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";
import { site } from "@/data/site";

const icons = [ShieldIcon, TruckIcon, CardIcon, ChatIcon];

export function TrustBar() {
  return (
    <section className="border-y border-line">
      <div className="container-lux grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-4">
        {site.trust.map((t, i) => {
          const Icon = icons[i];
          return (
            <div key={t.title} className="flex items-start gap-3">
              <Icon size={26} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="text-[13px] tracking-[0.14em] text-ink uppercase">{t.title}</p>
                <p className="mt-1 text-[13px] text-muted">{t.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
