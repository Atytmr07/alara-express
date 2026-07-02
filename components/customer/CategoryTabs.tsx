"use client";

import { useEffect, useRef } from "react";
import type { Category } from "@/lib/types";

// Sticky category bar. Tapping a tab scrolls the screen to that section; the
// scroll-spy in MenuClient keeps the active tab synced and this component
// auto-scrolls the active tab into view.
export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const nav = navRef.current;
    const tab = tabRefs.current[activeId];
    if (!nav || !tab) return;
    const target = tab.offsetLeft - nav.clientWidth / 2 + tab.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  return (
    <nav
      aria-label="Menü kategorileri"
      className="sticky top-0 z-40 border-b border-line bg-shell/95 backdrop-blur-md"
    >
      <div
        ref={navRef}
        role="tablist"
        aria-orientation="horizontal"
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-2"
      >
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <button
              key={category.id}
              ref={(el) => {
                tabRefs.current[category.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={category.slug}
              onClick={() => onSelect(category.id)}
              className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-4 text-xs font-semibold uppercase tracking-wide transition-colors ${
                active
                  ? "bg-sea text-white shadow-warm"
                  : "bg-foam text-ink-soft hover:bg-sea-wash active:bg-sea-wash"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
