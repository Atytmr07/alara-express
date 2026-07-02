"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { isFirebaseConfigured } from "./firebase";
import { getFirebaseAuth } from "./firebaseAuth";

// Tracks the Firebase Auth session for the admin surface.
// `ready` flips true once the initial auth state is known.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
    return unsubscribe;
  }, []);

  return { user, ready, configured: isFirebaseConfigured };
}
