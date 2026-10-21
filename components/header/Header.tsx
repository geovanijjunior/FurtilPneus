import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { PlateChip } from "./PlateChip";
import { StoreSwitcher } from "./StoreSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <a href="#conteudo" className="btn-ink sr-only absolute left-2 top-2 z-50 focus:not-sr-only">
        Pular para o conteúdo
      </a>
      {site.prototype ? (
        <p className="bg-ink px-4 py-1 text-center text-[0.72rem] font-medium text-white">
          <span className="text-signal">●</span> Protótipo — preços e estoque do catálogo são
          ilustrativos
        </p>
      ) : null}
      <div className="wrap relative flex h-16 items-center gap-2 lg:h-[72px]">
        <Link
          href="/"
          className="-ml-1 flex min-h-tap shrink-0 items-center px-1"
          aria-label="Furtil Pneus — início"
        >
          <Logo />
        </Link>
        <NavLinks />
        <div className="ml-auto flex items-center gap-1.5">
          <PlateChip />
          <StoreSwitcher className="hidden md:block" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
