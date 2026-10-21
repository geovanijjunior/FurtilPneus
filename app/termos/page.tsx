import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Prose } from "@/components/Prose";
import { terms } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Condições de preço, parcelamento, troca de pneu usado e garantia dos produtos e serviços Furtil Pneus.",
  alternates: { canonical: "/termos" },
};

// TODO: texto-base para revisão jurídica.
export default function TermosPage() {
  return (
    <>
      <PageHead eyebrow="Condições" title="Termos de uso" />
      <Prose>
        <h2>Preços</h2>
        <p>
          O preço em destaque é sempre o valor à vista, por unidade. O parcelamento em até{" "}
          {terms.installmentsMax}x sem juros no cartão aparece logo abaixo.
        </p>
        <h2>Condição de troca</h2>
        <p>
          Quando o preço depende da entrega do seu pneu usado, isso está escrito no próprio card do
          produto, junto com o valor sem troca.
        </p>
        <h2>Garantia</h2>
        <ul>
          <li>Pneus novos: {terms.tireWarrantyYears} anos contra defeito de fabricação.</li>
          <li>Peças e serviços: {terms.serviceWarrantyMonths} meses.</li>
        </ul>
      </Prose>
    </>
  );
}
