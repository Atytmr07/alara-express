import type { Category, Product } from "@/lib/types";

// -----------------------------------------------------------------------------
// STARTER MENU — Alara Balık Express'in gerçek menüsü (basılı menüden aktarıldı).
// Fiyatlar gerçek; kalori (kcal) ve porsiyon (gramaj) alanları boş bırakıldı —
// yasa gereği bunları işletme admin panelinden kendi değerleriyle doldurmalı.
// Fotoğraflar da panelden yüklenecek (imageUrl boş → logo balık silüeti gösterir).
// Fiyatı belirsiz kalemler price: 0 → menüde "Sorunuz" olarak görünür.
// -----------------------------------------------------------------------------

/** Build a tuned Unsplash URL (used for category banners only). */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=70&auto=format&fit=crop`;

export const CATEGORIES: Category[] = [
  { id: "corbalar", slug: "corbalar", name: "Çorbalar", subtitle: "Sıcacık başlangıçlar" },
  {
    id: "salatalar",
    slug: "salatalar",
    name: "Salatalar",
    subtitle: "Taze ve mevsimlik",
    image: img("1546069901-ba9599a7e63c"),
  },
  {
    id: "mezeler",
    slug: "mezeler",
    name: "Mezeler",
    subtitle: "Zeytinyağlılar ve soğuk başlangıçlar",
    image: img("1540914124281-342587941389"),
  },
  {
    id: "ara-sicaklar",
    slug: "ara-sicaklar",
    name: "Ara Sıcaklar",
    subtitle: "Tava, güveç ve ızgara",
    image: img("1604909052743-94e838986d24"),
  },
  {
    id: "porsiyon-baliklar",
    slug: "porsiyon-baliklar",
    name: "Porsiyon Balıklar",
    subtitle: "Izgara, buğulama ve daha fazlası",
    image: img("1553621042-f6e147245754"),
  },
  {
    id: "cig-baliklar",
    slug: "cig-baliklar",
    name: "Çiğ Balıklar",
    subtitle: "Tezgahtan, günlük taze",
    image: img("1559737558-2f5a35f4523b"),
  },
  {
    id: "meshrubatlar",
    slug: "meshrubatlar",
    name: "Meşrubatlar",
    subtitle: "Serinlikler",
    image: img("1519708227418-c8fd9a32b7a2"),
  },
  {
    id: "tatlilar",
    slug: "tatlilar",
    name: "Tatlılar",
    subtitle: "Tatlı final",
    image: img("1621996346565-e3dbc646d9a9"),
  },
];

// Helper to keep product rows compact & consistent.
function p(
  id: string,
  categoryId: string,
  name: string,
  price: number,
  allergens: string,
  description: string,
): Product {
  return {
    id,
    categoryId,
    name,
    description,
    allergens,
    calories: 0,
    portion: "",
    price,
    imageUrl: "",
    isFeatured: false,
    isActive: true,
  };
}

export const PRODUCTS: Product[] = [
  // --- Çorbalar ---
  p("balik-corbasi", "corbalar", "Balık Çorbası", 295, "Balık", "Günün balığından, sıcacık."),
  p("gunun-corbasi", "corbalar", "Günün Çorbası", 0, "", "Günün çorbası — lütfen sorunuz."),

  // --- Salatalar ---
  p("alara-salata-tek", "salatalar", "Alara Salata (Tek)", 275, "", "Alara usulü özel salata."),
  p("alara-salata-duble", "salatalar", "Alara Salata (Duble)", 375, "", "Alara usulü özel salata — duble porsiyon."),
  p("kasik-salata-tek", "salatalar", "Kaşık Salata (Tek)", 275, "", "İnce doğranmış mevsim salatası."),
  p("kasik-salata-duble", "salatalar", "Kaşık Salata (Duble)", 375, "", "İnce doğranmış mevsim salatası — duble."),
  p("coban-salata-tek", "salatalar", "Çoban Salata (Tek)", 275, "", "Domates, salatalık, biber ve soğan."),
  p("coban-salata-duble", "salatalar", "Çoban Salata (Duble)", 375, "", "Klasik çoban salata — duble."),
  p("gavurdag-salata-tek", "salatalar", "Gavurdağ Salata (Tek)", 325, "Kuruyemiş", "Cevizli, nar ekşili gavurdağ."),
  p("gavurdag-salata-duble", "salatalar", "Gavurdağ Salata (Duble)", 390, "Kuruyemiş", "Cevizli gavurdağ — duble."),
  p("roka-salata-tek", "salatalar", "Roka Salata (Tek)", 275, "", "Taze roka, limon ve zeytinyağı."),
  p("roka-salata-duble", "salatalar", "Roka Salata (Duble)", 375, "", "Taze roka — duble."),
  p("mevsim-salata-tek", "salatalar", "Mevsim Salata (Tek)", 260, "", "Mevsim yeşillikleri."),
  p("mevsim-salata-duble", "salatalar", "Mevsim Salata (Duble)", 295, "", "Mevsim yeşillikleri — duble."),

  // --- Mezeler (hepsi 220 ₺) ---
  p("atom", "mezeler", "Atom", 220, "Süt", "Acılı yoğurtlu meze."),
  p("expresso", "mezeler", "Expresso", 220, "", "Ev yapımı özel meze."),
  p("dolunay", "mezeler", "Dolunay", 220, "", "Ev yapımı özel meze."),
  p("girit-ezme", "mezeler", "Girit Ezme", 220, "", "Girit usulü otlu ezme."),
  p("girit-kabak", "mezeler", "Girit Kabak", 220, "", "Girit usulü kabaklı meze."),
  p("narli-meze", "mezeler", "Narlı Meze", 220, "", "Nar ekşili özel meze."),
  p("alara-special", "mezeler", "Alara Special", 220, "", "Alara'nın özel mezesi."),
  p("fava", "mezeler", "Fava", 220, "", "Zeytinyağlı fava."),
  p("hibes", "mezeler", "Hibeş", 220, "Susam", "Tahinli, acılı hibeş."),
  p("gelincik", "mezeler", "Gelincik", 220, "", "Ev yapımı meze."),
  p("cevizli-cunda", "mezeler", "Cevizli Cunda", 220, "Kuruyemiş", "Cevizli Cunda mezesi."),
  p("kopoglu", "mezeler", "Köpoğlu", 220, "Süt", "Patlıcan ve yoğurtlu köpoğlu."),
  p("saksuka", "mezeler", "Şakşuka", 220, "", "Kızarmış sebzeli şakşuka."),
  p("patlican-salata", "mezeler", "Patlıcan Salata", 220, "", "Közlenmiş patlıcan salatası."),
  p("incirli-kuru-domates", "mezeler", "İncirli Kuru Domates", 220, "", "İncir ve kuru domatesli meze."),

  // --- Ara Sıcaklar ---
  p("kalamar-tava", "ara-sicaklar", "Kalamar Tava", 490, "Kabuklu deniz ürünü, Gluten", "Çıtır kızarmış kalamar."),
  p("kalamar-izgara", "ara-sicaklar", "Kalamar Izgara", 490, "Kabuklu deniz ürünü", "Mangalda kalamar."),
  p("karides-tereyagli", "ara-sicaklar", "Karides Tereyağlı", 490, "Kabuklu deniz ürünü, Süt", "Tereyağında sote karides."),
  p("karides-guvec", "ara-sicaklar", "Karides Güveç", 490, "Kabuklu deniz ürünü", "Güveçte fırınlanmış karides."),
  p("ispanyol-karides", "ara-sicaklar", "İspanyol Karides", 595, "Kabuklu deniz ürünü", "Sarımsaklı İspanyol usulü karides."),
  p("balik-pastirmali-muska-boregi", "ara-sicaklar", "Balık Pastırmalı Muska Böreği", 290, "Balık, Gluten", "Balık pastırmalı çıtır muska böreği."),
  p("deniz-mahsulleri-boregi", "ara-sicaklar", "Deniz Mahsülleri Böreği", 290, "Kabuklu deniz ürünü, Gluten", "Deniz mahsullü çıtır börek."),
  p("deniz-mahsulleri-simit", "ara-sicaklar", "Deniz Mahsülleri Simit", 290, "Kabuklu deniz ürünü, Gluten", "Deniz mahsullü simit."),
  p("citir-avokado", "ara-sicaklar", "Çıtır Avokado", 350, "Gluten", "Çıtır kaplı avokado dilimleri."),
  p("kiremitte-mantar", "ara-sicaklar", "Kiremitte Mantar", 260, "Süt", "Kiremitte kaşarlı mantar."),
  p("ot-kavurma", "ara-sicaklar", "Ot Kavurma", 250, "", "Mevsim otları kavurma."),
  p("patates-tava", "ara-sicaklar", "Patates Tava", 290, "", "Çıtır patates kızartması."),
  p("ahtapot-izgara", "ara-sicaklar", "Ahtapot Izgara", 850, "Kabuklu deniz ürünü", "Mangalda yumuşacık ahtapot."),

  // --- Porsiyon Balıklar ---
  p("levrek-porsiyon", "porsiyon-baliklar", "Levrek Porsiyon", 480, "Balık", "Izgara ya da kızartma levrek."),
  p("cipura-porsiyon", "porsiyon-baliklar", "Çipura Porsiyon", 480, "Balık", "Izgara ya da kızartma çipura."),
  p("hamsi-porsiyon", "porsiyon-baliklar", "Hamsi Porsiyon", 250, "Balık", "Taze hamsi tava."),
  p("somon-porsiyon", "porsiyon-baliklar", "Somon Porsiyon", 390, "Balık", "Izgara somon."),
  p("istavrit-porsiyon", "porsiyon-baliklar", "İstavrit Porsiyon", 275, "Balık", "Taze istavrit tava."),
  p("lokum-porsiyon", "porsiyon-baliklar", "Lokum Porsiyon", 275, "Balık", "Lokum balığı porsiyon."),
  p("balik-buglama", "porsiyon-baliklar", "Balık Buğlama", 595, "Balık", "Sebzeli balık buğulama."),
  p("balik-kavurma", "porsiyon-baliklar", "Balık Kavurma", 595, "Balık", "Tavada balık kavurma."),
  p("balik-kokorec", "porsiyon-baliklar", "Balık Kokoreç", 595, "Balık", "Balıktan özel kokoreç."),
  p("balik-kofte", "porsiyon-baliklar", "Balık Köfte", 330, "Balık, Gluten", "Ev yapımı balık köfte."),
  p("kasap-kofte", "porsiyon-baliklar", "Kasap Köfte", 395, "Gluten", "Izgara kasap köfte."),
  p("tavuk-izgara", "porsiyon-baliklar", "Tavuk Izgara", 395, "", "Izgara tavuk."),
  p("ekmek-arasi-hamsi", "porsiyon-baliklar", "Ekmek Arası Hamsi", 210, "Balık, Gluten", "Ekmek arası hamsi."),
  p("ekmek-arasi-mezgit", "porsiyon-baliklar", "Ekmek Arası Mezgit", 290, "Balık, Gluten", "Ekmek arası mezgit."),
  p("ekmek-arasi-levrek", "porsiyon-baliklar", "Ekmek Arası Levrek", 290, "Balık, Gluten", "Ekmek arası levrek."),
  p("ekmek-arasi-cipura", "porsiyon-baliklar", "Ekmek Arası Çipura", 290, "Balık, Gluten", "Ekmek arası çipura."),
  p("mezgit-cips-patates", "porsiyon-baliklar", "Mezgit Cips Patates", 350, "Balık, Gluten", "Çıtır mezgit, cips patates eşliğinde."),

  // --- Çiğ Balıklar ---
  p(
    "gunun-cig-baligi",
    "cig-baliklar",
    "Günün Çiğ Balığı",
    0,
    "Balık",
    "Günün taze çiğ balıkları için tezgahımızdan bilgi alabilirsiniz.",
  ),

  // --- Meşrubatlar ---
  p("kola", "meshrubatlar", "Kola", 85, "", ""),
  p("fanta", "meshrubatlar", "Fanta", 85, "", ""),
  p("sprite", "meshrubatlar", "Sprite", 85, "", ""),
  p("salgam", "meshrubatlar", "Şalgam", 75, "", "Acılı ya da acısız."),
  p("fuse-tea", "meshrubatlar", "Fuse Tea", 85, "", ""),
  p("soda", "meshrubatlar", "Soda", 40, "", ""),
  p("turk-kahvesi", "meshrubatlar", "Türk Kahvesi", 60, "", "Közde pişmiş Türk kahvesi."),
  p("kucuk-su", "meshrubatlar", "Küçük Su", 30, "", ""),
  p("su-1lt", "meshrubatlar", "Su 1 LT", 60, "", ""),
  p("su-15lt", "meshrubatlar", "Su 1.5 LT", 65, "", ""),
  p("nigde-gazozu", "meshrubatlar", "Niğde Gazozu", 60, "", ""),
  p("sariyer-kola-gazoz", "meshrubatlar", "Sarıyer Kola / Gazoz", 85, "", ""),

  // --- Tatlılar ---
  p("incir-tatlisi", "tatlilar", "İncir Tatlısı", 395, "Kuruyemiş", "Cevizli incir tatlısı."),
  p("kabak-tatlisi", "tatlilar", "Kabak Tatlısı", 325, "Kuruyemiş", "Tahinli, cevizli kabak tatlısı."),
  p("dondurmali-irmik-tatlisi", "tatlilar", "Dondurmalı İrmik Tatlısı", 300, "Gluten, Süt, Kuruyemiş", "Dondurmalı sıcak irmik tatlısı."),
];

/** Immutable snapshot used to seed Firestore and as the read fallback. */
export const INITIAL_MENU = {
  categories: CATEGORIES,
  products: PRODUCTS,
};
