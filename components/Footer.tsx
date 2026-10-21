import Link from "next/link";
import { Logo } from "@/components/Logo";
import { formatAddress, stores } from "@/config/lojas";
import { services } from "@/config/servicos";
import { site, terms } from "@/config/site";

export function Footer() {
  const main = stores[0];
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo invert />
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
                className="btn min-h-tap border border-line-dark px-4 text-sm hover:border-signal hover:text-signal"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn min-h-tap border border-line-dark px-4 text-sm hover:border-signal hover:text-signal"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
        <FooterCol title="Lojas">
          {stores.map((s) => (
            <li key={s.slug}>
              <Link href={`/lojas/${s.slug}`}>{s.label}</Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Serviços">
          {services.slice(0, 6).map((s) => (
            <li key={s.slug}>
              <Link href={`/servicos/${s.slug}`}>{s.name}</Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Site">
          <li>
            <Link href="/pneus">Catálogo de pneus</Link>
          </li>
          <li>
            <Link href="/como-trabalhamos">Como trabalhamos</Link>
          </li>
          <li>
            <Link href="/agendar">Agendar</Link>
          </li>
          <li>
            <Link href="/privacidade">Política de privacidade</Link>
          </li>
          <li>
            <Link href="/termos">Termos de uso</Link>
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
      <h2 className="label text-signal">{title}</h2>
      <ul className="mt-3 grid gap-0.5 text-sm text-white/85 [&_a:hover]:text-signal [&_a]:inline-flex [&_a]:min-h-[36px] [&_a]:items-center [&_a]:transition-colors">
        {children}
      </ul>
    </div>
  );
}
