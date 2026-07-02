// Auth getter kept separate so `firebase/auth` only lands in the admin bundle.
import { type Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}
