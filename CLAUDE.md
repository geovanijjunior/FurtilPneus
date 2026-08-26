# Furtil — Prompts por fase para Claude Code

Cada bloco `>` abaixo é para colar direto. Uma fase por sessão. Entre as fases: revise, commite, e só então avance.

Pressuposto: o arquivo `prompt-novo-site-furtil.md` está salvo como `CLAUDE.md` na raiz do projeto (ou como `docs/BRIEF.md` com um `CLAUDE.md` que aponte para ele). Os prompts abaixo referenciam as seções do brief pelo número, então não repita o conteúdo dele nas mensagens.

---

## Fase 0 — Setup (faça você, sem Claude Code)

```bash
mkdir furtil-site && cd furtil-site
git init
# salve o brief como CLAUDE.md
cp ~/Downloads/prompt-novo-site-furtil.md ./CLAUDE.md
# baixe os logos para extração local da paleta
mkdir -p assets/brand
curl -o assets/brand/logo-nacional.png "https://tremembe.furtilcentroautomotivo.com.br/wp-content/uploads/2023/12/LOGO-FURTIL-PNEUS-NACIONAL-1024x256.png"
curl -o assets/brand/logo-branca.jpg "https://tremembe.furtilcentroautomotivo.com.br/wp-content/uploads/2023/12/LOGO-BRANCA-01.jpg"
git add -A && git commit -m "brief e assets de marca"
git checkout -b fase-1-scaffold
```

---

## Fase 1 — Scaffold

**Objetivo:** esqueleto navegável, sem design e sem lógica. Rápido e chato de propósito.

> Leia o `CLAUDE.md` inteiro antes de começar. Nesta sessão você vai fazer **só o scaffold** — não escreva design, não escolha cores, não implemente lógica de negócio.
>
> Crie um projeto Next.js com App Router e TypeScript, Tailwind CSS, e ESLint + Prettier configurados.
>
> Monte a estrutura de rotas exatamente como está na seção 5 do brief, com cada página contendo apenas um `<h1>` provisório identificando a rota. Rotas dinâmicas (`/pneus/[medida]`, `/servicos/[servico]`, `/lojas/[loja]`) devem funcionar com params, ainda sem dados.
>
> Crie `app/globals.css` declarando **todos** os design tokens da seção 3.1 como CSS custom properties, todos com valor `#FF00FF` como placeholder deliberado — assim qualquer cor não definida grita na tela. Configure o `tailwind.config.ts` para consumir esses tokens, e nada além deles: nenhuma cor da paleta default do Tailwind disponível para uso.
>
> Crie `.env.local.example` com as chaves que o projeto vai precisar (API veicular, Google Places, banco), sem valores. Garanta que `.env.local` está no `.gitignore`.
>
> Adicione um script `npm run check:links` que varre o build em busca de hrefs quebrados e falha se encontrar algum. Ele vai rodar em toda fase daqui pra frente.
>
> Ao terminar, rode o build e me mostre a árvore de arquivos. Não commite.

**Revise antes de avançar:** build passa, todas as rotas abrem, nenhuma cor do Tailwind default acessível.

---

## Fase 2 — Paleta e plano de design ⚠️

**Objetivo:** a decisão mais importante do projeto. Aqui você para e lê com atenção.

> Nesta sessão você **não vai escrever código de componente**. O entregável é um plano de design que eu preciso aprovar.
>
> **Passo 1 — Paleta.** Abra as imagens em `assets/brand/` e extraia os valores hex reais das cores da marca. Me diga quais cores encontrou e em que proporção aparecem. Depois mapeie-as para os papéis de token da seção 3.1 do brief. Você pode ajustar luminosidade e saturação para atingir contraste WCAG AA, e pode adicionar neutros — mas não pode trocar a família cromática. Para cada token, informe o hex final e o rácio de contraste contra o fundo em que será usado.
>
> **Passo 2 — Plano.** Escreva em `docs/DESIGN.md`:
> - os tokens de cor finais, com justificativa de cada ajuste
> - o pareamento tipográfico (display, texto, utilitária) com nomes reais de fontes, escala completa com tamanhos, pesos e tracking, e por que essas famílias e não outras
> - o conceito de layout, em prosa curta + wireframes em ASCII para: home mobile, home desktop, e a tela de resultado da busca por placa
> - o detalhamento do elemento-assinatura (seção 3.3): como a placa Mercosul é construída em CSS/SVG, como ela se comporta na transição para chip do header, e como fica em 380px de largura
>
> **Passo 3 — Autocrítica, e leve isto a sério.** Reveja o plano e responda: se eu tivesse pedido "um site para uma oficina mecânica" sem nenhum contexto da Furtil, quanto desse plano seria idêntico? Marque explicitamente cada parte que cairia nessa categoria e substitua por uma escolha que só faz sentido para *este* cliente — uma rede de pneus na zona norte de São Paulo cujo problema real é falta de credibilidade. Descreva o que mudou e por quê.
>
> Me apresente o plano. Não implemente nada até eu aprovar.

