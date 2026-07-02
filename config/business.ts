// Real Alara Balık Express business data — wired in verbatim.
// Single source of truth for header, footer, metadata and JSON-LD.

export const business = {
  name: "Alara Balık Express",
  shortName: "Alara Express",
  tagline: "1975'ten beri Ege'nin en taze lezzetleri",
  since: 1975,
  logo: "/LLOGO.png",

  about:
    "Kepez Balık Çarşısı'nın içinde, 1975'ten bu yana ailemizle hizmet veren, alkolsüz bir balık restoranıyız. Akdeniz'in günlük taze avını tezgahtan seçebilir ya da mangalda pişmiş olarak sofranıza getirtebilirsiniz. Zengin meze ve ara sıcak çeşitleri, Ege zeytinyağlıları ve açık hava çatı terasımızla sizi bekliyoruz.",

  googleRating: 4.8,
  ratingCount: 960,
  googleMapsUrl: "https://maps.google.com/?q=Alara+Bal%C4%B1k+Express+Kepez+Antalya",

  address: {
    full: "Kepez Balık Çarşısı ve Organik Ürün Pazarı No:4, 07090 Kepez/Antalya",
    street: "Kepez Balık Çarşısı ve Organik Ürün Pazarı No:4",
    postalCode: "07090",
    district: "Kepez",
    city: "Antalya",
    country: "TR",
  },

  phones: ["0242 446 11 11", "0536 966 36 52"],
  whatsapp: "https://wa.me/905369663652",
  whatsappNumber: "905369663652",

  instagram: "https://www.instagram.com/alaraexpress/",
  facebook: "https://www.facebook.com/alaraexpress",

  hours: "Her gün 12:00 – 22:00",
  hoursShort: "Her gün 12:00–22:00",

  currency: "₺",
  currencyCode: "TRY",
  locale: "tr_TR",

  siteUrl: "https://alara-balik-express.vercel.app",
} as const;

/** Turns a display phone like "0242 446 11 11" into a tel: href. */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Convert local Turkish numbers (leading 0) to +90 international.
  if (digits.startsWith("0")) return `tel:+90${digits.slice(1)}`;
  return `tel:${digits}`;
}
