"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

// Centred confirmation dialog for destructive actions (delete).
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Sil",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-line bg-foam p-6 shadow-warm-lg"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-semibold text-ink">
                {title}
              </h2>
            </div>

            <p className="mt-3 text-sm text-ink-soft">{message}</p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-line bg-foam px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-coral px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
