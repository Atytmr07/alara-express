"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

// Slide-in success toast, auto-dismisses after 3s.
export default function Toast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-ink px-4 py-3 text-sm font-medium text-white shadow-warm-lg"
          >
            <CheckCircle2 className="h-4 w-4 text-sea" aria-hidden="true" />
            <span>{message}</span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Kapat"
              className="ml-1 rounded-full p-0.5 text-white/70 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
