import type { ReactNode } from "react";

/**
 * Moldura da placa Mercosul em CSS: faixa azul com "BRASIL", borda preta e
 * campo branco. O conteúdo (input ou texto) entra como children.
 * Proporção real 400×130 mm; aqui a largura é fluida e a altura segue o texto.
 */
export function MercosulPlate({
  children,
  size = "lg",
  className = "",
  transitionName,
}: {
  children: ReactNode;
  size?: "lg" | "sm";
  className?: string;
  transitionName?: string;
}) {
  const lg = size === "lg";
  return (
    <div
      className={`relative overflow-hidden bg-white text-ink ${
        lg
          ? "rounded-plate border-[3px] shadow-[0_2px_0_rgb(var(--ink)),0_18px_40px_-18px_rgb(var(--ink)/0.6)]"
          : "rounded-[5px] border-2"
      } border-ink ${className}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
    >
      <div
        aria-hidden
        className={`flex items-center justify-between bg-mercosul text-white ${
          lg ? "h-7 px-3 sm:h-8" : "h-[9px] px-1"
        }`}
      >
        {lg ? (
          <>
            <span className="font-mono text-[0.6rem] tracking-[0.2em] opacity-90">MERCOSUL</span>
            <span
              className="font-display text-sm font-bold tracking-[0.3em] sm:text-base"
              style={{ fontStretch: "100%" }}
            >
              BRASIL
            </span>
            <BrFlag />
          </>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function BrFlag() {
  return (
    <svg viewBox="0 0 28 20" className="h-3.5 w-5" aria-hidden>
      <rect width="28" height="20" fill="#009C3B" />
      <path d="M14 2 26 10 14 18 2 10z" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.6" fill="#002776" />
    </svg>
  );
}

/** Tipografia da placa: condensada, pesada, espaçada — evoca a FE-Schrift. */
export const plateTextClass =
  "font-display font-extrabold uppercase tracking-[0.12em] [font-stretch:62%] [font-variation-settings:'wdth'_62]";
