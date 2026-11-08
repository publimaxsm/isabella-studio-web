import type { Category, Collection } from "@/types";

export const categories: Category[] = [
  {
    slug: "maquillaje",
    name: "Maquillaje",
    tagline: "Color, textura y glow para cada momento",
    subcategories: [
      { slug: "rostro", name: "Rostro" },
      { slug: "ojos", name: "Ojos" },
      { slug: "cejas", name: "Cejas" },
      { slug: "labios", name: "Labios" },
      { slug: "unas", name: "Uñas" },
    ],
  },
  {
    slug: "skincare",
    name: "Skincare",
    tagline: "Rutinas que se notan, piel que se siente",
    subcategories: [
      { slug: "limpieza", name: "Limpieza" },
      { slug: "serums", name: "Sérums" },
      { slug: "hidratantes", name: "Hidratantes" },
      { slug: "protector-solar", name: "Protector solar" },
      { slug: "mascarillas", name: "Mascarillas" },
    ],
  },
  {
    slug: "cabello",
    name: "Cabello",
    tagline: "Brillo, fuerza y rizos definidos",
    subcategories: [
      { slug: "tratamientos", name: "Tratamientos" },
      { slug: "aceites", name: "Aceites y sérums" },
      { slug: "styling", name: "Styling" },
      { slug: "shampoo", name: "Shampoo y acondicionador" },
    ],
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    tagline: "Tu firma, en una nota",
    subcategories: [
      { slug: "perfumes", name: "Perfumes" },
      { slug: "body-mist", name: "Body mist / splash" },
      { slug: "sets", name: "Sets de regalo" },
    ],
  },
  {
    slug: "herramientas",
    name: "Herramientas",
    tagline: "Lo que hace la diferencia en el acabado",
    subcategories: [
      { slug: "brochas", name: "Brochas" },
      { slug: "esponjas", name: "Esponjas y aplicadores" },
      { slug: "pestanas", name: "Encrespadores y pinzas" },
      { slug: "termicas", name: "Secadores y planchas" },
    ],
  },
];

export const collectionsMeta: Record<Collection, { name: string; description: string }> = {
  novedades: { name: "Novedades", description: "Lo último que llegó al studio" },
  "mas-vendidos": { name: "Más vendidos", description: "Los favoritos de nuestras clientas" },
  ofertas: { name: "Ofertas", description: "Precios especiales por tiempo limitado" },
  "kits-regalos": { name: "Kits y regalos", description: "Listos para regalar (o regalarte)" },
  "menos-de-10": { name: "Menos de $10", description: "Caprichos que no pesan" },
  rutinas: { name: "Rutinas completas", description: "Todo lo que necesitas, en orden" },
};

/** "Comprar por necesidad": chips del home y colecciones curadas */
export const needs = [
  { slug: "piel-grasa", name: "Piel grasa" },
  { slug: "hidratacion", name: "Hidratación" },
  { slug: "manchas", name: "Manchas" },
  { slug: "glow", name: "Glow" },
  { slug: "larga-duracion", name: "Larga duración" },
  { slug: "frizz", name: "Frizz" },
  { slug: "rizos", name: "Rizos" },
  { slug: "regalo", name: "Para regalar" },
];
