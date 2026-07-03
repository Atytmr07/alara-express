"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  DatabaseZap,
  ExternalLink,
  Loader2,
  LogOut,
  Plus,
} from "lucide-react";
import { business } from "@/config/business";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import { useAuth } from "@/lib/useAuth";
import { fetchMenu } from "@/lib/menuRepo";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  seedMenu,
  updateCategory,
  updateProduct,
} from "@/lib/menuAdmin";
import { uniqueSlug } from "@/lib/slug";
import type { Category, MenuData, Product } from "@/lib/types";
import ProductTable from "./ProductTable";
import ProductForm, { type ProductFormValues } from "./ProductForm";
import CategoryManager from "./CategoryManager";
import CategoryForm, { type CategoryFormValues } from "./CategoryForm";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

function errorMessage(e: unknown): string {
  if (typeof e === "object" && e && "code" in e) {
    const code = String((e as { code: string }).code);
    if (code.includes("permission-denied")) {
      return "Yetki reddedildi. Güvenlik kurallarını ve admin e-postasını kontrol edin.";
    }
  }
  return e instanceof Error ? e.message : "Bir hata oluştu.";
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const [menu, setMenu] = useState<MenuData | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auth guard.
  useEffect(() => {
    if (ready && !user) router.replace("/admin/login");
  }, [ready, user, router]);

  const load = useCallback(async () => {
    try {
      setMenu(await fetchMenu());
    } catch {
      setMenu({ categories: [], products: [] });
    }
  }, []);

  // Load the menu once we have a session.
  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sea">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const patchProducts = (fn: (products: Product[]) => Product[]) =>
    setMenu((m) => (m ? { ...m, products: fn(m.products) } : m));

  const patchCategories = (fn: (categories: Category[]) => Category[]) =>
    setMenu((m) => (m ? { ...m, categories: fn(m.categories) } : m));

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (values: CategoryFormValues) => {
    setBusy(true);
    try {
      if (editingCategory) {
        const updated: Category = { ...editingCategory, ...values };
        await updateCategory(updated);
        patchCategories((cs) =>
          cs.map((c) => (c.id === updated.id ? updated : c)),
        );
        setToast("Kategori güncellendi");
      } else {
        const cats = menu?.categories ?? [];
        const existingSlugs = new Set(
          cats.map((c) => c.slug).filter(Boolean) as string[],
        );
        const order = cats.reduce((max, c) => Math.max(max, c.order ?? 0), 0) + 1;
        const data: Omit<Category, "id"> = {
          ...values,
          slug: uniqueSlug(values.name, existingSlugs),
          order,
        };
        const id = await addCategory(data);
        patchCategories((cs) => [...cs, { ...data, id }]);
        setToast("Kategori eklendi");
      }
      setCategoryFormOpen(false);
      setEditingCategory(null);
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const requestDeleteCategory = (category: Category) => {
    const count =
      menu?.products.filter((p) => p.categoryId === category.id).length ?? 0;
    if (count > 0) {
      setToast(
        `“${category.name}” içinde ${count} ürün var. Önce ürünleri silin veya taşıyın.`,
      );
      return;
    }
    setDeleteCategoryTarget(category);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setBusy(true);
    try {
      await deleteCategory(deleteCategoryTarget.id);
      patchCategories((cs) =>
        cs.filter((c) => c.id !== deleteCategoryTarget.id),
      );
      setToast("Kategori silindi");
      setDeleteCategoryTarget(null);
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setBusy(true);
    try {
      if (editing) {
        const updated: Product = { ...editing, ...values };
        await updateProduct(updated);
        patchProducts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
        setToast("Ürün güncellendi");
      } else {
        const id = await addProduct(values);
        const created: Product = { ...values, id, order: Date.now() };
        patchProducts((ps) => [...ps, created]);
        setToast("Ürün eklendi");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteProduct(deleteTarget.id);
      patchProducts((ps) => ps.filter((p) => p.id !== deleteTarget.id));
      setToast("Ürün silindi");
      setDeleteTarget(null);
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const handlePriceChange = async (id: string, price: number) => {
    const product = menu?.products.find((p) => p.id === id);
    if (!product) return;
    const updated = { ...product, price };
    try {
      await updateProduct(updated);
      patchProducts((ps) => ps.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setToast(errorMessage(e));
    }
  };

  const handleToggleActive = async (id: string) => {
    const product = menu?.products.find((p) => p.id === id);
    if (!product) return;
    const updated = { ...product, isActive: !product.isActive };
    try {
      await updateProduct(updated);
      patchProducts((ps) => ps.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setToast(errorMessage(e));
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedMenu();
      await load();
      setToast("Başlangıç menüsü yüklendi");
    } catch (e) {
      setToast(errorMessage(e));
    } finally {
      setSeeding(false);
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
    router.replace("/admin/login");
  };

  const categories = menu?.categories ?? [];
  const products = menu?.products ?? [];
  const total = products.length;
  const active = products.filter((p) => p.isActive).length;
  const featured = products.filter((p) => p.isFeatured).length;

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
            <p className="max-w-[180px] truncate text-xs text-ink-muted">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
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
            <p className="font-display text-2xl font-semibold tabular-nums text-ink">
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
          disabled={menu === null}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep disabled:opacity-60"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Category management */}
      {menu !== null && (
        <div className="mt-4">
          <CategoryManager
            categories={categories}
            products={products}
            onAdd={openAddCategory}
            onEdit={openEditCategory}
            onDelete={requestDeleteCategory}
          />
        </div>
      )}

      {/* Product list */}
      <div className="mt-6">
        {menu === null ? (
          <div className="flex justify-center py-16 text-sea">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          </div>
        ) : total === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-foam px-4 py-12 text-center">
            <p className="text-sm text-ink-soft">
              Firestore menüsü boş görünüyor.
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Başlangıç menüsünü (8 kategori, 27 ürün) tek tıkla yükleyin.
            </p>
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sea px-5 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep disabled:opacity-60"
            >
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <DatabaseZap className="h-4 w-4" aria-hidden="true" />
              )}
              Başlangıç menüsünü yükle
            </button>
          </div>
        ) : (
          <ProductTable
            categories={categories}
            products={products}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onPriceChange={handlePriceChange}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>

      {/* Overlays */}
      <ProductForm
        open={formOpen}
        editing={editing}
        categories={categories}
        busy={busy}
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
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CategoryForm
        open={categoryFormOpen}
        editing={editingCategory}
        busy={busy}
        onSubmit={handleCategorySubmit}
        onCancel={() => {
          setCategoryFormOpen(false);
          setEditingCategory(null);
        }}
      />

      <ConfirmModal
        open={Boolean(deleteCategoryTarget)}
        title="Kategoriyi sil"
        message={
          deleteCategoryTarget
            ? `“${deleteCategoryTarget.name}” kategorisi silinecek. Bu işlem geri alınamaz.`
            : ""
        }
        confirmLabel="Sil"
        busy={busy}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryTarget(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