**Revise com cuidado:** o plano parece genérico? A tipografia é escolha ou default? A autocrítica foi honesta ou performática? Se a fase 2 sair morna, todo o resto herda. Vale iterar aqui duas ou três vezes.

---

## Fase 3 — Fluxo da placa com dados mockados

**Objetivo:** o núcleo do produto funcionando ponta a ponta, sem depender de API externa.

> Aprovado o plano em `docs/DESIGN.md`. Aplique os tokens reais em `globals.css` (substituindo os placeholders magenta) e implemente o fluxo de busca por placa da seção 4.1 do brief, **inteiramente com dados mockados**.
>
> Crie `data/seed.json` com **15 veículos** representativos da frota brasileira popular — inclua obrigatoriamente ao menos 3 casos onde a mesma versão tem duas medidas de fábrica diferentes, porque a desambiguação é a parte que mais importa testar. Estrutura conforme o schema da seção 4.2. Crie também uns 20 produtos de pneu cobrindo essas medidas.
>
> Implemente uma função `lookupPlate(plate)` que resolve contra o seed com delay artificial de 800ms, e que retorna resultados diferentes conforme a placa: uma placa que encontra veículo com medida única, uma que encontra com medida ambígua, e uma que não encontra nada. Documente essas placas de teste em `docs/DESIGN.md`.
>
> Construa todos os sete passos da seção 4.1, incluindo:
> - o input em formato de placa Mercosul, com máscara aceitando os dois formatos brasileiros
> - a desambiguação de medida quando houver mais de uma
> - o overlay educativo de leitura do flanco do pneu
> - **os três fallbacks do passo 5** — busca manual encadeada, busca por medida, e consulta assistida. Nenhum estado pode ser um beco sem saída.
> - a transição da placa para chip do header, conforme o plano
>
> Requisitos que valem tanto quanto a funcionalidade: operável 100% por teclado, foco visível, erros anunciados via `aria-live`, `prefers-reduced-motion` respeitado, e alvos de toque de no mínimo 44px. Teste em viewport de 380px.
>
> Quando terminar, rode `npm run check:links`, me mostre o fluxo funcionando e critique seu próprio resultado em mobile.

**Revise:** percorra os três caminhos de placa. Tente quebrar com placa inválida, com Enter no meio do fluxo, só com teclado. Se ele chutou alguma medida em vez de perguntar, corrija agora — esse é o erro mais caro do projeto.

---

## Fase 4 — API veicular real

**Objetivo:** trocar o mock por integração de verdade, com toda a proteção legal.

> Agora vamos substituir o mock por uma consulta veicular real.
>
> **Antes de escolher qualquer provedor, pesquise.** Meu brief menciona alguns nomes, mas eles podem estar desatualizados. Levante os provedores brasileiros de consulta de placa disponíveis hoje e compare: custo por consulta, cobertura, latência, se retornam **versão e código FIPE** (sem isso o mapeamento de medida fica impreciso demais), termos de uso, e se permitem uso comercial em site público. Me apresente a comparação e sua recomendação antes de integrar.
>
> Depois de eu escolher, implemente:
> - route handler server-side para a consulta. A chave de API fica em `.env.local` e **nunca** chega ao cliente — nenhum client component pode importá-la, direta ou indiretamente.
> - **filtro de resposta obrigatório:** o backend descarta tudo que não seja marca, modelo, ano e versão. Dados do proprietário (nome, CPF, situação do documento, restrições) nunca trafegam ao front-end e nunca entram em log. Implemente isso como allowlist explícita, não como blocklist.
> - cache de 30 dias por placa
> - timeout de 5s com fallback automático para a busca manual
> - rate limit por IP e por sessão
> - consentimento LGPD conforme a seção 4.3: texto claro sobre a finalidade, registro auditável do consentimento, e a consulta só dispara depois do aceite
>
> Mantenha o seed como fallback: se a API não retornar a versão, ou se a versão não estiver mapeada na base OEM, o sistema diz isso honestamente e oferece a consulta assistida. **Nunca chute uma medida.**
>
> Ao final, me mostre onde no código a chave é lida e prove que ela não vaza para o bundle do cliente.

**Revise:** rode `npm run build` e faça grep da chave nos arquivos de `.next/static`. Se aparecer, está errado.

