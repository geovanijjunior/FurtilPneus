import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { site } from "@/config/site";
import {
  allSizes,
  parseSize,
  productsForSize,
  sizeToSlug,
  slugToSize,
  vehiclesForSize,
} from "@/lib/data";

type Props = { params: Promise<{ medida: string }> };

export function generateStaticParams() {
  return allSizes.map((s) => ({ medida: sizeToSlug(s) }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const size = slugToSize((await params).medida);
  if (!size) return {};
  const list = productsForSize(size);
  const min = list[0]?.precoVista;
  return {
    title: `Pneu ${size}`,
    description: `Pneu ${size} ${min ? `a partir de R$ ${min.toFixed(2).replace(".", ",")} à vista` : ""} — ${list.length} opções, garantia de 5 anos e instalação nas lojas Furtil.`,
    alternates: { canonical: `/pneus/${sizeToSlug(size)}` },
  };
}

export default async function MedidaPage({ params }: Props) {
  const size = slugToSize((await params).medida);
  if (!size || !allSizes.includes(size)) notFound();
  const parts = parseSize(size)!;
  const cars = vehiclesForSize(size);
  const list = productsForSize(size);

  return (
    <>
      <JsonLd
        data={list.map((p) => ({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Pneu ${p.marca} ${p.linha} ${p.medida} ${p.indiceCargaVelocidade}`,
          brand: { "@type": "Brand", name: p.marca },
          sku: p.id,
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: p.precoVista.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${site.url}/pneus/${sizeToSlug(p.medida)}`,
          },
        }))}
      />
      <PageHead
        eyebrow="Pneu"
        title={<span className="num font-mono font-semibold normal-case">{size}</span>}
      >
        Largura {parts.width} mm · perfil {parts.profile}% · aro {parts.rim}&quot;
      </PageHead>
      <div className="wrap py-10">
        {cars.length ? (
          <section aria-labelledby="carros" className="card mb-10 p-5">
            <h2 id="carros" className="font-semibold">
              Saem de fábrica com {size}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {cars.map((v) => {
                const fit = v.medidas.find((m) => m.medida === size);
                return (
                  <li key={v.id} className="rounded-sm bg-paper-2 px-2 py-1">
                    {v.marca} {v.modelo} {v.versao}{" "}
                    <span className="num text-muted">
                      {v.anos[0]}–{v.anos[1]}
                    </span>
                    {v.medidas.length > 1 && fit?.nota ? (
                      <span className="text-muted"> · {fit.nota.toLowerCase()}</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Não tem certeza?{" "}
              <Link href="/" className="font-semibold text-ink underline underline-offset-4">
                Confira pela placa
              </Link>
              .
            </p>
          </section>
        ) : null}
        <Catalog fixedSize={size} />
      </div>
    </>
  );
}
