// Whisper-quiet warm paper grain over the whole surface — barely perceptible.
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.03] mix-blend-multiply"
    >
      <svg className="h-full w-full">
        <filter id="alara-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves={2}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#alara-grain)" />
      </svg>
    </div>
  );
}
