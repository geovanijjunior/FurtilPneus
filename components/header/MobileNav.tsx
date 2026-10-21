"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { StoreSwitcher } from "./StoreSwitcher";

const items = [
  { href: "/pneus", label: "Pneus" },
  { href: "/servicos", label: "Serviços" },
  { href: "/lojas", label: "Lojas" },
  { href: "/como-trabalhamos", label: "Como trabalhamos" },
  { href: "/agendar", label: "Agendar" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const pathname = usePathname();

  // Fecha o menu ao navegar.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Link
        href="/agendar"
        className="btn-ink ml-1 hidden min-h-[44px] px-5 text-sm lg:inline-flex"
      >
        Agendar
      </Link>
      <button
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-tap min-w-tap items-center justify-center rounded-full hover:bg-paper-2 lg:hidden"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h10" />}
        </svg>
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-line bg-white shadow-xl lg:hidden"
      >
        <nav aria-label="Menu" className="wrap pb-6 pt-2">
          <ul>
            {items.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className="flex min-h-[56px] items-center justify-between border-b border-line text-lg font-semibold aria-[current=page]:text-signal-deep"
                >
                  {n.label}
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <StoreSwitcher inline className="mt-4 md:hidden" />
        </nav>
      </div>
    </>
  );
}
