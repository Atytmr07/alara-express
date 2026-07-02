"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertTriangle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { business } from "@/config/business";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import { useAuth } from "@/lib/useAuth";

function mapAuthError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Geçersiz e-posta adresi.";
    case "auth/user-disabled":
      return "Bu hesap devre dışı bırakılmış.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-posta veya şifre hatalı.";
    case "auth/too-many-requests":
      return "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.";
    default:
      return "Giriş yapılamadı. Lütfen tekrar deneyin.";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, ready, configured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in → straight to the dashboard.
  useEffect(() => {
    if (ready && user) router.replace("/admin");
  }, [ready, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase henüz yapılandırılmadı.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      const code =
        typeof err === "object" && err && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setError(mapAuthError(code));
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-shell px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-foam p-7 shadow-warm">
        <div className="flex flex-col items-center text-center">
          <Image
            src={business.logo}
            alt={`${business.name} logosu`}
            width={120}
            height={84}
            priority
            className="h-auto w-[104px]"
          />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Yönetim Girişi
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Menüyü düzenlemek için giriş yapın
          </p>
        </div>

        {!configured && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-coral/30 bg-coral/10 px-3 py-2.5 text-xs text-ink-soft">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-coral"
              aria-hidden="true"
            />
            <span>
              Firebase yapılandırması bulunamadı. Yönetici girişi için{" "}
              <code className="font-semibold">.env.local</code> dosyasına Firebase
              bilgilerini ekleyin.
            </span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="admin-email" className="sr-only">
            E-posta
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-foam px-3 focus-within:border-sea">
            <Mail className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className="min-h-[48px] w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
          </div>

          <label htmlFor="admin-password" className="sr-only">
            Şifre
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-foam px-3 focus-within:border-sea">
            <Lock className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="min-h-[48px] w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
              className="shrink-0 rounded-full p-1 text-ink-muted transition-colors hover:text-ink"
            >
              {show ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={busy || !configured}
            className="mt-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Giriş
          </button>
        </form>
      </div>
    </main>
  );
}
