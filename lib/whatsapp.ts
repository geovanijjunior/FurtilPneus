import { site } from "@/config/site";

export function waLink(text: string, number: string = site.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
