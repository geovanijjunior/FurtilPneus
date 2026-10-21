import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { getService, services } from "@/config/servicos";
import { money } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ servico: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ servico: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).servico);
  if (!s) return {};
  return {
    title: s.name,
    description: `${s.name}: ${s.short} ${s.price.from ? `A partir de ${money(s.price.from)}.` : ""} ${s.duration}`,
    alternates: { canonical: `/servicos/${s.slug}` },
  };
}

export default async function ServicoPage({ params }: Props) {
  const s = getService((await params).servico);
  if (!s) notFound();
  const related = (s.related ?? []).map(getService).filter(Boolean);

  return (
    <>
      <PageHead eyebrow="Serviço" title={s.name}>
        {s.short}
      </PageHead>
      <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-10">
          <QA n="01" q="O que é">
            <p>{s.what}</p>
          </QA>
          <QA n="02" q="Quando fazer">
            <ul className="grid gap-2">
              {s.when.map((w) => (
                <li key={w} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-signal ring-2 ring-signal/30"
                  />
                  {w}
                </li>
              ))}
            </ul>
          </QA>
          <QA n="03" q="Quanto custa">
            <p className="num font-display text-4xl font-extrabold">
              {s.price.from ? <>a partir de {money(s.price.from)}</> : "Sob orçamento"}
            </p>
            <p className="mt-1 text-muted">
              {s.price.note} O orçamento final vem por escrito, depois do diagnóstico.
            </p>
          </QA>
          <QA n="04" q="Quanto demora">
            <p className="text-2xl font-semibold">{s.duration}</p>
          </QA>
        </div>
        <aside className="grid content-start gap-4">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <p className="font-semibold">Quer um orçamento de {s.name.toLowerCase()}?</p>
            <div className="mt-4 grid gap-2">
              <Link href={`/agendar?servico=${s.slug}`} className="btn-signal">
                Agendar
              </Link>
              <a
                href={waLink(`Olá! Quero um orçamento de ${s.name.toLowerCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whats"
              >
                Orçamento no WhatsApp
              </a>
            </div>
          </div>
          {related.length ? (
            <nav aria-label="Serviços relacionados" className="rounded-2xl border border-line p-5">
              <p className="label text-muted">Costuma ir junto</p>
              <ul className="mt-2">
                {related.map((r) => (
                  <li key={r!.slug}>
                    <Link
                      href={`/servicos/${r!.slug}`}
                      className="flex min-h-tap items-center font-semibold underline underline-offset-4"
                    >
                      {r!.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>
    </>
  );
}

function QA({ n, q, children }: { n: string; q: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-line pt-6 sm:grid-cols-[10rem_1fr]">
      <h2 className="flex items-baseline gap-3">
        <span className="num font-mono text-sm text-muted">{n}</span>
        <span className="font-display text-2xl font-bold tracking-tight">{q}</span>
      </h2>
      <div className="text-lg">{children}</div>
    </section>
  );
}
