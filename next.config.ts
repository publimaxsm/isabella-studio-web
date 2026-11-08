import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 genera una versión 100% estática (carpeta /out) para
 * vistas previas y demos sin servidor. En producción (Vercel) se omite y la
 * app corre con renderizado de servidor + Supabase.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {}),
  // Cache Components / Partial Prefetching requieren servidor: se apagan en el export estático
  cacheComponents: !isStaticExport,
  partialPrefetching: !isStaticExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
