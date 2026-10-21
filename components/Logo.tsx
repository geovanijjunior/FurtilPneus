// Marca provisória em tipografia. TODO: substituir pelo logo oficial em SVG
// (o site atual só tem PNG/JPG — pedir o vetor ao cliente).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-stretch leading-none ${className}`}>
      <span className="h-display bg-signal px-1.5 pb-0.5 pt-1 text-[1.45rem] text-ink">Furtil</span>
      <span className="h-display px-1.5 pb-0.5 pt-1 text-[1.45rem] text-current">Pneus</span>
    </span>
  );
}
