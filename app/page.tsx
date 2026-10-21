import Link from "next/link";
import { Laudo } from "@/components/Laudo";
import { StoreCard } from "@/components/StoreCard";
import { Arrow, PlateFinder } from "@/components/finder/PlateFinder";
import { stores } from "@/config/lojas";
import { services } from "@/config/servicos";
import { commitments, terms } from "@/config/site";
import { installment, money } from "@/lib/format";

// Tabela "a partir de" publicada hoje no site atual (preço à vista, na troca do usado).
// TODO: confirmar com o cliente se os valores continuam valendo.
const fromPrices = [
  { rim: "13", price: 189.9 },
  { rim: "14", price: 199.9 },
  { rim: "15", price: 239.9 },
  { rim: "16", price: 269.9 },
];

export default function Home() {
  return (
    <>
      {/* Hero: a placa é a primeira coisa que o cliente toca. */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="wrap grid gap-7 pb-14 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16">
          <div className="lg:pt-6">
            <p className="eyebrow text-signal">Guarulhos · Tremembé · Vila Formosa</p>
            <h1 className="h-display mt-4 text-[clamp(2.5rem,9.5vw,5.6rem)]">
              O pneu certo
              <br />
              pela placa.
              <br />
              <span className="text-signal">O preço certo</span>
              <br />
              na etiqueta.
            </h1>
            <p className="mt-6 hidden max-w-md text-lg text-muted-dark sm:block">
              Digite a placa, confirme o carro e veja só os pneus que servem nele — com o valor à
              vista em destaque e a condição escrita do lado.
            </p>
          </div>
          <div className="rounded-xl border border-line-dark bg-ink-2 p-5 sm:p-7">
            <PlateFinder />
          </div>
        </div>
        <div className="border-t border-line-dark">
          <ul className="mx-auto grid max-w-page grid-cols-2 gap-px bg-line-dark lg:grid-cols-4">
            {[
              [`${terms.tireWarrantyYears} anos`, "de garantia em pneus novos"],
              [`${terms.serviceWarrantyMonths} meses`, "de garantia em peças e serviços"],
              [`${terms.installmentsMax}x`, "sem juros no cartão"],
              ["Diagnóstico", "antes de qualquer orçamento"],
            ].map(([big, small]) => (
              <li key={big} className="bg-ink px-4 py-5 sm:px-6">
                <span className="h-display block text-2xl text-signal sm:text-3xl">{big}</span>
                <span className="mt-1 block text-sm text-muted-dark">{small}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Credibilidade: mostrar o laudo em vez de prometer honestidade. */}
      <section
        aria-labelledby="como"
        className="wrap grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24"
      >
        <div>
          <p className="eyebrow text-signal-deep">Como trabalhamos</p>
          <h2 id="como" className="h-display mt-3 text-[clamp(2.3rem,7vw,3.8rem)]">
            Você vê o defeito antes de pagar por ele.
          </h2>
          <ol className="mt-8 grid gap-6">
            {commitments.map((c, i) => (
              <li key={c.id} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="num font-mono text-sm font-semibold text-muted">0{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-muted">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/como-trabalhamos" className="btn-ink mt-8">
            Ver o processo completo <Arrow />
          </Link>
        </div>
        <Laudo />
      </section>

      {/* Preços de referência por aro */}
      <section aria-labelledby="precos" className="border-y border-line bg-paper-2">
        <div className="wrap py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-signal-deep">Pneus novos</p>
              <h2 id="precos" className="h-display mt-3 text-[clamp(2.3rem,7vw,3.8rem)]">
                Preço por aro, sem surpresa
              </h2>
            </div>
            <Link href="/pneus" className="btn-ghost">
              Ver catálogo completo
            </Link>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fromPrices.map((p) => (
              <li key={p.rim} className="rounded-lg border border-line bg-white p-5">
                <p className="flex items-baseline gap-2">
                  <span className="eyebrow text-muted">Aro</span>
                  <span className="h-display text-5xl">{p.rim}</span>
                </p>
                <p className="mt-4 text-xs text-muted">a partir de, à vista</p>
                <p className="num font-display text-4xl font-extrabold tracking-tight">
                  {money(p.price)}
                </p>
                <p className="num mt-1 text-sm text-muted">
                  ou {terms.installmentsMax}x de {installment(p.price, terms.installmentsMax)}
                </p>
                <p className="mt-3 rounded-sm bg-paper-2 px-2 py-1 text-xs font-medium">
                  Na troca do seu pneu usado. Marca e medida conforme estoque da loja.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Serviços */}
      <section aria-labelledby="servicos" className="wrap py-16 lg:py-24">
        <p className="eyebrow text-signal-deep">Serviços</p>
        <h2 id="servicos" className="h-display mt-3 text-[clamp(2.3rem,7vw,3.8rem)]">
          O que é, quando fazer,
          <br className="hidden sm:block" /> quanto custa, quanto demora.
        </h2>
        <ul className="mt-10 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="border-b border-r border-line">
              <Link
                href={`/servicos/${s.slug}`}
                className="group flex h-full flex-col p-5 hover:bg-white sm:p-6"
              >
                <h3 className="text-xl font-semibold group-hover:underline">{s.name}</h3>
                <p className="mt-2 text-sm text-muted">{s.short}</p>
                <dl className="mt-auto grid grid-cols-2 gap-2 pt-5 text-sm">
                  <div>
                    <dt className="eyebrow text-muted">Custa</dt>
                    <dd className="num font-semibold">
                      {s.price.from ? `a partir de ${money(s.price.from)}` : "sob orçamento"}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-muted">Demora</dt>
                    <dd className="font-semibold">
                      {s.duration.replace(/^Cerca de /, "~").replace(/\.$/, "")}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Lojas */}
      <section aria-labelledby="lojas" className="bg-paper-2">
        <div className="wrap py-16 lg:py-20">
          <p className="eyebrow text-signal-deep">Lojas</p>
          <h2 id="lojas" className="h-display mt-3 text-[clamp(2.3rem,7vw,3.8rem)]">
            Três endereços, um padrão
          </h2>
          <ul className="mt-10 grid gap-3 md:grid-cols-3">
            {stores.map((s) => (
              <li key={s.slug} className="flex">
                <StoreCard store={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-signal text-ink">
        <div className="wrap flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="h-display text-[clamp(2.2rem,6vw,3.4rem)]">
            Agende e chegue com tudo combinado.
          </h2>
          <Link href="/agendar" className="btn-ink shrink-0 text-base">
            Agendar horário <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
