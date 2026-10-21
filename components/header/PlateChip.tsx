"use client";

import Link from "next/link";
import { MercosulPlate, plateTextClass } from "@/components/MercosulPlate";
import { useApp } from "@/components/Providers";
import { displayPlate } from "@/lib/plate";
import { sizeToSlug } from "@/lib/data";

/**
 * A placa consultada vira um chip no header (mesmo view-transition-name da
 * placa da home), carregando o contexto do carro pelo site inteiro.
 */
export function PlateChip() {
  const { selection } = useApp();
  if (!selection?.size) return null;
  const label = selection.vehicle ? selection.vehicle.modelo : null;
  return (
    <Link
      href={`/pneus/${sizeToSlug(selection.size)}`}
      className="flex min-h-tap items-center gap-2 rounded-full px-1.5 transition-colors hover:bg-paper-2"
      aria-label={`Seu carro: ${selection.plate ? `placa ${displayPlate(selection.plate)}, ` : ""}${label ? `${label}, ` : ""}medida ${selection.size}. Ver pneus.`}
    >
      {selection.plate ? (
        <MercosulPlate size="sm" transitionName="plate">
          <span className={`${plateTextClass} block px-1.5 text-[0.95rem] leading-[1.35]`}>
            {displayPlate(selection.plate)}
          </span>
        </MercosulPlate>
      ) : null}
      <span className="flex flex-col text-left leading-tight">
        {label ? <span className="hidden text-xs text-muted sm:block">{label}</span> : null}
        <span
          className={`num font-mono text-sm font-semibold text-ink ${selection.plate ? "hidden sm:block" : ""}`}
        >
          {selection.size}
        </span>
      </span>
    </Link>
  );
}
