"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { uploadProductImage } from "@/lib/menuAdmin";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Uploads the chosen photo to Firebase Storage and stores its download URL.
// Falls back to an inline base64 dataURL when Firebase isn't configured (demo).
export default function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (file.size > MAX_BYTES) {
      setError("Görsel çok büyük (maks. 5MB). Daha küçük bir fotoğraf seçin.");
      return;
    }

    setLoading(true);
    try {
      const url = isFirebaseConfigured
        ? await uploadProductImage(file)
        : await readAsDataURL(file);
      onChange(url);
    } catch {
      setError("Görsel yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      // Allow re-selecting the same file later.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-sea-wash">
          {loading ? (
            <span className="flex h-full w-full items-center justify-center text-sea">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </span>
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Ürün önizleme"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sea/70">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </span>
          )}

          {value && !loading && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Görseli kaldır"
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white transition-colors hover:bg-ink"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-line bg-foam px-3 text-sm font-semibold text-ink transition-colors hover:bg-sand disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-sea" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-4 w-4 text-sea" aria-hidden="true" />
            )}
            Fotoğraf Seç / Çek
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-foam px-3">
            <Link2 className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <input
              type="url"
              inputMode="url"
              placeholder="veya görsel URL'si yapıştır"
              value={value.startsWith("data:") ? "" : value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[44px] w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              aria-label="Görsel URL'si"
            />
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {error && <p className="mt-2 text-xs text-coral">{error}</p>}
    </div>
  );
}
