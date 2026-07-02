"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_MENU } from "@/data/menu";
import { MENU_STORAGE_KEY } from "@/lib/constants";
import type { MenuData, Product } from "@/lib/types";

// Central menu store for BOTH surfaces (customer + admin).
// On first run it seeds localStorage from the mock file; afterwards it reads &
// writes localStorage so demo edits persist across refreshes and show up on the
// customer menu. There is no server involved.

/** Deep-ish clone of the mock so we never mutate the imported module object. */
function seedData(): MenuData {
  return {
    categories: INITIAL_MENU.categories.map((c) => ({ ...c })),
    products: INITIAL_MENU.products.map((p) => ({ ...p })),
  };
}

function readStorage(): MenuData | null {
  try {
    const raw = window.localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MenuData;
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(data: MenuData) {
  try {
    window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage may be full (large base64 images) or unavailable — degrade quietly.
  }
}

export interface UseMenuData {
  data: MenuData;
  /** True once localStorage has been read on the client (avoids hydration flash). */
  hydrated: boolean;
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  setPrice: (id: string, price: number) => void;
  toggleActive: (id: string) => void;
  resetToSeed: () => void;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `p-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useMenuData(): UseMenuData {
  // Initialise with deterministic seed data so server render === first client
  // render (no hydration mismatch). Real localStorage is read after mount.
  const [data, setData] = useState<MenuData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setData(stored);
    } else {
      const seeded = seedData();
      writeStorage(seeded);
      setData(seeded);
    }
    setHydrated(true);

    // Keep multiple open tabs (e.g. admin + customer preview) in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === MENU_STORAGE_KEY) {
        const next = readStorage();
        if (next) setData(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: MenuData) => {
    setData(next);
    writeStorage(next);
  }, []);

  const addProduct = useCallback<UseMenuData["addProduct"]>(
    (product) => {
      const created: Product = { ...product, id: makeId() };
      setData((prev) => {
        const next = { ...prev, products: [...prev.products, created] };
        writeStorage(next);
        return next;
      });
      return created;
    },
    [],
  );

  const updateProduct = useCallback<UseMenuData["updateProduct"]>((product) => {
    setData((prev) => {
      const next = {
        ...prev,
        products: prev.products.map((p) => (p.id === product.id ? { ...product } : p)),
      };
      writeStorage(next);
      return next;
    });
  }, []);

  const deleteProduct = useCallback<UseMenuData["deleteProduct"]>((id) => {
    setData((prev) => {
      const next = { ...prev, products: prev.products.filter((p) => p.id !== id) };
      writeStorage(next);
      return next;
    });
  }, []);

  const setPrice = useCallback<UseMenuData["setPrice"]>((id, price) => {
    setData((prev) => {
      const next = {
        ...prev,
        products: prev.products.map((p) => (p.id === id ? { ...p, price } : p)),
      };
      writeStorage(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback<UseMenuData["toggleActive"]>((id) => {
    setData((prev) => {
      const next = {
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, isActive: !p.isActive } : p,
        ),
      };
      writeStorage(next);
      return next;
    });
  }, []);

  const resetToSeed = useCallback(() => {
    commit(seedData());
  }, [commit]);

  return {
    data,
    hydrated,
    addProduct,
    updateProduct,
    deleteProduct,
    setPrice,
    toggleActive,
    resetToSeed,
  };
}
