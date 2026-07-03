"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChefHat, ChevronDown, Flame, Leaf, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCalories, formatPrice } from "@/lib/format";
import { BLUR_DATA_URL } from "@/lib/constants";
import ImageLightbox from "./ImageLightbox";

// Branded fallback shown when a product has no image (or one fails to load) —
// a teal fish silhouette on sea-wash, echoing the logo. Never a broken image.
function FishFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-sea-wash">
      <svg
        viewBox="0 0 64 40"
        fill="none"
        aria-hidden="true"
        className="h-1/2 w-1/2 text-sea"
      >
        <path
          d="M6 20 C 14 8, 32 8, 42 20 C 32 32, 14 32, 6 20 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M42 20 L 58 11 L 54 20 L 58 29 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="16" cy="17" r="1.8" fill="#FBF8F3" />
      </svg>
    </div>
  );
}

export default function ProductCard({
  product,
  priority = false,
  freshLabel,
}: {
  product: Product;
  priority?: boolean;
  freshLabel?: string;
}) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const hasImage = Boolean(product.imageUrl) && !imgError;
  const toggle = () => setExpanded((v) => !v);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-foam shadow-warm">
      <div className="flex items-stretch">
        {/* Image — tap to enlarge (falls back to expanding the card) */}
        <button
          type="button"
          onClick={() => (hasImage ? setLightbox(true) : toggle())}
          aria-label={
            hasImage ? `${product.name} fotoğrafını büyüt` : product.name
          }
          className="group relative aspect-square w-[38%] shrink-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sea"
        >
          {hasImage ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 40vw, 180px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              loading={priority ? undefined : "lazy"}
              priority={priority}
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-active:scale-105"
            />
          ) : (
            <FishFallback />
          )}

          {product.isFeatured && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-coral px-2 py-1 text-[10px] font-semibold text-white shadow-warm">
              <ChefHat className="h-2.5 w-2.5" aria-hidden="true" />
              Şefin Önerisi
            </span>
          )}

          {hasImage && (
            <span className="absolute bottom-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink/45 text-white backdrop-blur-sm">
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </button>

        {/* Text — tap to expand details */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={`${product.name} ayrıntıları`}
          className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3.5 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sea"
        >
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 font-display text-[1.125rem] font-medium leading-snug text-ink">
              {product.name}
            </h3>
            {freshLabel && (
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-full bg-sea-wash px-1.5 py-0.5 text-[10px] font-semibold text-sea-deep">
                <Leaf className="h-2.5 w-2.5" aria-hidden="true" />
                {freshLabel}
              </span>
            )}
          </div>

          <p
            className={`text-sm text-ink-soft ${expanded ? "" : "line-clamp-2"}`}
          >
            {product.description}
          </p>

          <div className="mt-1 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="block font-sans text-base font-bold tabular-nums text-sea">
                {formatPrice(product.price)}
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                <Flame className="h-3 w-3 shrink-0 text-coral" aria-hidden="true" />
                <span className="tabular-nums">
                  {formatCalories(product.calories)}
                </span>
                {product.portion && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.portion}</span>
                  </>
                )}
              </span>
            </div>
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Inline expand: allergens + energy/portion */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={reduce ? undefined : { height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-3.5 py-3 text-sm">
              <p className="text-ink-soft">{product.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-sea-wash px-2.5 py-1 text-[12px] font-medium text-sea-deep">
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  {formatCalories(product.calories)}
                </span>
                {product.portion && (
                  <span className="inline-flex items-center rounded-full bg-sea-wash px-2.5 py-1 text-[12px] font-medium text-sea-deep">
                    Porsiyon: {product.portion}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">
                <span className="font-semibold text-ink-soft">Alerjenler: </span>
                {product.allergens
                  ? product.allergens
                  : "Bilinen alerjen içermez."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasImage && (
        <ImageLightbox
          open={lightbox}
          src={product.imageUrl}
          alt={product.name}
          caption={product.name}
          onClose={() => setLightbox(false)}
        />
      )}
    </article>
  );
}
