"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

// Fullscreen image viewer. Opens when a product photo is tapped; closes on
// backdrop tap, the ✕ button, or Escape. Locks body scroll while open.
export default function ImageLightbox({
  open,
  src,
  alt,
  caption,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink/90 p-5 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { scale: 0.92, opacity: 0 }}
            animate={reduce ? undefined : { scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-warm-lg"
          />

          {caption && (
            <p className="mt-4 max-w-[92vw] truncate text-center text-sm font-medium text-white/90">
              {caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
