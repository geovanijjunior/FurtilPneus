"use client";

import Link from "next/link";
import { useState } from "react";
import { terms } from "@/config/site";
import { installment, money } from "@/lib/format";

// Tabela "a partir de" publicada hoje no site atual (preço à vista, na troca do usado).
// TODO: confirmar com o cliente se os valores continuam valendo.
const fromPrices = [
  { rim: "13", price: 189.9 },
  { rim: "14", price: 199.9 },
  { rim: "15", price: 239.9 },
  { rim: "16", price: 269.9 },
];

export function RimPrices() {
  const [rim, setRim] = useState("14");
  const current = fromPrices.find((p) => p.rim === rim)!;
  return (
    <div className="card grid overflow-hidden md:grid-cols-[1fr_1.1fr]">
      <div className="p-6 sm:p-8">
        <p className="font-semibold" id="aro-label">
          Qual o aro da sua roda?
        </p>
        <div role="radiogroup" aria-labelledby="aro-label" className="mt-4 grid grid-cols-4 gap-2">
          {fromPrices.map((p) => (
            <button
              key={p.rim}
              role="radio"
              aria-checked={rim === p.rim}
              onClick={() => setRim(p.rim)}
              className={`grid aspect-square place-items-center rounded-2xl border-2 font-display text-3xl font-extrabold transition-all duration-200 ${
                rim === p.rim
                  ? "scale-[1.04] border-ink bg-signal"
                  : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <span>
                <span className="sr-only">Aro </span>
                {p.rim}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Não sabe o aro? É o último número da medida: em 185/65 R<strong>15</strong>, aro 15.
        </p>
      </div>
      <div className="flex flex-col justify-center bg-ink p-6 text-white sm:p-8" aria-live="polite">
        <p className="text-sm text-muted-dark">Pneu novo aro {rim}, a partir de</p>
        <p
          key={rim}
          className="num animate-rise font-display text-[clamp(2.8rem,9vw,4.2rem)] font-extrabold leading-none tracking-tight text-signal"
        >
          {money(current.price)}
        </p>
        <p className="num mt-2 text-muted-dark">
          à vista · ou {terms.installmentsMax}x de{" "}
          {installment(current.price, terms.installmentsMax)} sem juros
        </p>
        <p className="mt-4 rounded-xl bg-ink-3 px-3 py-2 text-sm">
          Na troca do seu pneu usado. Marca e medida conforme o estoque da loja.
        </p>
        <Link href="/pneus" className="btn-signal mt-6 self-start">
          Ver pneus aro {rim}
        </Link>
      </div>
    </div>
  );
}
