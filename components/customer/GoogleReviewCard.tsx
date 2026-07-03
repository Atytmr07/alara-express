import { Star } from "lucide-react";
import { business } from "@/config/business";

// The Google "G" mark (brand colours).
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

// Five stars filled precisely to the rating (e.g. 4.8 → 96% width).
function StarRating({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = "flex gap-0.5";
  const star = "h-4 w-4";
  return (
    <div
      className="relative inline-flex"
      role="img"
      aria-label={`5 üzerinden ${rating}`}
    >
      <div className={`${row} text-line`} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${star} fill-current`} />
        ))}
      </div>
      <div
        className={`absolute inset-y-0 left-0 overflow-hidden ${row} text-coral`}
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${star} shrink-0 fill-current`} />
        ))}
      </div>
    </div>
  );
}

// Bottom-of-page social proof + call to action: rate us on Google.
export default function GoogleReviewCard() {
  return (
    <section
      aria-label="Google değerlendirmesi"
      className="mx-4 mt-12 overflow-hidden rounded-2xl border border-line bg-foam shadow-warm"
    >
      <div className="flex items-center justify-center gap-2 border-b border-line bg-shell py-3">
        <GoogleG className="h-5 w-5" />
        <span className="text-sm font-semibold tracking-tight text-ink-soft">
          Google Yorumları
        </span>
      </div>

      <div className="px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-display text-5xl font-semibold leading-none tabular-nums text-ink">
            {business.googleRating}
          </span>
          <div className="flex flex-col items-start">
            <StarRating rating={business.googleRating} />
            <span className="mt-1 text-xs text-ink-muted">
              {business.ratingCount.toLocaleString("tr-TR")} değerlendirme
            </span>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-[300px] text-sm leading-relaxed text-ink-soft">
          Ziyaretinizden memnun kaldıysanız, deneyiminizi Google&apos;da
          paylaşarak bize destek olabilirsiniz.
        </p>

        <a
          href={business.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google'da değerlendirin"
          className="mt-5 inline-flex min-h-[52px] w-full max-w-[300px] items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-5 text-sm font-semibold text-ink shadow-warm transition-all hover:border-sea/50 hover:shadow-warm-lg active:scale-[0.99]"
        >
          <GoogleG className="h-5 w-5" />
          Google&apos;da Değerlendirin
        </a>
      </div>
    </section>
  );
}
