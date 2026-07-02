"use client";

import { useEffect, useState } from "react";
import { fetchMenu } from "./menuRepo";
import { INITIAL_MENU } from "@/data/menu";
import type { MenuData } from "./types";

// Customer menu: initialise with the bundled mock so the first paint is never
// empty (and SSR === first client render), then fetch the live menu once.
// If the fetch fails or Firestore is still empty, the mock stays as a safe
// fallback so the public page never looks broken.
const SEED: MenuData = {
  categories: INITIAL_MENU.categories,
  products: INITIAL_MENU.products,
};

export function useMenu() {
  const [data, setData] = useState<MenuData>(SEED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchMenu()
      .then((next) => {
        if (!alive) return;
        setData(next.products.length ? next : SEED);
      })
      .catch(() => {
        /* keep SEED */
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading };
}
