"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { business } from "@/config/business";
import { ADMIN_FLAG_KEY, ADMIN_PASSWORD } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already "logged in" for the demo → go straight to the dashboard.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem(ADMIN_FLAG_KEY) === "1"
    ) {
      router.replace("/admin");
    }
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Small delay purely for the demo spinner feel.
    window.setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        window.localStorage.setItem(ADMIN_FLAG_KEY, "1");
        router.replace("/admin");
      } else {
        setError("Şifre hatalı. Lütfen tekrar deneyin.");
        setBusy(false);
      }
    }, 400);
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

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="admin-password" className="sr-only">
            Şifre
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-foam px-3 focus-within:border-sea">
            <Lock className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              autoComplete="current-password"
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
            disabled={busy}
            className="mt-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Giriş
          </button>
        </form>

        <p className="mt-5 rounded-xl bg-sea-wash px-3 py-2 text-center text-xs text-sea-deep">
          Demo şifresi: <span className="font-semibold">{ADMIN_PASSWORD}</span>
        </p>
      </div>
    </main>
  );
}
