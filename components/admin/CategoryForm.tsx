"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type { Category } from "@/lib/types";
import ImageUploader from "./ImageUploader";

export interface CategoryFormValues {
  name: string;
  subtitle: string;
  image: string;
}

const labelCls = "block text-sm font-semibold text-ink";
const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-foam px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-sea";

export default function CategoryForm({
  open,
  editing,
  busy = false,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  editing: Category | null;
  busy?: boolean;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
}) {
  const reduce = useReducedMotion();

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setName(editing?.name ?? "");
    setSubtitle(editing?.subtitle ?? "");
    setImage(editing?.image ?? "");
  }, [open, editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Kategori adı zorunludur.");
      return;
    }
    onSubmit({ name: trimmed, subtitle: subtitle.trim(), image: image.trim() });
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
          aria-label={editing ? "Kategoriyi düzenle" : "Yeni kategori ekle"}
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
                {editing ? "Kategoriyi Düzenle" : "Yeni Kategori"}
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
                <label htmlFor="cf-name" className={labelCls}>
                  Kategori Adı
                </label>
                <input
                  id="cf-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  placeholder="Örn. Izgara Balıklar"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="cf-subtitle" className={labelCls}>
                  Alt Başlık (isteğe bağlı)
                </label>
                <input
                  id="cf-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className={inputCls}
                  placeholder="Örn. Mangalda, zeytinyağı ve limon ile"
                  autoComplete="off"
                />
              </div>

              <div>
                <span className={labelCls}>Kapak Görseli</span>
                <div className="mt-1.5">
                  <ImageUploader value={image} onChange={setImage} />
                </div>
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
