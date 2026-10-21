"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const nav = [
  { href: "/pneus", label: "Pneus" },
  { href: "/servicos", label: "Serviços" },
  { href: "/lojas", label: "Lojas" },
  { href: "/como-trabalhamos", label: "Como trabalhamos" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="ml-6 hidden lg:block">
      <ul className="flex gap-1 rounded-full bg-paper-2/70 p-1">
        {nav.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-ink aria-[current=page]:bg-white aria-[current=page]:text-ink aria-[current=page]:shadow-sm"
              >
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
