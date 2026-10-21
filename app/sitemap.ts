import type { MetadataRoute } from "next";
import { stores } from "@/config/lojas";
import { services } from "@/config/servicos";
import { site } from "@/config/site";
import { allSizes, sizeToSlug } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/pneus",
    "/servicos",
    "/lojas",
    "/agendar",
    "/como-trabalhamos",
    "/privacidade",
    "/termos",
    ...allSizes.map((s) => `/pneus/${sizeToSlug(s)}`),
    ...services.map((s) => `/servicos/${s.slug}`),
    ...stores.map((s) => `/lojas/${s.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
