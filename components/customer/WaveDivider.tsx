"use client";

import { motion, useReducedMotion } from "framer-motion";

// The brand signature: a single hand-drawn teal wave that draws itself in
// (pathLength 0→1) whenever it scrolls into view. Echoes the logo's fish-wave.
export default function WaveDivider({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      aria-hidden="true"
      className={`h-3 w-24 text-sea ${className}`}
    >
      <motion.path
        d="M2 7 Q 11 1 20 7 T 38 7 T 56 7 T 74 7 T 92 7 T 110 7 T 118 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
}
