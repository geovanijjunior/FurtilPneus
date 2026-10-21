import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header/Header";
import { Providers } from "@/components/Providers";
import { WhatsFab } from "@/components/WhatsFab";
import { site } from "@/config/site";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});
const text = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Furtil Pneus — o pneu certo pela placa do carro",
    template: "%s · Furtil Pneus",
  },
  description:
    "Digite a placa e veja a medida de fábrica do seu pneu, com preço à vista na etiqueta. Lojas em Guarulhos, Tremembé e Vila Formosa.",
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Header />
          <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <WhatsFab />
        </Providers>
      </body>
    </html>
  );
}
