import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = {
  title: "Pneus novos — catálogo com preço à vista",
  description:
    "Pneus aro 13 a 17 com preço à vista na etiqueta, parcelamento em 10x e garantia de 5 anos. Filtre por medida, marca, preço e loja.",
  alternates: { canonical: "/pneus" },
};

export default function PneusPage() {
  return (
    <>
      <PageHead eyebrow="Catálogo" title="Pneus novos">
        Preço à vista em destaque, parcelamento ao lado e a condição de troca escrita no próprio
        card.
      </PageHead>
      <div className="wrap py-10">
        <Catalog />
      </div>
    </>
  );
}
