# Furtil Pneus — plano de design

## O problema que o design resolve

A Furtil vende pneu barato com garantia longa, mas o que trava a venda é a **confiança**. O Reclame Aqui marca a empresa como "Não recomendada" e as queixas se repetem: troca de peça sem necessidade e serviço mal feito. O site atual promete "honestidade", "transparência" e "referência no mercado", e mostra depoimentos que ninguém consegue conferir.

Por isso o novo site não promete honestidade. Ele mostra o processo. Três decisões vêm daí:

1. **A placa é a porta de entrada.** O cliente não precisa saber a medida do pneu, e o site não chuta a medida por ele.
2. **O laudo é a peça de credibilidade.** No lugar de adjetivos, aparece uma amostra de laudo com item, valor medido, limite do fabricante e decisão.
3. **Preço à vista é o número grande.** O parcelamento vem menor e a condição de troca fica escrita ao lado do preço, nunca num asterisco.

## Tokens de cor

O site atual usa preto e o amarelo `#FFCC00`, que é o "LOGO-FURTIL-amarela" e a cor global do Elementor. A família cromática foi mantida. Só foram ajustados os neutros e criadas variantes legíveis.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `ink` | `#0E0E0E` | fundo escuro, texto principal | 17,4:1 sobre `paper` |
| `ink-2` / `ink-3` | `#1C1C1B` / `#2C2C2A` | superfícies e realces sobre ink | — |
| `paper` | `#F5F3EE` | fundo claro, "papel de laudo" (o tom quente evita o branco de template) | — |
| `paper-2` | `#E9E6DE` | faixas e chips sobre paper | — |
| `line` / `line-dark` | `#CFCAC0` / `#40403C` | divisórias decorativas | — |
| `muted` | `#54534E` | texto secundário sobre claro | 6,9:1 (paper) · 6,2:1 (paper-2) |
| `muted-dark` | `#B0ADA4` | texto secundário sobre escuro | 8,6:1 (ink) · 7,6:1 (ink-2) |
| `signal` | `#FFCC00` | amarelo Furtil: preenchimento, texto **só sobre escuro** | 12,8:1 sobre ink |
| `signal-deep` | `#7A5C00` | eyebrows amarelos sobre claro (o `#FFCC00` sobre paper dá 1,4:1) | 5,6:1 |
| `mercosul` | `#003399` | faixa da placa | branco 10,9:1 |
| `ok` / `danger` | `#166534` / `#B01E1E` | estados | 5,7:1 / 6,2:1 |
| `whats` | `#0F7A42` | botão WhatsApp, escurecido em relação ao verde oficial | branco 5,4:1 |

O `tailwind.config.ts` **substitui** a paleta inteira. Nenhuma cor default do Tailwind existe no projeto.

## Tipografia

| Papel | Família | Por quê |
|---|---|---|
| Display | **Archivo**, eixo `wdth` em 75 (62 na placa), peso 800, caixa alta, tracking −0,01em | Grotesca condensada de origem industrial. Com o eixo de largura ela vira a "letra de placa" (a Mercosul usa FE-Schrift, condensada e pesada) sem carregar uma segunda fonte. |
| Texto | **IBM Plex Sans** 400–700 | Desenhada para documentação técnica e com leitura de manual. Combina com a ideia de laudo melhor que uma Inter genérica. |
| Utilitária | **IBM Plex Mono** 400–600 | Medidas de pneu (`205/55 R16 91V`), números de OS e eyebrows. Os dígitos tabulares alinham as medidas. |

Escala, em mobile e desktop:

- display hero: 2,5 → 5,6rem (`clamp`), entrelinha 0,92
- display de seção: 2,3 → 3,8rem
- medida em destaque: 2,25–3rem mono 600
- preço: 2,1–2,25rem display 800
- corpo: 1rem/1,5 · lead: 1,125rem
- eyebrow: 0,72rem mono, maiúsculas, tracking 0,14em

Todas as fontes vêm por `next/font`, com subset latino, `display: swap` e self-hosted.

## Layout

