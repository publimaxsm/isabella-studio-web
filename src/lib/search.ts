import { categories } from "@/data/categories";
import { synonymGroups } from "@/data/synonyms";
import type { Product } from "@/types";

/**
 * Buscador del catálogo, 100% en el navegador (instantáneo, sin servidor).
 * - Ignora tildes y mayúsculas ("serum" = "Sérum")
 * - Sinónimos venezolanos ("pestañina" = "máscara")
 * - Tolera errores de escritura ("serun", "rimel", "labail")
 * - Autocompleta por prefijo desde la 2.ª letra
 * Cuando el catálogo pase de ~500 SKUs se puede migrar a Postgres full-text
 * (pg_trgm) o Algolia manteniendo la misma interfaz `searchProducts()`.
 */

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const groups = synonymGroups.map((g) => g.map(normalize));

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

interface IndexedProduct {
  product: Product;
  fields: { tokens: string[]; text: string; weight: number }[];
}

let cache: { source: Product[]; index: IndexedProduct[] } | null = null;

function buildIndex(list: Product[]): IndexedProduct[] {
  return list.map((p) => {
    const cat = categories.find((c) => c.slug === p.category);
    const sub = cat?.subcategories.find((s) => s.slug === p.subcategory)?.name ?? "";
    const raw: [string, number][] = [
      [p.name, 5],
      [p.brand, 3],
      [`${sub} ${cat?.name ?? ""}`, 3],
      [[...(p.keywords ?? []), ...(p.needs ?? []), p.finish ?? "", ...(p.skinTypes ?? [])].join(" "), 2],
      [p.variants.map((v) => v.name).join(" "), 2],
      [`${p.short} ${p.benefits.join(" ")}`, 1],
    ];
    return {
      product: p,
      fields: raw.map(([t, weight]) => {
        const text = normalize(t);
        return { text, tokens: text.split(" ").filter(Boolean), weight };
      }),
    };
  });
}

function getIndex(list: Product[]) {
  if (!cache || cache.source !== list) cache = { source: list, index: buildIndex(list) };
  return cache.index;
}

/** Expande una consulta con sus sinónimos (frases completas o palabras sueltas) */
function expand(query: string): string[][] {
  const tokens = query.split(" ").filter(Boolean);
  const alternatives: string[][] = tokens.map((t) => [t]);
  // Sinónimos de palabra
  tokens.forEach((t, i) => {
    for (const g of groups) if (g.includes(t)) alternatives[i] = Array.from(new Set([...alternatives[i], ...g]));
  });
  // Sinónimos de frase completa ("body mist", "protector solar")
  for (const g of groups) {
    if (g.some((term) => term.includes(" ") && query.includes(term))) {
      return [g];
    }
  }
  return alternatives;
}

function matchScore(term: string, field: IndexedProduct["fields"][number], allowFuzzy: boolean): number {
  if (term.includes(" ")) return field.text.includes(term) ? 1 : 0;
  // La tolerancia a errores solo aplica a lo que escribió la clienta (no a sinónimos)
  // y nunca sobre descripciones largas, para no traer resultados ruidosos.
  const fuzzy = allowFuzzy && field.weight >= 2;
  let best = 0;
  for (const tok of field.tokens) {
    if (tok === term) return 1;
    if (term.length >= 2 && tok.startsWith(term)) best = Math.max(best, 0.85);
    else if (fuzzy && term.length >= 4) {
      const max = term.length >= 7 ? 2 : 1;
      const whole = levenshtein(term, tok, max);
      const prefix = tok.length > term.length ? levenshtein(term, tok.slice(0, term.length), max) : whole;
      if (Math.min(whole, prefix) <= max) best = Math.max(best, 0.6);
    }
  }
  return best;
}

export function searchProducts(query: string, list: Product[], limit = 24): Product[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const alternatives = expand(q);
  const scored: { p: Product; score: number }[] = [];

  for (const item of getIndex(list)) {
    let total = 0;
    let allMatched = true;
    for (const options of alternatives) {
      let bestForToken = 0;
      for (const [oi, opt] of options.entries()) {
        for (const f of item.fields) {
          const s = matchScore(opt, f, oi === 0) * f.weight;
          if (s > bestForToken) bestForToken = s;
        }
      }
      if (bestForToken === 0) {
        allMatched = false;
        break;
      }
      total += bestForToken;
    }
    if (allMatched) scored.push({ p: item.product, score: total + item.product.rating / 10 });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.p);
}

/** Sugerencias de categorías/subcategorías para el panel del buscador */
export function suggestCategories(query: string) {
  const q = normalize(query);
  if (q.length < 2) return [];
  const out: { label: string; href: string }[] = [];
  for (const c of categories) {
    if (normalize(c.name).startsWith(q)) out.push({ label: c.name, href: `/categoria/${c.slug}` });
    for (const s of c.subcategories) {
      if (normalize(s.name).includes(q))
        out.push({ label: `${s.name} · ${c.name}`, href: `/categoria/${c.slug}?sub=${s.slug}` });
    }
  }
  return out.slice(0, 4);
}
