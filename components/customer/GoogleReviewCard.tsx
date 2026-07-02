import { Star } from "lucide-react";
import { business } from "@/config/business";

// Bottom-of-page social proof + call to action: rate us on Google.
export default function GoogleReviewCard() {
  return (
    <section
      aria-label="Google değerlendirmesi"
      className="mx-4 mt-10 rounded-2xl border border-line bg-sea-wash p-5 text-center"
    >
      <div
        className="flex items-center justify-center gap-1"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-5 w-5 fill-coral text-coral" />
        ))}
      </div>

      <p className="mt-2 font-display text-2xl font-semibold text-ink">
        <span className="tabular-nums">{business.googleRating}</span>
        <span className="text-base font-normal text-ink-muted"> / 5</span>
      </p>
      <p className="text-sm text-ink-soft">
        {business.ratingCount} misafirimizin değerlendirmesi
      </p>

      <p className="mx-auto mt-3 max-w-[280px] text-sm text-ink-soft">
        Ziyaretinizden memnun kaldıysanız, bizi Google&apos;da değerlendirerek
        destek olabilirsiniz.
      </p>

      <a
        href={business.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google'da değerlendir"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-sea px-5 text-sm font-semibold text-white shadow-warm transition-colors hover:bg-sea-deep"
      >
        <Star className="h-4 w-4 fill-white" aria-hidden="true" />
        Google&apos;da Değerlendir
      </a>
    </section>
  );
}
