"use client";

import { useEffect, useId, useRef } from "react";

const PARTS = [
  { code: "205", title: "Largura", body: "Em milímetros, de um flanco ao outro." },
  { code: "55", title: "Perfil", body: "Altura do flanco, em % da largura." },
  { code: "R", title: "Construção", body: "Radial — praticamente todo pneu de passeio." },
  {
    code: "16",
    title: "Aro",
    body: "Diâmetro da roda em polegadas. É o número que separa as duas medidas de fábrica.",
  },
  {
    code: "91V",
    title: "Carga e velocidade",
    body: "91 = até 615 kg por pneu · V = até 240 km/h. Nunca use índice menor que o de fábrica.",
  },
];

/**
 * Overlay educativo: como ler a medida no flanco do pneu.
 * Usa <dialog> nativo — foco preso, Esc fecha e o foco volta ao botão que abriu.
 */
export function SidewallGuide({
  open,
  onClose,
  sizes,
}: {
  open: boolean;
  onClose: () => void;
  sizes?: string[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl bg-paper p-0 text-ink backdrop:bg-ink/80"
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="h-display text-3xl">
            Como ler o flanco do pneu
          </h2>
          <button
            onClick={onClose}
            className="btn-ink -mr-2 -mt-1 min-w-tap px-0"
            aria-label="Fechar"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden
            >
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-muted">
          A medida está gravada em relevo na lateral do pneu, em letras maiores que o resto.
        </p>

        <Sidewall />

        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {PARTS.map((p) => (
            <li key={p.code} className="flex gap-3 rounded-xl bg-paper-2 p-3">
              <span className="num w-12 shrink-0 font-mono text-lg font-semibold">{p.code}</span>
              <span>
                <span className="block font-semibold">{p.title}</span>
                <span className="block text-sm text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ol>

        {sizes?.length ? (
          <p className="mt-4 rounded-xl bg-ink p-4 text-white">
            No seu carro, procure por{" "}
            {sizes.map((s, i) => (
              <span key={s}>
                {i > 0 ? " ou " : ""}
                <strong className="num font-mono text-signal">{s}</strong>
              </span>
            ))}
            . Ou confira a etiqueta na coluna da porta do motorista.
          </p>
        ) : null}

        <button onClick={onClose} className="btn-ink mt-5 w-full sm:w-auto">
          Entendi, voltar
        </button>
      </div>
    </dialog>
  );
}

function Sidewall() {
  return (
    <svg
      viewBox="0 0 600 230"
      className="mt-4 w-full"
      role="img"
      aria-label="Flanco de pneu com a medida 205/55 R16 91V destacada"
    >
      <defs>
        <path id="arc" d="M90 230 A 210 210 0 0 1 510 230" />
        <pattern
          id="tread"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(20)"
        >
          <rect width="16" height="16" fill="rgb(var(--ink))" />
          <rect width="6" height="16" fill="rgb(var(--ink-3))" />
        </pattern>
      </defs>
      <path
        d="M0 230 A 300 300 0 0 1 600 230 L560 230 A 260 260 0 0 0 40 230Z"
        fill="url(#tread)"
      />
      <path
        d="M40 230 A 260 260 0 0 1 560 230 L470 230 A 170 170 0 0 0 130 230Z"
        fill="rgb(var(--ink-2))"
      />
      <text fontFamily="var(--font-mono)" fontSize="34" fontWeight="600" letterSpacing="2">
        <textPath href="#arc" startOffset="50%" textAnchor="middle" dy="-1">
          <tspan fill="rgb(var(--signal))">205</tspan>
          <tspan fill="rgb(var(--muted-dark))">/</tspan>
          <tspan fill="rgb(var(--white))">55</tspan>
          <tspan fill="rgb(var(--muted-dark))"> </tspan>
          <tspan fill="rgb(var(--white))">R</tspan>
          <tspan fill="rgb(var(--signal))">16</tspan>
          <tspan fill="rgb(var(--muted-dark))"> </tspan>
          <tspan fill="rgb(var(--white))">91V</tspan>
        </textPath>
      </text>
      <path d="M130 230 A 170 170 0 0 1 470 230Z" fill="rgb(var(--line))" />
      <circle cx="300" cy="230" r="40" fill="rgb(var(--muted))" />
    </svg>
  );
}
