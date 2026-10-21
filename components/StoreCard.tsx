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
    <span className="ml-1.5 inline-block rounded-full bg-signal-soft px-2 py-0.5 align-middle text-[0.68rem] font-semibold text-signal-deep">
      {children}
    </span>
  );
}

export function StoreCard({ store: s }: { store: Store }) {
  return (
    <article className="card lift flex w-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{s.city}</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-signal" aria-hidden>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M10 1.5a6 6 0 0 0-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 0 0-6-6Zm0 8.2A2.2 2.2 0 1 1 10 5.3a2.2 2.2 0 0 1 0 4.4Z" />
          </svg>
        </span>
      </div>
      <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">{s.label}</h3>
      <p className="mt-3 text-sm">
        {formatAddress(s)}
        {!s.confirmed.address ? <Unconfirmed /> : null}
      </p>
      <p className="mt-2 text-sm text-muted">
        {hoursSummary(s)}
        {!s.confirmed.hours ? <Unconfirmed /> : null}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
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
  const today = (["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as Weekday[])[
    new Date().getDay()
  ];
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Horário de funcionamento por dia da semana</caption>
      <tbody>
        {days.map((d) => {
          const h = s.hours[d];
          return (
            <tr key={d} className="border-b border-line last:border-0">
              <th scope="row" className="py-2.5 text-left font-medium">
                {weekdayLabels[d]}
              </th>
              <td className="num py-2.5 text-right font-mono text-muted">
                {h ? `${h[0]} – ${h[1]}` : "Fechado"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