O site alterna faixas de **asfalto** (ink) e **papel** (paper). O asfalto é onde o cliente age: placa, CTA e header. O papel é onde o cliente confere: laudo, preços, horários. O amarelo aparece pouco, como faixa de sinalização, só no que é acionável ou em dados-chave.

```
HOME MOBILE (380px)              HOME DESKTOP (1366px)
┌──────────────────────┐        ┌──────────────────────────────────────────────┐
│▓ protótipo           ▓│       │▓ FURTIL PNEUS  Pneus Serviços Lojas   ◉Loja [Agendar]│
│ FURTIL PNEUS     ☰   │        ├──────────────────────┬───────────────────────┤
├──────────────────────┤        │ O PNEU CERTO         │ ▬ ▬ ─ ─  etapas        │
│ O PNEU CERTO         │        │ PELA PLACA.          │ ┌─BRASIL──────────┐    │
│ PELA PLACA. O PREÇO  │        │ O PREÇO CERTO        │ │   ABC1D23        │    │
│ CERTO NA ETIQUETA.   │        │ NA ETIQUETA.         │ └─────────────────┘    │
│ ┌ ▬ ▬ ─ ─ ────────┐  │        │                      │ [Achar meu pneu →]     │
│ │┌─BRASIL──────┐  │  │        ├──────┬───────┬───────┼───────────────────────┤
│ ││  ABC1D23    │  │  │        │5 ANOS│12 MESES│ 10X  │ DIAGNÓSTICO            │
│ │└─────────────┘  │  │        ├──────┴───────┴───────┴───────────────────────┤
│ │[Achar meu pneu] │  │        │ VOCÊ VÊ O DEFEITO       ┌ LAUDO OS 004812 ┐   │
│ └─────────────────┘  │        │ 01 nada sem autorização │ item  medido dec│   │
│ 5 ANOS   │ 12 MESES  │        │ 02 prova em foto        │ pneu  2,1mm ATEN│   │
│ 10X      │ DIAGNÓST. │        │ 03 peça velha é sua     └─────────────────┘   │
├──────────────────────┤        ├──────────────────────────────────────────────┤
│ VOCÊ VÊ O DEFEITO…   │        │ PREÇO POR ARO   [13][14][15][16]              │
│ 01 02 03 04          │        │ SERVIÇOS  grade 3×3 com custa/demora          │
│ [laudo]              │        │ LOJAS     3 cards                             │
│ ARO 13 R$189,90 …    │        │ ▓▓ AGENDE ▓▓                                  │
└──────────────────────┘        └──────────────────────────────────────────────┘

RESULTADO DA BUSCA (mobile)
┌──────────────────────┐
│ FURTIL  [BRA2E19] ☰  │  ← a placa virou chip no header
├──────────────────────┤
│ ▬ ▬ ▬ ▬              │
│ MEDIDA DE FÁBRICA    │
│ 195/55 R16           │
│ para Chevrolet Onix  │
│ ┌──────────────────┐ │
│ │WESTLAKE Z-107    │ │
│ │à vista, por pneu │ │
│ │R$ 269,90         │ │  ← maior número do card
│ │ou 10x de R$26,99 │ │
│ │▒ Na troca do usado. Sem troca: R$294,90 ▒│
│ │[Agendar instalação]│
│ └──────────────────┘ │
│ [Ver todas em 195/55 R16] │
└──────────────────────┘
```

## Elemento-assinatura: a placa Mercosul

- **Construção** (`components/MercosulPlate.tsx`): é tudo CSS, sem imagem. Moldura branca com borda de 3px em ink, raio de 0,6rem e sombra dura de 2px que imita o relevo da chapa. Faixa superior em `mercosul` com "MERCOSUL", "BRASIL" e uma bandeira em SVG inline de 3 formas. O campo de digitação é o próprio `<input>`, em Archivo `wdth 62`, 800, tracking 0,12em.
- **Máscara** (`lib/plate.ts`): é posicional. Três letras, um dígito, letra ou dígito, dois dígitos. Aceita a placa antiga (exibida como `ABC-1234`) e a Mercosul. O que não cabe na posição é descartado enquanto o usuário digita.
- **Transição para chip:** placa da home e chip do header têm o mesmo `view-transition-name: plate`. Ao confirmar a medida, a troca de estado roda dentro de `document.startViewTransition`, e a placa encolhe e voa até o header. Com `prefers-reduced-motion`, ou num navegador sem suporte, a troca é instantânea.
- **Em 380px:** a placa ocupa a largura do card (cerca de 310px) e o texto usa `clamp(2.6rem, 13vw, 4.4rem)`, o que deixa os 7 caracteres sempre numa linha. No header, a placa vira um chip de cerca de 72×24px, e a medida só aparece ao lado a partir de 640px.

