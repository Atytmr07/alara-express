"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { business } from "@/config/business";

// Sea-teal hero: the white logo reads crisp on teal, then a wave-cut melts the
// header into the sand page below — coastal, premium, and no top ribbon.
export default function BrandHeader() {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden bg-gradient-to-b from-sea-deep to-sea px-6 pb-14 pt-10 text-center"
    >
      {/* SEO / a11y heading — the visual wordmark lives inside the logo. */}
      <h1 className="sr-only">
        {business.name} — {business.tagline}
      </h1>

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src={business.logo}
          alt={`${business.name} logosu`}
          width={190}
          height={133}
          priority
          className="h-auto w-[172px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)] sm:w-[188px]"
        />

        <p className="mt-4 font-sans text-[15px] italic text-white/90">
          {business.tagline}
        </p>
      </div>

      {/* Wave-cut into the sand background */}
      <svg
        viewBox="0 0 500 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-8 w-full fill-sand"
      >
        <path d="M0,22 C110,44 200,4 300,16 C370,25 440,30 500,18 L500,40 L0,40 Z" />
      </svg>
    </motion.header>
  );
}
