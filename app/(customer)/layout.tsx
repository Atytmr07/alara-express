// Customer surface shell: no navbar, warm sand theme, and — on desktop — the
// menu is centred in a ~480px column so it always reads like a phone held up.
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-sand">
      <div className="relative mx-auto min-h-screen w-full max-w-phone bg-sand shadow-[0_0_60px_rgba(45,42,49,0.06)]">
        {children}
      </div>
    </div>
  );
}
