/**
 * Amostra de laudo/ordem de serviço — mostra, em vez de prometer, como o
 * cliente recebe o diagnóstico: item, medida encontrada, limite e decisão.
 */
const rows = [
  { item: "Pneu dianteiro esq.", found: "Sulco 2,1 mm", limit: "mín. 1,6 mm", state: "atencao" },
  { item: "Pastilha dianteira", found: "3,0 mm", limit: "mín. 2,0 mm", state: "ok" },
  { item: "Amortecedor tras. dir.", found: "Vazamento", limit: "—", state: "trocar" },
  { item: "Fluido de freio", found: "Umidade 1%", limit: "máx. 3%", state: "ok" },
] as const;

const stateLabel = { ok: "OK", atencao: "Atenção", trocar: "Trocar" } as const;
const stateClass = {
  ok: "bg-paper-2 text-ok",
  atencao: "bg-signal text-ink",
  trocar: "bg-ink text-paper",
} as const;

export function Laudo() {
  return (
    <figure className="relative rotate-[-1deg] rounded-md bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgb(var(--ink)/0.5)] sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-3">
        <div>
          <p className="eyebrow text-muted">Laudo de inspeção</p>
          <p className="mt-1 font-semibold">HB20 Comfort 1.0 · 2021</p>
        </div>
        <p className="num text-right font-mono text-xs text-muted">
          OS 004812
          <br />
          exemplo
        </p>
      </div>
      <table className="mt-3 w-full text-left text-sm">
        <caption className="sr-only">Exemplo de laudo com item, medição, limite e decisão</caption>
        <thead>
          <tr className="eyebrow text-muted">
            <th scope="col" className="pb-2 font-medium">
              Item
            </th>
            <th scope="col" className="hidden pb-2 font-medium sm:table-cell">
              Medido
            </th>
            <th scope="col" className="hidden pb-2 font-medium sm:table-cell">
              Limite
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Decisão
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="border-t border-line">
              <th scope="row" className="py-2.5 pr-2 font-medium">
                {r.item}
                <span className="num block font-mono text-xs font-normal text-muted sm:hidden">
                  {r.found} · {r.limit}
                </span>
              </th>
              <td className="num hidden py-2.5 font-mono text-xs sm:table-cell">{r.found}</td>
              <td className="num hidden py-2.5 font-mono text-xs text-muted sm:table-cell">
                {r.limit}
              </td>
              <td className="py-2.5 text-right">
                <span
                  className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ${stateClass[r.state]}`}
                >
                  {stateLabel[r.state]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-4 flex items-center gap-2 border-t-2 border-dashed border-line pt-3 text-xs text-muted">
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-ink text-ink"
          aria-hidden
        >
          ✓
        </span>
        Só os itens que você aprovar são feitos. Foto ou vídeo de cada “Trocar” vai no WhatsApp.
      </figcaption>
    </figure>
  );
}
