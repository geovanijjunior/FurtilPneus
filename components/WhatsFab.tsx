"use client";

import { WhatsIcon } from "@/components/finder/PlateFinder";
import { useApp } from "@/components/Providers";
import { stores } from "@/config/lojas";
import { displayPlate } from "@/lib/plate";
import { waLink } from "@/lib/whatsapp";

/** Botão flutuante de WhatsApp que já leva loja, placa e medida na mensagem. */
export function WhatsFab() {
  const { selection, storeSlug } = useApp();
  const store = stores.find((s) => s.slug === storeSlug) ?? stores[0];
  const parts = [`Olá, Furtil ${store.label}!`];
  if (selection?.vehicle)
    parts.push(
      `Meu carro: ${selection.vehicle.marca} ${selection.vehicle.modelo} ${selection.vehicle.versao}.`,
    );
  if (selection?.plate) parts.push(`Placa ${displayPlate(selection.plate)}.`);
  if (selection?.size) parts.push(`Medida ${selection.size}.`);
  parts.push("Quero um orçamento.");
  return (
    <a
      href={waLink(parts.join(" "), store.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whats text-white shadow-[0_8px_24px_-6px_rgb(var(--ink)/0.6)] hover:bg-ink sm:bottom-6 sm:right-6"
    >
      <span className="sr-only">Falar no WhatsApp com a loja {store.label}</span>
      <span className="[&>svg]:h-7 [&>svg]:w-7">
        <WhatsIcon />
      </span>
    </a>
  );
}
