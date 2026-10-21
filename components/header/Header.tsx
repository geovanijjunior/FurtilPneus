import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { PlateChip } from "./PlateChip";
import { StoreSwitcher } from "./StoreSwitcher";

export const nav = [
  { href: "/pneus", label: "Pneus" },
  { href: "/servicos", label: "Serviços" },
  { href: "/lojas", label: "Lojas" },
  { href: "/como-trabalhamos", label: "Como trabalhamos" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-dark bg-ink text-paper">
      <a
        href="#conteudo"
        className="btn-signal sr-only absolute left-2 top-2 z-50 focus:not-sr-only"
      >
        Pular para o conteúdo
      </a>
      {site.prototype ? (
        <p className="bg-signal px-4 py-1 text-center font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink">
          Protótipo — preços e estoque do catálogo são ilustrativos
        </p>
      ) : null}
      <div className="wrap relative flex h-16 items-center gap-2">
        <Link
          href="/"
          className="-ml-1 flex min-h-tap shrink-0 items-center px-1"
          aria-label="Furtil Pneus — início"
        >
          <Logo />
        </Link>
        <nav aria-label="Principal" className="ml-4 hidden lg:block">
          <ul className="flex gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex min-h-tap items-center rounded-md px-3 text-sm font-medium hover:bg-ink-3"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <PlateChip />
          <StoreSwitcher className="hidden md:block" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
