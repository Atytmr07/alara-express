// Turkish-safe slug generator for category anchors / ids.
const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

export function slugify(input: string): string {
  const normalized = input
    .trim()
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (m) => TR_MAP[m] ?? m)
    .toLowerCase();
  const slug = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "kategori";
}

/** Ensure the slug is unique against a set of existing slugs. */
export function uniqueSlug(base: string, existing: Set<string>): string {
  const slug = slugify(base);
  if (!existing.has(slug)) return slug;
  let n = 2;
  while (existing.has(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}
