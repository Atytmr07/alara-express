// Shared domain types for both the customer menu and the admin panel.

export interface Category {
  /** Stable identifier used to link products → categories. */
  id: string;
  /** URL/anchor-friendly slug used for section ids and scroll-spy. */
  slug: string;
  /** Display name (Turkish). */
  name: string;
  /** Optional short line shown under the section header. */
  subtitle?: string;
  /** Hero image shown on the category tile. */
  image?: string;
}

export interface Product {
  id: string;
  /** References Category.id */
  categoryId: string;
  name: string;
  description: string;
  /** Free-text allergen list, e.g. "Balık, Gluten". Empty string = none. */
  allergens: string;
  /** Energy per portion in kcal — mandatory on TR menus since 01.07.2026. */
  calories: number;
  /** Portion size / weight, e.g. "300 g" or "330 ml" (gramaj). */
  portion: string;
  /** Price in Turkish Lira (₺), integer. */
  price: number;
  /** Remote URL or base64 dataURL (admin uploads). Empty => branded fallback. */
  imageUrl: string;
  /** Highlights the item with the coral "Günün Balığı" badge. */
  isFeatured: boolean;
  /** Only active products show on the customer menu. */
  isActive: boolean;
}

export interface MenuData {
  categories: Category[];
  products: Product[];
}
