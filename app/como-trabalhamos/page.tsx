import type { Metadata } from "next";
import Link from "next/link";
import { Laudo } from "@/components/Laudo";
import { PageHead } from "@/components/PageHead";
import { commitments, terms } from "@/config/site";

export const metadata: Metadata = {
  title: "Como trabalhamos",
  description:
    "Diagnóstico antes do orçamento, prova do defeito em foto ou vídeo, peça velha devolvida e nada trocado sem sua autorização.",
  alternates: { canonical: "/como-trabalhamos" },
};

const steps = [
  [
    "Recepção",
    "Você conta o sintoma. Anotamos a quilometragem e fotografamos o painel na sua frente.",
  ],
  [
    "Diagnóstico",
    "Inspeção com equipamento. Cada item recebe uma medição e um limite do fabricante.",
  ],
  [
    "Laudo",
    "Você recebe o laudo no WhatsApp: OK, atenção ou trocar — com foto ou vídeo de cada problema.",
  ],
  ["Sua decisão", "Você aprova item por item. O que não for aprovado não é tocado."],
  ["Serviço e entrega", "Peças trocadas ficam à sua disposição. Garantia por escrito na nota."],
];

export default function ComoTrabalhamosPage() {
  return (
    <>
      <PageHead eyebrow="Como trabalhamos" title="Primeiro a prova, depois o orçamento">
        Oficina boa não pede confiança — mostra o que encontrou. Este é o processo em todas as
        lojas.
      </PageHead>
      <div className="wrap grid gap-14 py-14 lg:grid-cols-2">
        <ol className="grid gap-0">
          {steps.map(([t, b], i) => (
            <li
              key={t}
              className="grid grid-cols-[3rem_1fr] gap-3 border-l-2 border-ink pb-8 pl-5 last:border-transparent last:pb-0"
            >
              <span className="-ml-[2.15rem] flex h-9 w-9 items-center justify-center rounded-full bg-signal font-mono text-sm font-semibold text-ink ring-4 ring-paper">
                {i + 1}
              </span>
              <div className="-ml-8">
                <h2 className="text-xl font-semibold">{t}</h2>
                <p className="mt-1 text-muted">{b}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="grid content-start gap-8">
          <Laudo />
        </div>
      </div>
      <section aria-labelledby="compromissos" className="wrap pb-16">
        <div className="rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12 sm:py-14">
          <h2 id="compromissos" className="h-display text-[clamp(1.9rem,5vw,3rem)]">
            Compromissos que você pode cobrar
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {commitments.map((c) => (
              <li key={c.id} className="rounded-2xl bg-ink-2 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-signal">{c.title}</h3>
                <p className="mt-2 text-muted-dark">{c.body}</p>
              </li>
            ))}
            <li className="rounded-2xl bg-ink-2 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-signal">Garantia por escrito</h3>
              <p className="mt-2 text-muted-dark">
                {terms.tireWarrantyYears} anos em pneus novos e {terms.serviceWarrantyMonths} meses
                em peças e serviços, descritos na nota.
              </p>
            </li>
            <li className="rounded-2xl bg-ink-2 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-signal">Algo deu errado?</h3>
              <p className="mt-2 text-muted-dark">
                Fale direto com a gerência da loja pelo WhatsApp. Resposta em até 1 dia útil.
              </p>
            </li>
          </ul>
          <Link href="/agendar" className="btn-signal mt-8">
            Agendar um diagnóstico
          </Link>
        </div>
      </section>
    </>
  );
}
