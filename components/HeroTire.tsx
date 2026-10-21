"use client";

import { useApp } from "@/components/Providers";

/**
 * Pneu do hero. Gira com a rolagem (CSS scroll-driven, sem JS) e escreve no
 * flanco a medida que o cliente acabou de encontrar — o resultado da busca
 * aparece "gravado" no pneu.
 */
export function HeroTire({ className = "" }: { className?: string }) {
  const { selection } = useApp();
  const size = selection?.size ?? "205/55 R16";
  const label = `${size} · FURTIL PNEUS · GARANTIA 5 ANOS · `;
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      <svg
        viewBox="0 0 400 400"
        className="spin-on-scroll h-full w-full drop-shadow-[0_40px_60px_rgba(17,17,17,0.25)]"
      >
        <defs>
          <path id="sidewall" d="M200 200 m-138 0 a138 138 0 1 1 276 0 a138 138 0 1 1 -276 0" />
          <radialGradient id="rubber" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgb(var(--ink-3))" />
            <stop offset="100%" stopColor="rgb(var(--ink))" />
          </radialGradient>
          <radialGradient id="rim" cx="45%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#F2F2EE" />
            <stop offset="100%" stopColor="#B9B9B2" />
          </radialGradient>
        </defs>
        {/* banda de rodagem: blocos com dasharray */}
        <circle cx="200" cy="200" r="190" fill="rgb(var(--ink))" />
        <circle
          cx="200"
          cy="200"
          r="183"
          fill="none"
          stroke="rgb(var(--ink-3))"
          strokeWidth="14"
          strokeDasharray="10 8"
        />
        <circle cx="200" cy="200" r="170" fill="url(#rubber)" />
        <text
          fill="rgb(var(--muted-dark))"
          fontFamily="var(--font-mono)"
          fontSize="15"
          fontWeight="600"
          letterSpacing="3"
        >
          <textPath href="#sidewall">{label + label}</textPath>
        </text>
        <circle cx="200" cy="200" r="118" fill="rgb(var(--ink))" />
        {/* roda */}
        <circle cx="200" cy="200" r="108" fill="url(#rim)" />
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d="M200 200 L188 104 Q200 96 212 104 Z"
            fill="rgb(var(--ink-3))"
            opacity="0.85"
            transform={`rotate(${i * 72} 200 200)`}
          />
        ))}
        <circle cx="200" cy="200" r="98" fill="none" stroke="#9D9D96" strokeWidth="2" />
        <circle cx="200" cy="200" r="30" fill="rgb(var(--ink))" />
        <circle cx="200" cy="200" r="22" fill="rgb(var(--signal))" />
        <text
          x="200"
          y="208"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="900"
          fontStyle="italic"
          fontSize="22"
          fill="rgb(var(--ink))"
        >
          F
        </text>
      </svg>
    </div>
  );
}
