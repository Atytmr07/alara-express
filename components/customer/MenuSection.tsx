import Image from "next/image";
import type { Category, Product } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/constants";
import WaveDivider from "./WaveDivider";
import ProductGrid from "./ProductGrid";

// Categories where a small "Taze" freshness pill makes sense.
const FRESH_CATEGORIES = new Set([
  "izgara-baliklar",
  "deniz-urunleri",
  "cig-taze",
]);

// One vertical <section> per category: wave separator, a cinematic image banner
// with the category name, then the staggered product list. Scroll-margin clears
// the sticky tab bar when tabs jump to a section.
export default function MenuSection({
  category,
  products,
  priorityFirst = false,
  sectionRef,
}: {
  category: Category;
  products: Product[];
  priorityFirst?: boolean;
  sectionRef?: (el: HTMLElement | null) => void;
}) {
  const freshLabel = FRESH_CATEGORIES.has(category.id) ? "Taze" : undefined;

  return (
    <section
      id={category.slug}
      data-cat={category.id}
      ref={sectionRef}
      aria-label={category.name}
      className="scroll-mt-[68px] px-4 pt-8"
    >
      <div className="flex justify-center">
        <WaveDivider />
      </div>

      <div className="relative mt-3 h-28 overflow-hidden rounded-2xl border border-line bg-sea-wash">
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            priority={priorityFirst}
            loading={priorityFirst ? undefined : "lazy"}
            className="object-cover"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white drop-shadow">
            {category.name}
          </h2>
          {category.subtitle && (
            <p className="mt-0.5 text-xs text-white/85">{category.subtitle}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <ProductGrid
          products={products}
          freshLabel={freshLabel}
          priorityFirst={priorityFirst}
        />
      </div>
    </section>
  );
}
