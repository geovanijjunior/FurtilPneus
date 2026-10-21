import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { services } from "@/config/servicos";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Serviços — alinhamento, freios, suspensão, óleo",
  description:
    "Cada serviço com o que é, quando fazer, quanto custa e quanto demora. Diagnóstico antes do orçamento e nada trocado sem sua autorização.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <PageHead eyebrow="Serviços" title="Quatro respostas para cada serviço">
        O que é, quando fazer, quanto custa e quanto demora. Se faltar alguma, a gente responde no
        WhatsApp.
      </PageHead>
      <div className="wrap py-10">
        <ul className="grid gap-3 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/servicos/${s.slug}`}
                className="card lift group grid h-full gap-3 p-5 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <h2 className="text-xl font-semibold group-hover:underline">{s.name}</h2>
                  <p className="mt-1 text-sm text-muted">{s.short}</p>
                </div>
                <dl className="num text-sm sm:text-right">
                  <dt className="sr-only">Preço</dt>
                  <dd className="font-semibold">
                    {s.price.from ? `a partir de ${money(s.price.from)}` : "sob orçamento"}
                  </dd>
                  <dt className="sr-only">Duração</dt>
                  <dd className="text-muted">{s.duration}</dd>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
