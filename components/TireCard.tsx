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
      className={`grid gap-4 rounded-lg border p-4 ${
        compact
          ? "border-line-dark bg-ink-2 text-paper sm:grid-cols-[1fr_auto]"
          : "border-line bg-white text-ink"
      }`}
    >
      <div>
        <p className={`eyebrow ${compact ? "text-muted-dark" : "text-muted"}`}>{p.marca}</p>
        <h3 className="mt-0.5 text-lg font-semibold leading-tight">{p.linha}</h3>
        <p className="num mt-1 font-mono text-sm">
          <Link
            href={`/pneus/${sizeToSlug(p.medida)}`}
            className="underline decoration-1 underline-offset-2"
          >
            {p.medida}
          </Link>{" "}
          <span className={compact ? "text-muted-dark" : "text-muted"}>
            {p.indiceCargaVelocidade}
          </span>
        </p>
        {!compact ? (
          <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <li className="rounded-sm bg-paper-2 px-2 py-1">Garantia {p.garantiaAnos} anos</li>
            <li className="rounded-sm bg-paper-2 px-2 py-1">Em estoque: {lojas.join(", ")}</li>
          </ul>
        ) : null}
      </div>

      <div className={compact ? "sm:text-right" : "border-t border-line pt-3"}>
        <p className={`text-xs ${compact ? "text-muted-dark" : "text-muted"}`}>à vista, por pneu</p>
        <p className="num font-display text-[2.1rem] font-extrabold leading-none tracking-tight">
          {money(p.precoVista)}
        </p>
        <p className={`num mt-1 text-sm ${compact ? "text-muted-dark" : "text-muted"}`}>
          ou {p.parcelas}x de {installment(p.precoVista, p.parcelas)} sem juros
        </p>
        {p.precoSemTroca ? (
          <p
            className={`mt-2 rounded-sm px-2 py-1 text-xs font-medium ${
              compact ? "bg-ink-3 text-paper" : "bg-paper-2 text-ink"
            }`}
          >
            Preço na troca do seu pneu usado. Sem troca:{" "}
            <span className="num font-semibold">{money(p.precoSemTroca)}</span>
          </p>
        ) : (
          <p className={`mt-2 text-xs ${compact ? "text-muted-dark" : "text-muted"}`}>
            Sem exigência de troca.
          </p>
        )}
        <Link
          href={`/agendar?produto=${p.id}`}
          className={`mt-3 w-full ${compact ? "btn-signal" : "btn-ink"}`}
          aria-label={`Agendar instalação do ${p.marca} ${p.linha} ${p.medida}`}
        >
          Agendar instalação
        </Link>
      </div>
    </article>
  );
}
