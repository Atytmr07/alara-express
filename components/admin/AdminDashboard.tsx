"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Loader2,
  LogOut,
  Plus,
  RotateCcw,
} from "lucide-react";
import { business } from "@/config/business";
import { ADMIN_FLAG_KEY } from "@/lib/constants";
import { useMenuData } from "@/lib/useMenuData";
import type { Product } from "@/lib/types";
import ProductTable from "./ProductTable";
import ProductForm, { type ProductFormValues } from "./ProductForm";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    data,
    addProduct,
    updateProduct,
    deleteProduct,
    setPrice,
    toggleActive,
    resetToSeed,
  } = useMenuData();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Client-side demo gate (NOT real auth).
  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      window.localStorage.getItem(ADMIN_FLAG_KEY) === "1";
    if (!ok) router.replace("/admin/login");
    else setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sea">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (editing) {
      updateProduct({ ...editing, ...values });
      setToast("Ürün güncellendi");
    } else {
      addProduct(values);
      setToast("Ürün eklendi");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setToast("Ürün silindi");
    setDeleteTarget(null);
  };

  const handleReset = () => {
    resetToSeed();
    setConfirmReset(false);
    setToast("Demo menüsü sıfırlandı");
  };

  const logout = () => {
    window.localStorage.removeItem(ADMIN_FLAG_KEY);
    router.replace("/admin/login");
  };

  const total = data.products.length;
  const active = data.products.filter((p) => p.isActive).length;
  const featured = data.products.filter((p) => p.isFeatured).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <Image
            src={business.logo}
            alt={`${business.name} logosu`}
            width={48}
            height={34}
            className="h-auto w-11"
          />
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">
              Yönetim Paneli
            </h1>
            <p className="text-xs text-ink-muted">Demo · {business.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/menu"
            target="_blank"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-foam px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-sea-wash"
          >
            <ExternalLink className="h-4 w-4 text-sea" aria-hidden="true" />
            <span className="hidden sm:inline">Menüyü Gör</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-foam px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Toplam ürün", value: total },
          { label: "Aktif", value: active },
          { label: "Öne çıkan", value: featured },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-foam px-3 py-3 text-center"
          >
            <p className="font-display text-2xl font-semibold text-ink tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Ürün Ekle
        </button>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          aria-label="Demo menüsünü sıfırla"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-line bg-foam px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sıfırla</span>
        </button>
      </div>

      {/* Product list */}
      <div className="mt-6">
        {total === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-foam px-4 py-12 text-center text-sm text-ink-muted">
            Henüz ürün yok. “Yeni Ürün Ekle” ile başlayın.
          </p>
        ) : (
          <ProductTable
            categories={data.categories}
            products={data.products}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onPriceChange={setPrice}
            onToggleActive={toggleActive}
          />
        )}
      </div>

      {/* Overlays */}
      <ProductForm
        open={formOpen}
        editing={editing}
        categories={data.categories}
        onSubmit={handleSubmit}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Ürünü sil"
        message={
          deleteTarget
            ? `“${deleteTarget.name}” menüden kalıcı olarak silinecek. Bu işlem geri alınamaz.`
            : ""
        }
        confirmLabel="Sil"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={confirmReset}
        title="Demoyu sıfırla"
        message="Tüm değişiklikler silinip başlangıç menüsü geri yüklenecek."
        confirmLabel="Sıfırla"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
