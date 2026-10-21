// TODO: confirmar com o cliente — números das ruas, CEPs, coordenadas,
// telefones por loja e horários. Itens com `confirmed: false` aparecem no
// site com o aviso "a confirmar".
export type Weekday = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export type Store = {
  slug: string;
  name: string;
  label: string; // como aparece no header
  street: string;
  number: string | null;
  district: string;
  city: string;
  state: "SP";
  cep: string | null;
  geo: { lat: number; lng: number };
  phone: string;
  phoneLabel: string;
  whatsapp: string;
  hours: Record<Weekday, [string, string] | null>;
  googlePlaceId: string | null;
  confirmed: { address: boolean; hours: boolean; geo: boolean };
};

const defaultHours: Store["hours"] = {
  seg: ["08:00", "18:00"],
  ter: ["08:00", "18:00"],
  qua: ["08:00", "18:00"],
  qui: ["08:00", "18:00"],
  sex: ["08:00", "18:00"],
  sab: ["08:00", "13:00"],
  dom: null,
};

export const stores: Store[] = [
  {
    // Endereço publicado hoje no site atual (Loja 02).
    slug: "guarulhos",
    name: "Furtil Pneus Guarulhos",
    label: "Guarulhos",
    street: "Av. Monteiro Lobato",
    number: "1291",
    district: "Jardim Kida",
    city: "Guarulhos",
    state: "SP",
    cep: "07112-000",
    geo: { lat: -23.4545, lng: -46.5229 }, // TODO: confirmar com o cliente
    phone: "+5511945199503",
    phoneLabel: "(11) 94519-9503",
    whatsapp: "5511945199503",
    hours: defaultHours, // TODO: confirmar com o cliente
    googlePlaceId: null, // TODO: preencher para ativar avaliações reais
    confirmed: { address: true, hours: false, geo: false },
  },
  {
    // Endereço encontrado em fonte pública (página de serviços antiga).
    slug: "tremembe",
    name: "Furtil Pneus Tremembé",
    label: "Tremembé",
    street: "Av. Josino Vieira de Góes",
    number: "444",
    district: "Tremembé",
    city: "São Paulo",
    state: "SP",
    cep: null, // TODO: confirmar com o cliente
    geo: { lat: -23.4599, lng: -46.6043 }, // TODO: confirmar com o cliente
    phone: "+5511945199503", // TODO: telefone próprio da loja?
    phoneLabel: "(11) 94519-9503",
    whatsapp: "5511945199503",
    hours: defaultHours, // TODO: confirmar com o cliente
    googlePlaceId: null,
    confirmed: { address: false, hours: false, geo: false },
  },
  {
    slug: "vila-formosa",
    name: "Furtil Pneus Vila Formosa",
    label: "Vila Formosa",
    street: "Endereço a confirmar", // TODO: confirmar com o cliente
    number: null,
    district: "Vila Formosa",
    city: "São Paulo",
    state: "SP",
    cep: null,
    geo: { lat: -23.5672, lng: -46.5446 }, // TODO: confirmar com o cliente
    phone: "+5511945199503",
    phoneLabel: "(11) 94519-9503",
    whatsapp: "5511945199503",
    hours: defaultHours, // TODO: confirmar com o cliente
    googlePlaceId: null,
    confirmed: { address: false, hours: false, geo: false },
  },
];

export const weekdayLabels: Record<Weekday, string> = {
  seg: "Segunda",
  ter: "Terça",
  qua: "Quarta",
  qui: "Quinta",
  sex: "Sexta",
  sab: "Sábado",
  dom: "Domingo",
};

export function getStore(slug: string) {
  return stores.find((s) => s.slug === slug);
}

export function formatAddress(s: Store) {
  const n = s.number ? `, ${s.number}` : "";
  const cep = s.cep ? ` · CEP ${s.cep}` : "";
  return `${s.street}${n} — ${s.district}, ${s.city}/${s.state}${cep}`;
}
