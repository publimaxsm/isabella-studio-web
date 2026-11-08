import { site } from "@/data/site";

/** Barra superior rotativa y discreta */
export function AnnouncementBar() {
  const items = [...site.announcements];
  return (
    <div className="bg-btn text-btn-ink">
      <div className="container-lux flex h-9 items-center justify-center overflow-hidden">
        <div className="h-9 overflow-hidden" aria-live="off">
          <ul className="ticker">
            {items.map((t) => (
              <li key={t} className="flex h-9 items-center justify-center text-[11px] tracking-[0.22em] uppercase">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