## Fluxo da placa (mock)

Passos: 1 placa → 2 consulta (800ms, cancelável) → 3 confirmar veículo → 4 medida (desambiguação obrigatória quando há mais de uma) → 5 fallbacks → 6 ofertas → 7 agendar ou WhatsApp.

Os fallbacks ficam em três abas acessíveis por setas: **pelo modelo** (marca → modelo → versão → ano), **pela medida** (largura/perfil/aro) e **falar com a loja** (WhatsApp com a placa pré-preenchida). Toda tela tem uma saída.

### Placas de teste

| Placa | Resultado |
|---|---|
| `ABC1D23` | Fiat Mobi Like 1.0, **medida única** (175/65 R14), vai direto às ofertas |
| `BRA2E19` | Chevrolet Onix LT 1.0, **ambígua** (185/65 R15 ou 195/55 R16) |
| `FUR7T11` | Toyota Corolla XEi 2.0, **ambígua** (205/55 R16 ou 225/45 R17) |
| `GOL1234` | VW Gol 1.0 (placa **antiga**), ambígua |
| `QWE4R56` | Nissan Kicks SV 1.6, única |
| qualquer outra válida (ex.: `XYZ9Z99`) | **não encontrada**, abre os fallbacks |

O seed tem 15 veículos, 5 deles com duas medidas de fábrica, e 23 pneus. Os códigos FIPE, as placas e os preços por marca são fictícios.

## Autocrítica: o que seria igual para "qualquer oficina"

| Item genérico (descartado) | Substituído por | Por que só serve para a Furtil |
|---|---|---|
| Hero com foto de mecânico sorrindo + "Qualidade e confiança" | Hero com a placa como campo de busca | O produto principal é pneu, e a dúvida nº 1 é "qual medida". |
| Ícones de "Transparência / Honestidade / Capacitação" (o site atual) | Amostra de laudo com medida, limite e decisão | Responde às reclamações reais de troca desnecessária com uma prova, não com um adjetivo. |
| Carrossel de depoimentos | Avaliações reais do Google Places por loja, ocultas com menos de 5 | O site atual mostra depoimentos que não dá para verificar. Para uma marca com problema de reputação, um depoimento fictício é um risco, não um ativo. |
| Paleta azul "confiança automotiva" | Preto + amarelo Furtil + azul só na placa | Mantém o reconhecimento da marca nas fachadas e nos anúncios que já existem. |
| Card de preço com parcela gigante e "*consulte condições" | À vista em destaque, parcela menor e troca escrita ao lado | O site atual escondia a "base de troca" num asterisco. |
| "Profissionais capacitados", "referência no mercado" | Quatro respostas por serviço: o que é, quando, quanto, quanto tempo | Dá para conferir na loja. |
| Fonte sans neutra (Inter/Montserrat) | Archivo condensada + Plex | A condensada vem da placa; a Plex vem do laudo técnico. |

O que continua genérico, assumido: o grid de 12 colunas, o botão flutuante de WhatsApp (o público espera por ele) e o rodapé em quatro colunas.

## Pendências (TODO: confirmar com o cliente)

- `config/lojas.ts`: endereço completo de Vila Formosa, CEP de Tremembé, coordenadas, horários e telefone por loja.
- `config/site.ts`: qual CNPJ responde por qual loja, se os compromissos são cumpridos na operação e se as garantias continuam valendo.
- `config/servicos.ts`: preços e tempos médios.
- Logo oficial em SVG (por enquanto há uma marca tipográfica provisória).
- `googlePlaceId` de cada loja, para ativar as avaliações reais.
