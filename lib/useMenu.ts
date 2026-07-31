"use client";

import { useEffect, useState } from "react";
import { fetchMenu } from "./menuRepo";
import type { MenuData } from "./types";

// Customer menu — reads live from Firestore only. Starts empty (loading) and
// shows the database result; no bundled/mock content is ever displayed to
// guests. (The bundled menu in data/menu.ts is used solely to seed Firestore.)
export function useMenu() {
  const [data, setData] = useState<MenuData>({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchMenu()
      .then((next) => {
        if (alive) setData(next);
      })
      .catch(() => {
        /* leave empty; UI shows the updating state */
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
