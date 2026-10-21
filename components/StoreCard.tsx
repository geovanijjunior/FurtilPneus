import Link from "next/link";
import { formatAddress, weekdayLabels, type Store, type Weekday } from "@/config/lojas";

export function hoursSummary(s: Store) {
  const wk = s.hours.seg;
  const sat = s.hours.sab;
  const parts = [];
  if (wk) parts.push(`Seg a sex ${wk[0].slice(0, 2)}h–${wk[1].slice(0, 2)}h`);
  if (sat) parts.push(`Sáb ${sat[0].slice(0, 2)}h–${sat[1].slice(0, 2)}h`);
  return parts.join(" · ");
}

export function Unconfirmed({ children = "a confirmar" }: { children?: React.ReactNode }) {
  return (
    <span className="ml-1 inline-block rounded-sm border border-current px-1 align-middle font-mono text-[0.62rem] uppercase tracking-wider">
      {children}
    </span>
  );
}

export function StoreCard({ store: s }: { store: Store }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-white p-5">
      <p className="eyebrow text-muted">{s.city}</p>
      <h3 className="h-display mt-1 text-3xl">{s.label}</h3>
      <p className="mt-3 text-sm">
        {formatAddress(s)}
        {!s.confirmed.address ? <Unconfirmed /> : null}
      </p>
      <p className="mt-2 text-sm text-muted">
        {hoursSummary(s)}
        {!s.confirmed.hours ? <Unconfirmed /> : null}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link
          href={`/lojas/${s.slug}`}
          className="btn-ink text-sm"
          aria-label={`Ver loja ${s.label}`}
        >
          Ver loja
        </Link>
        <a
          href={`tel:${s.phone}`}
          className="btn-ghost text-sm"
          aria-label={`Ligar para a loja ${s.label}`}
        >
          Ligar
        </a>
      </div>
    </article>
  );
}

export function HoursTable({ store: s }: { store: Store }) {
  const days = Object.keys(weekdayLabels) as Weekday[];
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Horário de funcionamento por dia da semana</caption>
      <tbody>
        {days.map((d) => {
          const h = s.hours[d];
          return (
            <tr key={d} className="border-b border-line last:border-0">
              <th scope="row" className="py-2 text-left font-medium">
                {weekdayLabels[d]}
              </th>
              <td className="num py-2 text-right font-mono">
                {h ? `${h[0]} – ${h[1]}` : "Fechado"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
