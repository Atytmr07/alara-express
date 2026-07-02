"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// Staggered product list — items rise & fade in as the section scrolls into view.
export default function ProductGrid({
  products,
  freshLabel,
  priorityFirst = false,
}: {
  products: Product[];
  freshLabel?: string;
  priorityFirst?: boolean;
}) {
  const reduce = useReducedMotion();

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  const itemVariants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        },
      };

  return (
    <motion.ul
      role="list"
      className="flex flex-col gap-3"
      variants={listVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
    >
      {products.map((product, i) => (
        <motion.li key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            priority={priorityFirst && i === 0}
            freshLabel={freshLabel}
          />
        </motion.li>
      ))}
    </motion.ul>
  );
}
