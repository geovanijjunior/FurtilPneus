// Cada serviço responde quatro perguntas: o que é, quando fazer, quanto
// custa, quanto demora. Preços com valor vêm da tabela publicada hoje no site
// atual; os demais ficam "sob orçamento" até o cliente informar.
// TODO: confirmar com o cliente preços e tempos médios.
export type Service = {
  slug: string;
  name: string;
  short: string;
  what: string;
  when: string[];
  price: { from: number | null; note: string };
  duration: string;
  related?: string[];
};

export const services: Service[] = [
  {
    slug: "alinhamento",
    name: "Alinhamento",
    short: "Ajuste dos ângulos das rodas para o carro andar reto e o pneu gastar por igual.",
    what: "Correção da convergência, cambagem e cáster das rodas em relação à carroceria. Medimos os ângulos no equipamento, imprimimos o antes e o depois e entregamos as duas folhas com o carro.",
    when: [
      "O volante fica torto com o carro andando reto.",
      "O carro puxa para um lado em pista plana.",
      "Um dos ombros do pneu está gastando mais que o outro.",
      "Depois de bater a roda em buraco ou guia.",
      "Sempre que trocar pneus ou peças de suspensão.",
    ],
    price: { from: null, note: "Sob orçamento — varia por modelo." },
    duration: "Cerca de 40 minutos.",
    related: ["balanceamento", "suspensao"],
  },
  {
    slug: "balanceamento",
    name: "Balanceamento",
    short: "Equilíbrio do conjunto pneu e roda para acabar com a vibração.",
    what: "Cada roda gira na balanceadora, que aponta onde falta massa. Corrigimos com contrapesos até a leitura zerar e mostramos a tela final.",
    when: [
      "O volante vibra entre 80 e 110 km/h.",
      "Na montagem de pneu novo.",
      "Depois de um conserto de furo.",
    ],
    price: { from: null, note: "Sob orçamento — por roda." },
    duration: "Cerca de 30 minutos para as quatro rodas.",
    related: ["alinhamento", "troca-de-pneus"],
  },
  {
    slug: "troca-de-pneus",
    name: "Troca de pneus",
    short: "Montagem do pneu novo na medida de fábrica do seu carro.",
    what: "Desmontagem do pneu antigo, conferência da roda, montagem do novo com válvula nova e calibragem na pressão do manual. A medida vem da consulta pela placa ou da etiqueta da porta — nunca de chute.",
    when: [
      "Sulco abaixo de 1,6 mm (o indicador TWI do pneu aparece rente à banda).",
      "Bolha, corte ou rachadura no flanco.",
      "Pneu com mais de 5 anos de fabricação, mesmo com sulco.",
    ],
    price: { from: 189.9, note: "Pneu aro 13 instalado, à vista, na troca do usado." },
    duration: "Cerca de 1 hora para quatro pneus, com balanceamento.",
    related: ["balanceamento", "alinhamento"],
  },
  {
    slug: "freios",
    name: "Freios",
    short: "Troca de pastilhas e revisão de discos, fluido e sensores.",
    what: "Medimos espessura de pastilhas e discos e mostramos a medida para você. Pastilha só é trocada abaixo do limite do fabricante.",
    when: [
      "Chiado metálico ao frear.",
      "Pedal mais baixo ou mais mole que o normal.",
      "Luz de freio acesa no painel.",
      "A cada 10 mil km, para inspeção.",
    ],
    price: { from: 69.9, note: "Jogo de pastilhas dianteiras instalado, carros nacionais." },
    duration: "Cerca de 1 hora.",
    related: ["suspensao"],
  },
  {
    slug: "suspensao",
    name: "Suspensão e amortecedores",
    short: "Diagnóstico de folgas e troca de amortecedores, buchas e batentes.",
    what: "Inspeção com o carro no elevador, filmando a folga quando houver. Amortecedor é trocado sempre em par no mesmo eixo.",
    when: [
      "Carro balança demais depois de lombada.",
      "Barulho seco em buraco.",
      "Óleo escorrendo no corpo do amortecedor.",
      'Pneu com desgaste em ondas ("escamado").',
    ],
    price: { from: 199.9, note: "Par de amortecedores instalado, conforme modelo." },
    duration: "De 2 a 3 horas.",
    related: ["alinhamento", "freios"],
  },
  {
    slug: "troca-de-oleo",
    name: "Troca de óleo",
    short: "Óleo na especificação do manual, com o nível e o próximo prazo anotados.",
    what: "Drenagem completa, óleo com a viscosidade e a norma que o manual pede, e etiqueta com a quilometragem da próxima troca. A embalagem é aberta na sua frente.",
    when: ["No prazo do manual — em geral entre 5 e 10 mil km ou 12 meses.", "Luz de óleo acesa."],
    price: { from: 149.9, note: "Carros nacionais 1.0, sem filtro." },
    duration: "Cerca de 30 minutos.",
  },
  {
    slug: "bateria",
    name: "Bateria",
    short: "Teste de carga e troca com a amperagem certa para o seu carro.",
    what: "Teste da bateria e do alternador com equipamento — o resultado sai impresso. Se a bateria está boa, ela fica.",
    when: [
      "Partida fraca, principalmente de manhã.",
      "Bateria com mais de 2 anos e sinais de fraqueza.",
      "Luz de bateria no painel.",
    ],
    price: { from: null, note: "Sob orçamento — depende da amperagem." },
    duration: "Cerca de 20 minutos.",
  },
  {
    slug: "injecao-eletronica",
    name: "Injeção eletrônica",
    short: "Leitura do scanner, limpeza de bicos e correção de falhas de motor.",
    what: "Ligamos o scanner, mostramos os códigos de falha na tela e explicamos cada um antes de qualquer reparo.",
    when: [
      "Luz da injeção acesa.",
      "Marcha lenta irregular ou motor falhando.",
      "Consumo de combustível acima do normal.",
    ],
    price: { from: null, note: "Diagnóstico sob orçamento." },
    duration: "Diagnóstico em cerca de 40 minutos.",
  },
  {
    slug: "revisao",
    name: "Revisão completa",
    short: "Checklist de itens de segurança com laudo e foto do que precisa de atenção.",
    what: "Inspeção de freios, suspensão, pneus, fluidos, correias, luzes e bateria. Você recebe o laudo item por item: ok, atenção ou trocar — e só o que você aprovar é feito.",
    when: ["Antes de viagem.", "Na compra de um carro usado.", "No prazo de revisão do manual."],
    price: { from: null, note: "Sob orçamento — por modelo." },
    duration: "De 1 a 2 horas para o laudo.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
