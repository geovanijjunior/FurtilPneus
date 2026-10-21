import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Prose } from "@/components/Prose";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a Furtil Pneus trata os dados da consulta por placa, do agendamento e da navegação, conforme a LGPD.",
  alternates: { canonical: "/privacidade" },
};

// TODO: texto-base para revisão jurídica. Precisa cobrir a ferramenta de placa
// antes de a consulta veicular real (fase 4) entrar no ar.
export default function PrivacidadePage() {
  return (
    <>
      <PageHead eyebrow="LGPD" title="Política de privacidade">
        Versão preliminar, em revisão jurídica.
      </PageHead>
      <Prose>
        <h2>Consulta pela placa</h2>
        <p>
          A placa é usada só para identificar marca, modelo, ano e versão do carro e, com isso, a
          medida de pneu de fábrica. Não buscamos nem guardamos dados do proprietário, do documento
          ou de restrições do veículo.
        </p>
        <h2>Agendamento</h2>
        <p>
          O formulário de agendamento monta uma mensagem e abre o WhatsApp no seu aparelho. Os dados
          só chegam à loja se você enviar a mensagem.
        </p>
        <h2>Armazenamento no navegador</h2>
        <p>
          Guardamos no seu próprio navegador a loja escolhida e, durante a visita, o carro
          consultado — para não perguntar de novo a cada página. Nada disso é enviado a nós.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Para acesso, correção ou exclusão de dados, escreva para{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
        <p className="text-sm text-muted">
          Controlador: {site.legalName}, CNPJ {site.cnpj}.
        </p>
      </Prose>
    </>
  );
}
