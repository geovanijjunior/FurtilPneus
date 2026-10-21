import Link from "next/link";
import { HeroTire } from "@/components/HeroTire";
import { Laudo } from "@/components/Laudo";
import { RimPrices } from "@/components/RimPrices";
import { StoreCard } from "@/components/StoreCard";
import { Arrow, PlateFinder } from "@/components/finder/PlateFinder";
import { stores } from "@/config/lojas";
import { services } from "@/config/servicos";
import { commitments, terms } from "@/config/site";
import { allBrands } from "@/lib/data";
import { money } from "@/lib/format";

const perks = [
  { big: `${terms.tireWarrantyYears} anos`, small: "de garantia em pneus novos", icon: "shield" },
  {
    big: `${terms.serviceWarrantyMonths} meses`,
    small: "de garantia em peças e serviços",
    icon: "wrench",
  },
  { big: `${terms.installmentsMax}x`, small: "sem juros no cartão", icon: "card" },
  { big: "Laudo", small: "com foto antes de qualquer troca", icon: "camera" },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero: a placa é a primeira coisa que o cliente toca. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgb(var(--line))_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,#000,transparent_85%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-signal/25 blur-3xl"
        />
        <div className="wrap relative grid gap-10 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-6 lg:pb-24 lg:pt-16">
          <div className="min-w-0">
            <p className="eyebrow">Guarulhos · Tremembé · Vila Formosa</p>
            <h1 className="h-display mt-4 text-[clamp(2.4rem,7.6vw,4.6rem)]">
              O pneu certo <span className="mark">pela placa</span>.
              <span className="block text-muted">O preço certo na etiqueta.</span>
            </h1>
            <p className="mt-5 hidden max-w-lg text-lg text-muted sm:block">
              Digite a placa, confirme o carro e veja só os pneus que servem nele, com o valor à
              vista em destaque.
            </p>
            <div className="card mt-7 p-5 shadow-[0_30px_60px_-35px_rgb(var(--ink)/0.45)] sm:p-7 lg:max-w-xl">
              <PlateFinder />
            </div>
          </div>
          <div className="relative hidden lg:block">
            <HeroTire className="mx-auto w-full max-w-[30rem]" />
            <Floating
              className="left-0 top-[12%]"
              title={`${terms.tireWarrantyYears} anos`}
              body="de garantia"
            />
            <Floating
              className="bottom-[14%] right-0"
              title={`${terms.installmentsMax}x sem juros`}
              body="no cartão"
              dark
            />
          </div>
        </div>
      </section>

      {/* Garantias */}
      <section aria-label="Garantias" className="wrap -mt-6 lg:-mt-10">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {perks.map((p) => (
            <li key={p.big} className="card lift flex flex-col gap-3 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal">
                <PerkIcon name={p.icon} />
              </span>
              <span>
                <span className="block font-display text-2xl font-extrabold tracking-tight">
                  {p.big}
                </span>
                <span className="mt-0.5 block text-sm text-muted">{p.small}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Marcas */}
      <section aria-label="Marcas no catálogo" className="marquee mt-14 overflow-hidden py-2">
        <ul className="flex w-max gap-12 pr-12">
          {[...allBrands, ...allBrands, ...allBrands, ...allBrands].map((b, i) => (
            <li
              key={i}
              aria-hidden={i >= allBrands.length}
              className="font-display text-2xl font-extrabold uppercase italic tracking-tight text-ink/25"
            >
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* Credibilidade: mostrar o laudo em vez de prometer honestidade. */}
      <section
        aria-labelledby="como"
        className="wrap grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28"
      >
        <div>
          <p className="eyebrow">Como trabalhamos</p>
          <h2 id="como" className="h-display mt-3 text-[clamp(2rem,5vw,3.2rem)]">
            Você vê o defeito <span className="mark">antes</span> de pagar por ele.
          </h2>
          <ul className="mt-8 grid gap-5">
            {commitments.map((c) => (
              <li key={c.id} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs text-signal"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-muted">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/como-trabalhamos" className="btn-ghost mt-8">
            Ver o processo completo <Arrow />
          </Link>
        </div>
        <div>
          <p className="mb-3 text-sm text-muted">Experimente: marque o que você aprovaria.</p>
          <Laudo />
        </div>
      </section>

      {/* Preços de referência por aro */}
      <section aria-labelledby="precos" className="bg-white">
        <div className="wrap py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Pneus novos</p>
            <h2 id="precos" className="h-display mt-3 text-[clamp(2rem,5vw,3.2rem)]">
              Preço por aro, sem asterisco.
            </h2>
          </div>
          <div className="mt-10">
            <RimPrices />
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section aria-labelledby="servicos" className="wrap py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="eyebrow">Serviços</p>
            <h2 id="servicos" className="h-display mt-3 text-[clamp(2rem,5vw,3.2rem)]">
              O que é, quando fazer, quanto custa e quanto demora.
            </h2>
          </div>
          <Link href="/servicos" className="btn-ghost">
            Todos os serviços <Arrow />
          </Link>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <li key={s.slug}>
              <Link
                href={`/servicos/${s.slug}`}
                className="card lift group flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold tracking-tight">{s.name}</h3>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper-2 transition-colors group-hover:bg-signal"
                  >
                    <Arrow />
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{s.short}</p>
                <dl className="mt-auto flex flex-wrap gap-2 pt-5 text-xs">
                  <div className="rounded-full bg-paper px-3 py-1">
                    <dt className="sr-only">Custa</dt>
                    <dd className="num font-semibold">
                      {s.price.from ? `a partir de ${money(s.price.from)}` : "sob orçamento"}
                    </dd>
                  </div>
                  <div className="rounded-full bg-paper px-3 py-1">
                    <dt className="sr-only">Demora</dt>
                    <dd>{s.duration.replace(/^Cerca de /, "~").replace(/\.$/, "")}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Lojas */}
      <section aria-labelledby="lojas" className="bg-white">
        <div className="wrap py-20 lg:py-24">
          <p className="eyebrow">Lojas</p>
          <h2 id="lojas" className="h-display mt-3 text-[clamp(2rem,5vw,3.2rem)]">
            Três endereços, o mesmo processo.
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

      <section className="wrap py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/30 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="h-display text-[clamp(1.9rem,4.5vw,3rem)]">
                Agende e chegue com <span className="text-signal">tudo combinado</span>.
              </h2>
              <p className="mt-3 max-w-md text-muted-dark">
                Escolha loja, dia e período. A confirmação chega no WhatsApp.
              </p>
            </div>
            <Link href="/agendar" className="btn-signal shrink-0 text-base">
              Agendar horário <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Floating({
  className,
  title,
  body,
  dark,
}: {
  className: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-2xl px-4 py-3 shadow-[0_20px_40px_-20px_rgb(var(--ink)/0.5)] ${
        dark ? "bg-ink text-white" : "bg-white text-ink"
      } ${className}`}
    >
      <p className="font-display text-xl font-extrabold leading-tight tracking-tight">{title}</p>
      <p className={`text-xs ${dark ? "text-muted-dark" : "text-muted"}`}>{body}</p>
    </div>
  );
}

function PerkIcon({ name }: { name: (typeof perks)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
        </svg>
      );
    case "card":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M7 15h4" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
  }
}
