// Write path (admin only): product CRUD, seed, and image upload.
// Kept apart from the read path so `firebase/storage` never ships to the
// customer bundle.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  type UpdateData,
  updateDoc,
} from "firebase/firestore/lite";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getDb, getFirebaseApp } from "./firebase";
import { CATEGORIES_COL, mockMenu, PRODUCTS_COL } from "./menuRepo";
import type { Product } from "./types";

function requireDb() {
  const db = getDb();
  if (!db) throw new Error("Firebase yapılandırılmadı (.env.local eksik).");
  return db;
}

function stripId<T extends { id?: string }>(obj: T): Omit<T, "id"> {
  const { id, ...rest } = obj;
  return rest;
}

/** Firestore rejects `undefined` — drop those keys before writing. */
function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Create a product; returns the new Firestore id. */
export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const db = requireDb();
  const created = await addDoc(
    collection(db, PRODUCTS_COL),
    clean({ ...data, order: data.order ?? Date.now() }),
  );
  return created.id;
}

export async function updateProduct(product: Product): Promise<void> {
  const db = requireDb();
  await updateDoc(
    doc(db, PRODUCTS_COL, product.id),
    clean(stripId(product)) as UpdateData<Record<string, unknown>>,
  );
}

export async function deleteProduct(id: string): Promise<void> {
  const db = requireDb();
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

/** One-time (idempotent) seed of categories + products from the mock menu. */
export async function seedMenu(): Promise<void> {
  const db = requireDb();
  const menu = mockMenu();
  await Promise.all([
    ...menu.categories.map((c) =>
      setDoc(doc(db, CATEGORIES_COL, c.id), clean(stripId(c))),
    ),
    ...menu.products.map((p) =>
      setDoc(doc(db, PRODUCTS_COL, p.id), clean(stripId(p))),
    ),
  ]);
}

/** Upload a product photo to Storage and return its public download URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase Storage yapılandırılmadı.");
  const storage = getStorage(app);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `products/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
  });
  return getDownloadURL(storageRef);
}
