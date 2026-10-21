import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { HoursTable, Unconfirmed } from "@/components/StoreCard";
import { formatAddress, getStore, stores, type Store, type Weekday } from "@/config/lojas";
import { site } from "@/config/site";
import { getPlaceReviews, type PlaceReviews } from "@/lib/reviews";
import { waLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ loja: string }> };

export function generateStaticParams() {
  return stores.map((s) => ({ loja: s.slug }));
}
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getStore((await params).loja);
  if (!s) return {};
  return {
    title: `Loja ${s.label}`,
    description: `Furtil Pneus ${s.label}: ${formatAddress(s)}. Telefone ${s.phoneLabel}. Pneus, alinhamento, freios e suspensão.`,
    alternates: { canonical: `/lojas/${s.slug}` },
  };
}

const dayCodes: Record<Weekday, string> = {
  seg: "Monday",
  ter: "Tuesday",
  qua: "Wednesday",
  qui: "Thursday",
  sex: "Friday",
  sab: "Saturday",
  dom: "Sunday",
};

function schema(s: Store, reviews: PlaceReviews | null) {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRepair", "LocalBusiness"],
    "@id": `${site.url}/lojas/${s.slug}#loja`,
    name: s.name,
    url: `${site.url}/lojas/${s.slug}`,
    telephone: s.phone,
    priceRange: "R$",
    address: {
      "@type": "PostalAddress",
      streetAddress: [s.street, s.number].filter(Boolean).join(", "),
      addressLocality: s.city,
      addressRegion: s.state,
      postalCode: s.cep ?? undefined,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng },
    openingHoursSpecification: (Object.keys(s.hours) as Weekday[])
      .filter((d) => s.hours[d])
      .map((d) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayCodes[d],
        opens: s.hours[d]![0],
        closes: s.hours[d]![1],
      })),
    // Só com avaliações reais vindas do Google.
    ...(reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.rating,
            reviewCount: reviews.count,
          },
        }
      : {}),
  };
}

export default async function LojaPage({ params }: Props) {
  const s = getStore((await params).loja);
  if (!s) notFound();
  const reviews = await getPlaceReviews(s.googlePlaceId);
  const d = 0.008;
  const bbox = [s.geo.lng - d, s.geo.lat - d / 1.6, s.geo.lng + d, s.geo.lat + d / 1.6].join(",");
  const mapsQuery = encodeURIComponent(`Furtil Pneus ${formatAddress(s)}`);

  return (
    <>
      <JsonLd data={schema(s, reviews)} />
      <PageHead eyebrow={s.city} title={`Loja ${s.label}`} />
      <div className="wrap grid gap-10 py-10 lg:grid-cols-[1fr_22rem]">
        <div className="grid content-start gap-6">
          <div className="overflow-hidden rounded-lg border border-line bg-paper-2">
            <iframe
              title={`Mapa da loja ${s.label}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${s.geo.lat},${s.geo.lng}`}
              className="block aspect-[4/3] w-full sm:aspect-[16/9]"
              loading="lazy"
            />
          </div>
          {!s.confirmed.geo ? (
            <p className="text-sm text-muted">
              Posição no mapa aproximada <Unconfirmed />
            </p>
          ) : null}
          {reviews ? <Reviews data={reviews} /> : null}
        </div>
        <aside className="grid content-start gap-4">
          <section
            aria-labelledby="endereco"
            className="rounded-lg border border-line bg-white p-5"
          >
            <h2 id="endereco" className="eyebrow text-muted">
              Endereço
            </h2>
            <address className="mt-2 not-italic">
              {s.street}
              {s.number ? `, ${s.number}` : ""}
              <br />
              {s.district} — {s.city}/{s.state}
              {s.cep ? (
                <>
                  <br />
                  CEP {s.cep}
                </>
              ) : null}
              {!s.confirmed.address ? <Unconfirmed /> : null}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink mt-4 w-full"
            >
              Como chegar
            </a>
          </section>
          <section aria-labelledby="horario" className="rounded-lg border border-line bg-white p-5">
            <h2 id="horario" className="eyebrow text-muted">
              Horário {!s.confirmed.hours ? <Unconfirmed /> : null}
            </h2>
            <div className="mt-2">
              <HoursTable store={s} />
            </div>
          </section>
          <section aria-labelledby="contato" className="rounded-lg bg-ink p-5 text-paper">
            <h2 id="contato" className="eyebrow text-signal">
              Contato
            </h2>
            <a
              href={`tel:${s.phone}`}
              className="num mt-2 flex min-h-tap items-center text-2xl font-semibold"
            >
              {s.phoneLabel}
            </a>
            <div className="mt-3 grid gap-2">
              <a
                href={waLink(`Olá, Furtil ${s.label}!`, s.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whats"
              >
                WhatsApp
              </a>
              <Link href={`/agendar?loja=${s.slug}`} className="btn-signal">
                Agendar nesta loja
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Reviews({ data }: { data: PlaceReviews }) {
  const fmt = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
  return (
    <section aria-labelledby="avaliacoes">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="avaliacoes" className="h-display text-3xl">
          Avaliações no Google
        </h2>
        <p className="num text-sm">
          <strong>{data.rating.toFixed(1).replace(".", ",")}</strong> de 5 · {data.count} avaliações
        </p>
      </div>
      <ul className="mt-4 grid gap-3">
        {data.reviews.map((r) => (
          <li key={r.url} className="rounded-lg border border-line bg-white p-4">
            <p className="flex flex-wrap justify-between gap-2 text-sm">
              <strong>{r.author}</strong>
              <span className="text-muted">
                <span className="sr-only">Nota </span>
                {r.rating}/5 · {fmt.format(new Date(r.date))}
              </span>
            </p>
            <p className="mt-2">{r.text}</p>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-tap items-center text-sm underline underline-offset-4"
            >
              Ver no Google
            </a>
          </li>
        ))}
      </ul>
      {data.mapsUrl ? (
        <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4">
          Ver todas as avaliações
        </a>
      ) : null}
    </section>
  );
}
