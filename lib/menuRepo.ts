// Read path for the menu (used by the public customer page and admin load).
// One-time fetch via firestore/lite — no realtime listeners, no open sockets.
// Falls back to the bundled mock when Firebase isn't configured.

import { collection, getDocs } from "firebase/firestore/lite";
import { getDb } from "./firebase";
import { INITIAL_MENU } from "@/data/menu";
import type { Category, MenuData, Product } from "./types";

export const CATEGORIES_COL = "categories";
export const PRODUCTS_COL = "products";

/** Mock menu with a stable order applied — read fallback + seed source. */
export function mockMenu(): MenuData {
  return {
    categories: INITIAL_MENU.categories.map((c, i) => ({
      ...c,
      order: c.order ?? i,
    })),
    products: INITIAL_MENU.products.map((p, i) => ({
      ...p,
      order: p.order ?? i,
    })),
  };
}

export function byOrder(
  a: { order?: number; name?: string },
  b: { order?: number; name?: string },
): number {
  const ao = a.order ?? 0;
  const bo = b.order ?? 0;
  if (ao !== bo) return ao - bo;
  return (a.name ?? "").localeCompare(b.name ?? "", "tr");
}

/** Fetch the whole menu once. Empty collections come back as empty arrays. */
export async function fetchMenu(): Promise<MenuData> {
  const db = getDb();
  if (!db) return mockMenu();

  const [catsSnap, prodsSnap] = await Promise.all([
    getDocs(collection(db, CATEGORIES_COL)),
    getDocs(collection(db, PRODUCTS_COL)),
  ]);

  const categories = catsSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }))
    .sort(byOrder);
  const products = prodsSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }))
    .sort(byOrder);

  return { categories, products };
}
