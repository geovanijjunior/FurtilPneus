"use client";

import { useState } from "react";
import { money } from "@/lib/format";

/**
 * Laudo interativo de exemplo: o visitante aprova item por item e vê o total
 * mudar — é a demonstração prática do "nada é trocado sem sua autorização".
 */
const rows = [
  {
    id: "pneu",
    item: "Pneu dianteiro esquerdo",
    found: "Sulco 1,4 mm",
    limit: "mín. 1,6 mm",
    state: "trocar",
    price: 199.9,
    proof: "Foto do indicador TWI rente à banda de rodagem, enviada no WhatsApp às 9h12.",
  },
  {
    id: "amortecedor",
    item: "Amortecedor traseiro (par)",
    found: "Vazamento",
    limit: "sem vazamento",
    state: "trocar",
    price: 199.9,
    proof: "Vídeo de 12 s mostrando óleo escorrendo no corpo do amortecedor direito.",
  },
  {
    id: "alinhamento",
    item: "Alinhamento",
    found: "Conv. +0,4°",
    limit: "±0,2°",
    state: "atencao",
    price: 89.9,
    proof: "Folha impressa do equipamento com o antes e o depois.",
  },
  {
    id: "pastilha",
    item: "Pastilha dianteira",
    found: "6,0 mm",
    limit: "mín. 2,0 mm",
    state: "ok",
    price: 0,
    proof: null,
  },
] as const;

const stateLabel = { ok: "OK", atencao: "Atenção", trocar: "Trocar" } as const;
const stateClass = {
  ok: "bg-paper-2 text-ok",
  atencao: "bg-signal-soft text-signal-deep",
  trocar: "bg-ink text-white",
} as const;

export function Laudo() {
  const [approved, setApproved] = useState<Set<string>>(new Set(["pneu"]));
  const [open, setOpen] = useState<string | null>(null);
  const actionable = rows.filter((r) => r.state !== "ok");
  const total = actionable.filter((r) => approved.has(r.id)).reduce((a, r) => a + r.price, 0);

  function toggle(id: string) {
    setApproved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <figure className="card overflow-hidden shadow-[0_40px_80px_-40px_rgb(var(--ink)/0.35)]">
      <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-5 py-4">
        <div>
          <p className="label text-muted">Laudo · exemplo</p>
          <p className="mt-0.5 font-semibold">HB20 Comfort 1.0 · 2021</p>
        </div>
        <p className="num rounded-full bg-white px-3 py-1 font-mono text-xs text-muted">
          OS 004812
        </p>
      </div>
      <ul className="divide-y divide-line">
        {rows.map((r) => {
          const isOn = approved.has(r.id);
          return (
            <li key={r.id} className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                {r.state === "ok" ? (
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper-2 text-ok"
                    aria-hidden
                  >
                    ✓
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    id={`laudo-${r.id}`}
                    checked={isOn}
                    onChange={() => toggle(r.id)}
                    className="h-6 w-6 shrink-0 cursor-pointer accent-[rgb(var(--ink))]"
                  />
                )}
                <label
                  htmlFor={r.state === "ok" ? undefined : `laudo-${r.id}`}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <span className="block font-medium leading-tight">{r.item}</span>
                  <span className="num block font-mono text-xs text-muted">
                    {r.found} · {r.limit}
                  </span>
                </label>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stateClass[r.state]}`}
                >
                  {stateLabel[r.state]}
                </span>
              </div>
              {r.proof ? (
                <div className="mt-2 pl-9">
                  <button
                    type="button"
                    aria-expanded={open === r.id}
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                    className="min-h-[32px] text-xs font-semibold text-signal-deep underline underline-offset-4"
                  >
                    {open === r.id ? "Esconder prova" : "Ver prova"}
                  </button>
                  {open === r.id ? (
                    <p className="mt-1 animate-rise text-sm text-muted">{r.proof}</p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 bg-ink px-5 py-4 text-white">
        <span className="text-sm text-muted-dark" aria-live="polite">
          Você aprovou {actionable.filter((r) => approved.has(r.id)).length} de {actionable.length}{" "}
          itens
        </span>
        <span className="num font-display text-2xl font-extrabold">{money(total)}</span>
      </figcaption>
    </figure>
  );
}
