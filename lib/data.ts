import seed from "@/data/seed.json";
import type { Product, Vehicle } from "./types";

export const vehicles = seed.veiculos as Vehicle[];
export const products = seed.produtos as Product[];
export const testPlates = seed.placasDeTeste as Record<string, string>;

/** "205/55 R16" → "205-55-r16" */
export function sizeToSlug(size: string) {
  return size.toLowerCase().replace("/", "-").replace(" ", "-");
}

/** "205-55-r16" → "205/55 R16" */
export function slugToSize(slug: string) {
  const m = /^(\d{3})-(\d{2})-r(\d{2})$/i.exec(slug);
  return m ? `${m[1]}/${m[2]} R${m[3]}` : null;
}

export function parseSize(size: string) {
  const m = /^(\d{3})\/(\d{2}) R(\d{2})$/.exec(size);
  if (!m) return null;
  return { width: m[1], profile: m[2], rim: m[3] };
}

export const allSizes = Array.from(new Set(products.map((p) => p.medida))).sort((a, b) => {
  const pa = parseSize(a)!;
  const pb = parseSize(b)!;
  return (
    pa.rim.localeCompare(pb.rim) ||
    pa.width.localeCompare(pb.width) ||
    pa.profile.localeCompare(pb.profile)
  );
});

export const allBrands = Array.from(new Set(products.map((p) => p.marca))).sort();

export function productsForSize(size: string) {
  return products.filter((p) => p.medida === size).sort((a, b) => a.precoVista - b.precoVista);
}

export function vehiclesForSize(size: string) {
  return vehicles.filter((v) => v.medidas.some((m) => m.medida === size));
}
