"use client";

import { useState } from "react";
import { ChevronDown, FolderPlus, Pencil, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import ReorderControls from "./ReorderControls";

// Collapsible category manager: add / edit / delete / reorder the categories.
export default function CategoryManager({
  categories,
  products,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
}: {
  categories: Category[];
  products: Product[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-foam">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center justify-between px-4 text-left"
      >
        <span className="text-sm font-semibold text-ink">
          Kategoriler
          <span className="ml-2 text-xs font-normal text-ink-muted">
            {categories.length}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-ink-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={onAdd}
            className="mb-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sea/40 bg-sea-wash px-4 text-sm font-semibold text-sea-deep transition-colors hover:bg-sea-wash/70"
          >
            <FolderPlus className="h-4 w-4" aria-hidden="true" />
            Kategori Ekle
          </button>

          <ul className="flex flex-col gap-2">
            {categories.map((category, i) => {
              const count = products.filter(
                (p) => p.categoryId === category.id,
              ).length;
              return (
                <li
                  key={category.id}
                  className="flex items-center gap-2 rounded-xl border border-line bg-shell p-2"
                >
                  <ReorderControls
                    label={category.name}
                    canUp={i > 0}
                    canDown={i < categories.length - 1}
                    onUp={() => onReorder(category.id, "up")}
                    onDown={() => onReorder(category.id, "down")}
                  />
                  <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sea-wash">
                    {category.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {category.name}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {count} ürün
                      {category.subtitle ? ` · ${category.subtitle}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    aria-label={`${category.name} düzenle`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-foam text-ink-soft transition-colors hover:bg-sea-wash hover:text-sea"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    aria-label={`${category.name} sil`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-foam text-ink-soft transition-colors hover:bg-coral/10 hover:text-coral"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
