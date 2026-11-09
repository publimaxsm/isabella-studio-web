/**
 * Prefijo para archivos de /public cuando el sitio vive en una subcarpeta
 * (p. ej. GitHub Pages: usuario.github.io/isabella-studio-demo).
 * En Vercel con dominio propio queda vacío.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
