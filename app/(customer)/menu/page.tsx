import type { Metadata } from "next";
import { business, toTelHref } from "@/config/business";
import { CATEGORIES, PRODUCTS } from "@/data/menu";
import GrainOverlay from "@/components/customer/GrainOverlay";
import MenuClient from "@/components/customer/MenuClient";

export const metadata: Metadata = {
  title: "Menü",
  description:
    "Alara Balık Express dijital menüsü — meze, ara sıcak, ızgara balık, deniz ürünleri, çiğ/taze balık, tatlı ve alkolsüz içecekler. Kalori ve porsiyon bilgileriyle. Antalya Kepez'de 1975'ten beri.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: `${business.name} — Menü`,
    description: "1975'ten beri Ege'nin en taze lezzetleri. Tüm menüyü keşfedin.",
    url: "/menu",
  },
};

// Restaurant + Menu structured data (incl. per-item nutrition), built from the
// canonical mock menu.
function buildJsonLd() {
  const telephone = toTelHref(business.phones[1]).replace("tel:", "");

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    description: business.about,
    image: `${business.siteUrl}${business.logo}`,
    url: `${business.siteUrl}/menu`,
    telephone,
    servesCuisine: ["Deniz ürünleri", "Akdeniz mutfağı", "Türk mutfağı"],
    priceRange: "₺₺",
    currenciesAccepted: business.currencyCode,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.district,
      addressRegion: business.address.city,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.googleRating,
      reviewCount: business.ratingCount,
      bestRating: 5,
      worstRating: 1,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "22:00",
    },
    sameAs: [business.instagram, business.facebook],
    hasMenu: {
      "@type": "Menu",
      name: `${business.name} Menü`,
      hasMenuSection: CATEGORIES.map((category) => ({
        "@type": "MenuSection",
        name: category.name,
        description: category.subtitle,
        hasMenuItem: PRODUCTS.filter(
          (p) => p.categoryId === category.id && p.isActive,
        ).map((product) => ({
          "@type": "MenuItem",
          name: product.name,
          description: product.description,
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${product.calories} kcal`,
            servingSize: product.portion,
          },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: business.currencyCode,
          },
        })),
      })),
    },
  };
}

export default function MenuPage() {
  const jsonLd = buildJsonLd();

  return (
    <main className="relative">
      <GrainOverlay />
      <MenuClient />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
