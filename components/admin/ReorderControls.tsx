"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

// Compact up/down reorder control (a stacked pair of chevrons).
export default function ReorderControls({
  canUp,
  canDown,
  onUp,
  onDown,
  label,
}: {
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  label: string;
}) {
  const btn =
    "flex h-6 w-7 items-center justify-center text-ink-muted transition-colors enabled:hover:text-sea disabled:opacity-30";
  return (
    <div className="flex shrink-0 flex-col overflow-hidden rounded-lg border border-line bg-foam">
      <button
        type="button"
        onClick={onUp}
        disabled={!canUp}
        aria-label={`${label} yukarı taşı`}
        className={`${btn} border-b border-line`}
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={!canDown}
        aria-label={`${label} aşağı taşı`}
        className={btn}
      >
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
