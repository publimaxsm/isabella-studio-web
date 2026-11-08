"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";

/**
 * Botón sol/luna. El modo inicial lo decide el script de <head> (themeScript)
 * según la preferencia guardada o la del teléfono, antes de pintar (sin parpadeo).
 */
export const THEME_KEY = "is-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leer el modo que ya aplicó el script del <head>
    setTheme((document.documentElement.getAttribute("data-theme") as "light" | "dark") ?? "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  }

  const label = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
