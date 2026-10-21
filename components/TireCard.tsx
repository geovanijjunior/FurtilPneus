import Link from "next/link";
import { stores } from "@/config/lojas";
import { installment, money } from "@/lib/format";
import { sizeToSlug } from "@/lib/data";
import type { Product } from "@/lib/types";

/**
 * Card de pneu. Hierarquia de preço (regra do brief, seção 8):
 * 1. preço à vista — maior elemento tipográfico do card;
 * 2. parcelamento — tamanho secundário;
 * 3. condição de troca — junto ao preço, no mesmo bloco, nunca em rodapé.
 */
export function TireCard({ product: p, compact = false }: { product: Product; compact?: boolean }) {
  const lojas = stores.filter((s) => p.lojas.includes(s.slug)).map((s) => s.label);
  return (
    <article
      className={`card lift group flex h-full flex-col p-5 ${compact ? "sm:grid sm:grid-cols-[1fr_auto] sm:gap-6" : ""}`}
    >
      <div className="flex gap-4">
        <TireIcon />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{p.marca}</p>
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{p.linha}</h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm">
            <Link
              href={`/pneus/${sizeToSlug(p.medida)}`}
              className="num rounded-full bg-paper-2 px-2.5 py-0.5 font-mono font-medium hover:bg-signal"
            >
              {p.medida}
            </Link>
            <span className="num font-mono text-muted">{p.indiceCargaVelocidade}</span>
          </p>
        </div>
      </div>

      {!compact ? (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <Check /> Garantia {p.garantiaAnos} anos
          </li>
          <li className="flex items-center gap-1.5">
            <Check /> {lojas.join(" · ")}
          </li>
        </ul>
      ) : null}

      <div className={compact ? "mt-4 sm:mt-0 sm:w-56" : "mt-auto pt-5"}>
        <p className="text-xs text-muted">à vista, por pneu</p>
        <p className="num font-display text-[2rem] font-extrabold leading-none tracking-tight">
          {money(p.precoVista)}
        </p>
        <p className="num mt-1 text-sm text-muted">
          ou {p.parcelas}x de {installment(p.precoVista, p.parcelas)} sem juros
        </p>
        {p.precoSemTroca ? (
          <p className="mt-3 rounded-xl bg-signal-soft px-3 py-2 text-xs leading-snug text-ink">
            Valor na troca do seu pneu usado. Sem troca:{" "}
            <span className="num font-semibold">{money(p.precoSemTroca)}</span>
          </p>
        ) : (
          <p className="mt-3 rounded-xl bg-paper px-3 py-2 text-xs text-muted">
            Sem exigência de troca.
          </p>
        )}
        <Link
          href={`/agendar?produto=${p.id}`}
          className="btn-ink mt-4 w-full"
          aria-label={`Agendar instalação do ${p.marca} ${p.linha} ${p.medida}`}
        >
          Agendar instalação
        </Link>
      </div>
    </article>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 text-ok"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="m3 8.5 3 3 7-7" />
    </svg>
  );
}

/** Pneu desenhado em CSS — gira um pouco no hover do card. */
function TireIcon() {
  return (
    <span
      aria-hidden
      className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink transition-transform duration-500 ease-out group-hover:rotate-45"
      style={{
        backgroundImage:
          "repeating-conic-gradient(rgb(var(--ink)) 0 6deg, rgb(var(--ink-3)) 6deg 12deg)",
      }}
    >
      <span className="h-7 w-7 rounded-full border-[3px] border-paper-2 bg-line" />
    </span>
  );
}
