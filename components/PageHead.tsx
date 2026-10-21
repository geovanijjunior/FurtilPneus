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
    <div className="bg-ink text-paper">
      <div className="wrap py-10 lg:py-14">
        <p className="eyebrow text-signal">{eyebrow}</p>
        <h1 className="h-display mt-3 text-[clamp(2.6rem,8vw,4.6rem)]">{title}</h1>
        {children ? <div className="mt-4 max-w-2xl text-lg text-muted-dark">{children}</div> : null}
      </div>
    </div>
  );
}
