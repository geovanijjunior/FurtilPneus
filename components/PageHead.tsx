export function PageHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-signal/20 blur-3xl"
      />
      <div className="wrap relative py-12 lg:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-3 text-[clamp(2.2rem,6vw,3.8rem)]">{title}</h1>
        {children ? <div className="mt-4 max-w-2xl text-lg text-muted">{children}</div> : null}
      </div>
    </div>
  );
}
