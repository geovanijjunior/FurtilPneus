# Consulta de placa — proposta de integração (fase 4)

Levantamento feito em 21/10/2026, com base em fontes públicas. Os preços **precisam ser confirmados** com cada fornecedor antes de fechar contrato.

## O ponto mais importante

**Nenhuma API de placa devolve a medida do pneu.** As APIs devolvem marca, modelo, versão, ano e código FIPE. A medida sai de um segundo passo:

```
placa ──► API veicular ──► código FIPE + versão ──► base OEM (nossa) ──► medida(s) de fábrica
                                                     └─ não mapeado ──► consulta assistida (WhatsApp)
```

Por isso o código FIPE é o critério nº 1 na escolha do fornecedor. Ele identifica a versão exata (Onix LT 1.0 2021, por exemplo), e é por ele que a base OEM é indexada. Sem FIPE, o site teria que adivinhar a versão pelo nome, e é aí que nascem os chutes de medida.

## Fornecedores encontrados

| Fornecedor | Retorna | Preço público | Observações |
|---|---|---|---|
| **APIBrasil** (Placa FIPE) | marca, modelo, ano, **código FIPE**, valor e histórico | R$ 0,10/consulta, segundo o blog do próprio fornecedor; recarga mínima de R$ 50 | Mais barato encontrado; tem cota diária grátis para testes. Confirmar o preço no catálogo oficial. |
| **consultadeplaca.net** (dados básicos) | marca, modelo, **versão**, anos, cor, combustível, município/UF, **FIPE** | pré-pago; tabela da API não localizada | Termos de uso da API atualizados em 11/10/2026. Também devolve situação de roubo/furto, que **descartamos**. |
| **WebXcar** (`/placas/{placa}/basica`) | dados básicos + **código FIPE** e preço | não publicado | Exemplo de resposta com referência de março de 2026. |
| **Consultarplaca** | preço FIPE por placa e variação de 12 meses | não publicado | Documentação de 2025. |
| **PlacaAPI.com** | dados do veículo | R$ 0,80/consulta | 8× mais caro que a APIBrasil. |
| **Brasil Dados** (Apify) | dados RENAVAM, restrições | US$ 1,20/consulta | Caro, e traz dados que não queremos receber. |
| Direct Data e similares | veículo **+ dados do proprietário** | — | **Evitar**: tráfego de dado pessoal sem necessidade (LGPD, minimização). |
| SINESP Cidadão (não oficial) | — | — | **Não usar**: não é API pública e o uso automatizado viola os termos. |

O site da FIPE informa que a fundação não oferece API. Os serviços "API FIPE" consultam a tabela por código e não fazem a consulta por placa.

## Recomendação

1. **Piloto com dois fornecedores**, APIBrasil e consultadeplaca.net, por 2 semanas, com as mesmas 200 placas reais da base de clientes (com consentimento). Medir:
   - taxa de acerto da versão;
   - presença do código FIPE;
   - latência no p95;
   - custo real.
2. **Escolher pela taxa de "medida identificada sem humano"**, não pelo preço. A diferença de centavos por consulta some diante de um pneu instalado errado.
3. **Base OEM indexada por código FIPE.** Comece pelos cerca de 200 modelos mais vendidos; é trabalho de planilha. Para acelerar, avaliar a **Wheel-Size API**, que tem medidas por versão, mas a cobertura do mercado brasileiro precisa ser testada (o mercado latino-americano aparece como "LADM").

### Custo estimado

Com o cache de 30 dias por placa, consulta repetida não paga de novo.

| Consultas novas/mês | APIBrasil (R$ 0,10) | PlacaAPI (R$ 0,80) |
|---|---|---|
| 1.000 | R$ 100 | R$ 800 |
| 3.000 | R$ 300 | R$ 2.400 |
| 10.000 | R$ 1.000 | R$ 8.000 |

## Arquitetura (já prevista no código)

- **Route handler server-side** `app/api/placa/route.ts`. Lê `VEHICLE_API_KEY` só no servidor (`import "server-only"`). Nenhum client component importa o módulo.
- **Allowlist na resposta:** o backend monta um objeto novo só com `marca`, `modelo`, `versao`, `ano` e `fipe`. Todo o resto (proprietário, município, situação, roubo/furto) é descartado antes de qualquer log.
- **Cache de 30 dias por placa**, guardando só o resultado filtrado, com a placa como hash.
- **Timeout de 5 s.** Estourou, a tela cai automaticamente na busca por modelo.
- **Rate limit** por IP e por sessão. Sugestão: 5 consultas/min e 20/dia por IP.
- **Consentimento LGPD antes da consulta:**
  - texto curto ao lado do campo da placa;
  - checkbox desmarcado;
  - registro do aceite com data, versão do texto e hash da placa.
- **Nunca chutar:** se a versão vier vazia, ou se o FIPE não estiver na base OEM, o site diz isso e oferece a consulta assistida. O fluxo atual já se comporta assim com o mock (`lib/lookup.ts`).

## Próximo passo

Você escolhe o fornecedor (ou autoriza o piloto com os dois) e cria a conta. Com a chave em `.env.local`, a troca do mock pela API real é a fase 4 do roteiro: route handler, filtro, cache, rate limit e consentimento.

## Fontes

- APIBrasil — tutorial Placa FIPE: https://apibrasil.blog/consulta-placa-fipe-api-node-js/
- APIBrasil — catálogo: https://www.apigratis.com.br/
- consultadeplaca.net — termos da API: https://consultadeplaca.net/desenvolvedores/termos
- consultadeplaca.net — produtos: https://consultadeplaca.net/produtos
- WebXcar — consulta por placa: https://webxcar.com.br/servico/consulta-por-placa
- Consultarplaca — docs: https://docs.consultarplaca.com.br/consultas/consulta-fipe-por-placa
- PlacaAPI: https://www.placaapi.com/
- Brasil Dados: https://brasildados.org/consulta-veiculo-por-placa/
- Direct Data: https://www.directd.com.br/central-de-ajuda/posts/consulta-veicular
- FIPE (sem API): https://veiculos.fipe.org.br/
- Wheel-Size API: https://developer.wheel-size.com/api-data
