import Link from "next/link";
import { Logo } from "@/components/Logo";
import { formatAddress, stores } from "@/config/lojas";
import { site, terms } from "@/config/site";
import { services } from "@/config/servicos";

export function Footer() {
  const main = stores[0];
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="tread h-3 bg-signal" aria-hidden />
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-dark">
            Pneus, alinhamento e mecânica com diagnóstico antes do orçamento. Garantia de{" "}
            {terms.tireWarrantyYears} anos em pneus novos e {terms.serviceWarrantyMonths} meses em
            peças e serviços.
          </p>
          <ul className="mt-5 flex gap-2">
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost min-h-tap px-3 text-sm"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost min-h-tap px-3 text-sm"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
        <FooterCol title="Lojas">
          {stores.map((s) => (
            <li key={s.slug}>
              <Link href={`/lojas/${s.slug}`} className="hover:text-signal">
                {s.label}
              </Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Serviços">
          {services.slice(0, 6).map((s) => (
            <li key={s.slug}>
              <Link href={`/servicos/${s.slug}`} className="hover:text-signal">
                {s.name}
              </Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Site">
          <li>
            <Link href="/pneus" className="hover:text-signal">
              Catálogo de pneus
            </Link>
          </li>
          <li>
            <Link href="/como-trabalhamos" className="hover:text-signal">
              Como trabalhamos
            </Link>
          </li>
          <li>
            <Link href="/agendar" className="hover:text-signal">
              Agendar
            </Link>
          </li>
          <li>
            <Link href="/privacidade" className="hover:text-signal">
              Política de privacidade
            </Link>
          </li>
          <li>
            <Link href="/termos" className="hover:text-signal">
              Termos de uso
            </Link>
          </li>
        </FooterCol>
      </div>
      {/* TODO: confirmar com o cliente qual pessoa jurídica responde por qual loja. */}
      <div className="border-t border-line-dark">
        <address className="wrap grid gap-1 py-6 text-xs not-italic text-muted-dark sm:grid-cols-2">
          <span>
            {site.legalName} · CNPJ <span className="num">{site.cnpj}</span>
          </span>
          <span>{formatAddress(main)}</span>
          <span>
            <a href={`tel:${site.phone}`} className="hover:text-signal">
              {site.phoneLabel}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${site.email}`} className="hover:text-signal">
              {site.email}
            </a>
          </span>
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
        </address>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-signal">{title}</h2>
      <ul className="mt-3 grid gap-1 text-sm [&_a]:inline-flex [&_a]:min-h-[36px] [&_a]:items-center">
        {children}
      </ul>
    </div>
  );
}
