import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { themeScript } from "@/components/theme/ThemeToggle";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: {
    default: "Isabella Studio · Tu universo de belleza",
    template: "%s · Isabella Studio",
  },
  description:
    "Maquillaje, skincare, cabello, perfumes y herramientas originales en Coro, Falcón. Envíos a toda Venezuela. Paga con Pago Móvil, Zelle, USDT o Cashea.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F6F0" },
    { media: "(prefers-color-scheme: dark)", color: "#141110" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-VE" data-theme="light" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Aplica modo claro/oscuro ANTES de pintar: sin parpadeo */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh" style={{ ["--emblem-url" as string]: `url("${asset("/brand/emblema-mask.png")}")` }}>
        <ShopProvider>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-btn focus:px-4 focus:py-2 focus:text-btn-ink">
            Saltar al contenido
          </a>
          <AnnouncementBar />
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFab />
          <CartDrawer />
          <SearchOverlay />
        </ShopProvider>
      </body>
    </html>
  );
}