---

## Fase 5 — Catálogo, lojas e SEO

**Objetivo:** o resto do site, com a conformidade da seção 8 aplicada.

> Implemente as páginas restantes da seção 5 do brief, seguindo o plano de `docs/DESIGN.md`.
>
> **Catálogo (`/pneus` e `/pneus/[medida]`):** grade filtrável por medida, marca, preço e loja. Cada card segue a seção 8 do brief: **preço à vista em destaque tipográfico primário, parcelamento em tamanho secundário**, e a condição de troca — quando aplicável — visível no próprio card, junto ao preço, nunca em asterisco de rodapé. Estado vazio tratado com saída acionável.
>
> **Páginas de loja (`/lojas/[loja]`):** endereço completo com número, mapa, horários por dia da semana, telefone. Detecção da loja mais próxima por geolocalização, com troca manual sempre disponível e a loja ativa visível no header. Deixe os dados de endereço e horário num arquivo de config separado, marcado com `TODO: confirmar com o cliente` — eu ainda vou validar os números das ruas.
>
> **Reviews:** integre a Google Places API para puxar avaliações reais por loja, com nome, nota, data e link para a review original. Se uma loja tiver menos de 5 reviews, **não renderize a seção** para aquela loja. Nenhum depoimento fictício, em hipótese alguma.
>
> **Serviços:** uma página por serviço, cada uma respondendo quatro perguntas concretas — o que é, quando fazer, quanto custa, quanto demora. Sem superlativo, sem "profissionais capacitados", sem "referência no mercado".
>
> **SEO:** schema `AutoRepair` + `LocalBusiness` por loja com endereço, geo, horários e telefone; schema `Product` + `Offer` nos pneus com preço real; `aggregateRating` apenas se houver reviews reais. Meta descriptions únicas por página. Sitemap e robots gerados no build.
>
> **Rodapé:** razão social, CNPJ, endereço completo, telefone e e-mail — também em arquivo de config com `TODO: confirmar`, porque há duas pessoas jurídicas diferentes envolvidas e eu preciso checar qual responde por qual loja.
>
> Rode `npm run check:links` ao final.

**Revise:** valide os schemas no Rich Results Test do Google. Confira se algum preço ficou com a parcela em destaque.

---

## Fase 6 — Analytics, acessibilidade e performance

**Objetivo:** o polimento que decide se o investimento em anúncio se paga.

> Última fase. Três frentes.
>
> **Analytics (seção 9):** GA4 com o funil por etapa — `placa_consultada`, `veiculo_confirmado`, `medida_identificada`, `produto_visualizado`, `agendamento_iniciado`, e a conversão final em `agendamento_concluido` ou `whatsapp_aberto`. Consent Mode v2. Banner de cookies com recusa efetiva, não decorativa. Preserve os UTMs da origem até a mensagem pré-preenchida do WhatsApp, para atribuição correta no Google Ads.
>
> Adicione uma métrica de saúde do produto: percentual de consultas de placa que chegam a uma medida sem intervenção humana. É o indicador que diz se a base OEM está cobrindo a frota real dos clientes.
>
> **Acessibilidade:** auditoria WCAG 2.1 AA no site inteiro. Verifique contraste de todos os tokens nos contextos reais de uso, navegação completa por teclado, foco visível, hierarquia de headings, labels de formulário, e `aria-live` nos estados de erro e carregamento. Corrija o que encontrar e me liste o que corrigiu.
>
> **Performance:** LCP abaixo de 2,5s em 4G simulado, CLS abaixo de 0,1, INP abaixo de 200ms, Lighthouse 90+ nas quatro categorias. Imagens em AVIF/WebP com dimensões explícitas, fontes com subset latino e `font-display: swap`. Me mostre os números antes e depois.
>
> Por fim, percorra o checklist da seção 11 do brief item por item e me diga o estado real de cada um — inclusive os que não foram atendidos. Não marque nada como feito por otimismo.

---

## Depois das seis fases

Fica pendente, e não é trabalho de Claude Code:

- **Painel administrativo** ou CMS para a equipe editar preço e estoque. Decida primeiro se a equipe tem perfil para operar — se não tiver, um CMS headless resolve melhor que admin custom.
- **Popular a base OEM** dos 200 veículos. É trabalho de planilha, não de sessão de código. Monte o CSV separado e importe.
- **Confirmar com o cliente** os sete pontos da seção 12 do brief. O dos CNPJs é o mais urgente.
- **Política de Privacidade** reescrita cobrindo a ferramenta de placa. Vale revisão de advogado, dado o histórico de reclamações da empresa.
