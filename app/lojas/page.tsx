import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { StoreCard } from "@/components/StoreCard";
import { StoreSwitcher } from "@/components/header/StoreSwitcher";
import { stores } from "@/config/lojas";

export const metadata: Metadata = {
  title: "Lojas — Guarulhos, Tremembé e Vila Formosa",
  description:
    "Endereço, horário por dia da semana, telefone e mapa das lojas Furtil Pneus em Guarulhos, Tremembé e Vila Formosa.",
  alternates: { canonical: "/lojas" },
};

export default function LojasPage() {
  return (
    <>
      <PageHead eyebrow="Lojas" title="Onde estamos">
        Use a localização para achar a loja mais perto, ou escolha a sua. A loja escolhida aparece
        no topo do site.
      </PageHead>
      <div className="wrap grid gap-8 py-10 lg:grid-cols-[1fr_18rem]">
        <ul className="grid gap-3 md:grid-cols-2">
          {stores.map((s) => (
            <li key={s.slug} className="flex">
              <StoreCard store={s} />
            </li>
          ))}
        </ul>
        <StoreSwitcher inline className="h-max border border-line" />
      </div>
    </>
  );
}
