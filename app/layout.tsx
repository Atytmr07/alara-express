import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { business } from "@/config/business";

// Modern, characterful display grotesque + a crisp neutral body. latin-ext is
// included so Turkish glyphs (ş, ğ, İ, ı…) render in the chosen fonts.
const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const viewport: Viewport = {
  themeColor: "#F5EFE6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} — QR Menü`,
    template: `%s · ${business.name}`,
  },
  description:
    "Antalya Kepez Balık Çarşısı'nda 1975'ten beri taze balık, meze ve ızgara. Günün avını tezgahtan seçin, mangalda pişsin. Dijital menümüzü keşfedin.",
  applicationName: business.name,
  keywords: [
    "Alara Balık Express",
    "Antalya balık restoranı",
    "Kepez balık çarşısı",
    "taze balık",
    "meze",
    "ızgara balık",
    "dijital menü",
    "QR menü",
  ],
  authors: [{ name: business.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: business.name,
    title: `${business.name} — Dijital Menü`,
    description:
      "1975'ten beri Ege'nin en taze lezzetleri. Meze, ara sıcak, ızgara balık ve daha fazlası.",
    images: [
      {
        url: business.logo,
        width: 900,
        height: 630,
        alt: `${business.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — Dijital Menü`,
    description: "1975'ten beri Ege'nin en taze lezzetleri.",
    images: [business.logo],
  },
  icons: {
    icon: business.logo,
    apple: business.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
