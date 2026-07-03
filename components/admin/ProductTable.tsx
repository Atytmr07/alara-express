"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatCalories } from "@/lib/format";
import ReorderControls from "./ReorderControls";

// Inline price editor — commits on blur / Enter, reverts invalid input.
function InlinePrice({
  value,
  productName,
  onCommit,
}: {
  value: number;
  productName: string;
  onCommit: (price: number) => void;
}) {
  const [str, setStr] = useState(String(value));

  useEffect(() => {
    setStr(String(value));
  }, [value]);

  const commit = () => {
    const n = Number(str);
    if (Number.isFinite(n) && n >= 0) onCommit(Math.round(n));
    else setStr(String(value));
  };

  return (
    <div className="flex items-center rounded-lg border border-line bg-foam pr-2 focus-within:border-sea">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={5}
        value={str}
        onChange={(e) => setStr(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        aria-label={`${productName} fiyatı`}
        className="min-h-[40px] w-16 bg-transparent px-2 text-sm font-bold tabular-nums text-sea outline-none"
      />
      <span className="text-xs text-ink-muted" aria-hidden="true">
        ₺
      </span>
    </div>
  );
}

function ActiveToggle({
  active,
  onToggle,
  productName,
}: {
  active: boolean;
  onToggle: () => void;
  productName: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${productName} ${active ? "aktif" : "pasif"} — değiştir`}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        active ? "bg-sea" : "bg-line"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function ProductTable({
  categories,
  products,
  onEdit,
  onDelete,
  onPriceChange,
  onToggleActive,
  onReorder,
}: {
  categories: Category[];
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPriceChange: (id: string, price: number) => void;
  onToggleActive: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => {
        const items = products.filter((p) => p.categoryId === category.id);
        if (!items.length) return null;

        return (
          <section key={category.id} aria-label={category.name}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {category.name}
              </h3>
              <span className="text-xs text-ink-muted">
                {items.length} ürün
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {items.map((product, i) => (
                <li
                  key={product.id}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-foam p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <ReorderControls
                      label={product.name}
                      canUp={i > 0}
                      canDown={i < items.length - 1}
                      onUp={() => onReorder(product.id, "up")}
                      onDown={() => onReorder(product.id, "down")}
                    />
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sea-wash">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {product.name}
                        {product.isFeatured && (
                          <span className="ml-2 rounded-full bg-coral/15 px-1.5 py-0.5 text-[10px] font-semibold text-coral">
                            Öne çıkan
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {formatCalories(product.calories)}
                        {product.portion ? ` · ${product.portion}` : ""}
                        {product.allergens ? ` · ${product.allergens}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <InlinePrice
                      value={product.price}
                      productName={product.name}
                      onCommit={(price) => onPriceChange(product.id, price)}
                    />

                    <ActiveToggle
                      active={product.isActive}
                      productName={product.name}
                      onToggle={() => onToggleActive(product.id)}
                    />

                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      aria-label={`${product.name} düzenle`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-foam text-ink-soft transition-colors hover:bg-sea-wash hover:text-sea"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      aria-label={`${product.name} sil`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-foam text-ink-soft transition-colors hover:bg-coral/10 hover:text-coral"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
