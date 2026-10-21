// Marca provisória em tipografia. TODO: substituir pelo logo oficial em SVG
// (o site atual só tem PNG/JPG — pedir o vetor ao cliente).
export function Logo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display text-[1.35rem] font-black uppercase italic leading-none tracking-[-0.03em] ${className}`}
    >
      <span className="rounded-md bg-signal px-1.5 py-1 text-ink">Furtil</span>
      <span className={invert ? "text-white" : "text-ink"}>Pneus</span>
    </span>
  );
}
