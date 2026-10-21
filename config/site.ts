// Dados institucionais exibidos no rodapé e nos schemas.
// TODO: confirmar com o cliente — há duas pessoas jurídicas envolvidas e é
// preciso checar qual responde por qual loja. O CNPJ abaixo é o que aparece
// hoje no rodapé de furtilcentroautomotivo.com.br (loja de Guarulhos).
export const site = {
  name: "Furtil Pneus",
  legalName: "RS FURTIL CENTRO AUTOMOTIVO", // TODO: confirmar com o cliente
  cnpj: "24.955.568/0001-24", // TODO: confirmar com o cliente
  email: "contato@furtilpneus.com", // TODO: confirmar com o cliente
  phone: "+5511945199503",
  phoneLabel: "(11) 94519-9503",
  whatsapp: "5511945199503",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://furtilcentroautomotivo.com.br",
  facebook: "https://www.facebook.com/CentroAutomotivoFurtil/",
  instagram: "https://www.instagram.com/furtilpneus/",
  // Enquanto true, o site exibe a faixa avisando que preços e estoque do
  // catálogo são ilustrativos. Desligar só quando o catálogo vier do CMS.
  prototype: true,
} as const;

// Condições comerciais publicadas hoje no site atual.
// TODO: confirmar com o cliente se continuam valendo.
export const terms = {
  installmentsMax: 10,
  tireWarrantyYears: 5,
  serviceWarrantyMonths: 12,
} as const;

/**
 * Compromissos verificáveis — o centro da proposta de credibilidade.
 * Cada um precisa ser algo que o cliente consegue conferir na loja.
 * TODO: confirmar com o cliente que a operação cumpre cada item antes de publicar.
 */
export const commitments = [
  {
    id: "autorizacao",
    title: "Nada é trocado sem a sua autorização",
    body: "Primeiro o diagnóstico, depois o orçamento. Só mexemos no carro com o seu ok — por escrito ou no WhatsApp.",
  },
  {
    id: "evidencia",
    title: "Você vê o defeito antes de pagar por ele",
    body: "Peça gasta, vazamento ou folga: mostramos ao vivo, em foto ou em vídeo. Se não dá para mostrar, não entra no orçamento.",
  },
  {
    id: "peca-velha",
    title: "A peça velha é sua",
    body: "Toda peça substituída é devolvida ao final do serviço, se você quiser levar.",
  },
  {
    id: "preco",
    title: "Preço à vista na etiqueta",
    body: "O valor à vista é o número grande. Parcelamento e condição de troca aparecem ao lado, nunca em asterisco.",
  },
] as const;
