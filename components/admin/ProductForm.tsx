"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import ImageUploader from "./ImageUploader";

export interface ProductFormValues {
  categoryId: string;
  name: string;
  description: string;
  allergens: string;
  calories: number;
  portion: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-sea" : "bg-line"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

const labelCls = "block text-sm font-semibold text-ink";
const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-foam px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-sea";

export default function ProductForm({
  open,
  editing,
  categories,
  busy = false,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  editing: Product | null;
  categories: Category[];
  busy?: boolean;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}) {
  const reduce = useReducedMotion();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [allergens, setAllergens] = useState("");
  const [caloriesStr, setCaloriesStr] = useState("");
  const [portion, setPortion] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  // Reset the form whenever it opens (for add) or targets a new product (edit).
  useEffect(() => {
    if (!open) return;
    setError("");
    setName(editing?.name ?? "");
    setCategoryId(editing?.categoryId ?? categories[0]?.id ?? "");
    setDescription(editing?.description ?? "");
    setAllergens(editing?.allergens ?? "");
    setCaloriesStr(editing ? String(editing.calories) : "");
    setPortion(editing?.portion ?? "");
    setPriceStr(editing ? String(editing.price) : "");
    setImageUrl(editing?.imageUrl ?? "");
    setIsFeatured(editing?.isFeatured ?? false);
    setIsActive(editing?.isActive ?? true);
  }, [open, editing, categories]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Ürün adı zorunludur.");
      return;
    }
    if (!categoryId) {
      setError("Lütfen bir kategori seçin.");
      return;
    }
    const price = Number(priceStr);
    if (!Number.isFinite(price) || price < 0) {
      setError("Geçerli bir fiyat girin.");
      return;
    }
    const calories = Number(caloriesStr);
    if (!Number.isFinite(calories) || calories < 0) {
      setError("Geçerli bir kalori değeri girin.");
      return;
    }

    onSubmit({
      name: trimmed,
      categoryId,
      description: description.trim(),
      allergens: allergens.trim(),
      calories: Math.round(calories),
      portion: portion.trim(),
      price: Math.round(price),
      imageUrl: imageUrl.trim(),
      isFeatured,
      isActive,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editing ? "Ürünü düzenle" : "Yeni ürün ekle"}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-shell p-5 shadow-warm-lg sm:rounded-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">
                {editing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Kapat"
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-sand"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="pf-name" className={labelCls}>
                  Ürün Adı
                </label>
                <input
                  id="pf-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  placeholder="Örn. Levrek Izgara"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="pf-category" className={labelCls}>
                  Kategori
                </label>
                <select
                  id="pf-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pf-desc" className={labelCls}>
                  Açıklama
                </label>
                <textarea
                  id="pf-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Kısa, iştah açıcı bir açıklama"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pf-price" className={labelCls}>
                    Fiyat (₺)
                  </label>
                  <input
                    id="pf-price"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5}
                    value={priceStr}
                    onChange={(e) => setPriceStr(e.target.value)}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="pf-allergens" className={labelCls}>
                    Alerjenler
                  </label>
                  <input
                    id="pf-allergens"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    className={inputCls}
                    placeholder="Örn. Balık, Gluten"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pf-calories" className={labelCls}>
                    Kalori (kcal)
                  </label>
                  <input
                    id="pf-calories"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5}
                    value={caloriesStr}
                    onChange={(e) => setCaloriesStr(e.target.value)}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="pf-portion" className={labelCls}>
                    Porsiyon
                  </label>
                  <input
                    id="pf-portion"
                    value={portion}
                    onChange={(e) => setPortion(e.target.value)}
                    className={inputCls}
                    placeholder="Örn. 300 g / 330 ml"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <span className={labelCls}>Görsel</span>
                <div className="mt-1.5">
                  <ImageUploader value={imageUrl} onChange={setImageUrl} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-line bg-foam px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Öne Çıkar</p>
                  <p className="text-xs text-ink-muted">Coral “Günün Balığı” rozeti</p>
                </div>
                <Toggle
                  checked={isFeatured}
                  onChange={setIsFeatured}
                  label="Öne çıkar"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-line bg-foam px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Aktif</p>
                  <p className="text-xs text-ink-muted">Menüde görünsün</p>
                </div>
                <Toggle checked={isActive} onChange={setIsActive} label="Aktif" />
              </div>

              {error && <p className="text-sm text-coral">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-line bg-foam px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep disabled:opacity-60"
                >
                  {busy && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {editing ? "Kaydet" : "Ekle"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
