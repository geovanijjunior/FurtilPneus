import { testPlates, vehicles } from "./data";
import { isValidPlate, normalizePlate, toMercosul } from "./plate";
import type { LookupResult } from "./types";

const DELAY_MS = 800;

/**
 * Consulta mockada (fase 3). Resolve só contra o seed; qualquer placa fora
 * de `placasDeTeste` retorna not_found. Placas de teste em docs/DESIGN.md.
 * Será substituída pelo route handler server-side da fase 4.
 */
export async function lookupPlate(input: string, signal?: AbortSignal): Promise<LookupResult> {
  const plate = normalizePlate(input);
  if (!isValidPlate(plate)) throw new Error("invalid_plate");

  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, DELAY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    });
  });

  const id = testPlates[plate] ?? testPlates[toMercosul(plate)];
  const vehicle = vehicles.find((v) => v.id === id);
  if (!vehicle) return { status: "not_found", plate };
  return { status: "found", plate, vehicle, year: vehicle.anos[1] };
}
