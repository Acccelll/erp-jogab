# 14 — Integração FOPAG e Financeiro (Fase 8)

> Documento atualizado na Fase 8 — Integração da cadeia de Custos de Pessoal.

## Visão geral

A Fase 8 completou a integração dos módulos de **FOPAG (Folha de Pagamento)** e **Financeiro**, conectando a cadeia crítica:

**Horas Extras fechadas → FOPAG → Financeiro**

Todos os endpoints críticos foram integrados com `withApiFallback`, garantindo fallback controlado para mock quando a API real estiver indisponível.

---

## Endpoints integrados

### FOPAG
| Endpoint | Método | Status |
|----------|--------|--------|
| `/fopag/competencias` | GET | ✅ Integrado com fallback |
| `/fopag/competencias/:id` | GET | ✅ Integrado com fallback |

**Normalizador:** `normalizeFopagCompetenciasResponse` — garante estrutura completa mesmo com payload parcial.

### Financeiro
| Endpoint | Método | Status |
|----------|--------|--------|
| `/financeiro/dashboard` | GET | ✅ Integrado com fallback |
| `/financeiro/pessoal` | GET | ✅ Integrado com fallback (alimentado por FOPAG) |
| `/financeiro/fluxo-caixa` | GET | ✅ Integrado com fallback |
| `/financeiro/contas-pagar` | GET | ✅ Integrado com fallback |
| `/financeiro/contas-receber` | GET | ✅ Integrado com fallback |
| `/financeiro/titulos/:id` | GET | ✅ Integrado com fallback |

**Normalizador:** `normalizeFinanceiroDashboardData` — normaliza payload parcial, incluindo campo `pessoal` ligado a FOPAG.

---

## Cadeia HE → FOPAG → Financeiro

### Como funciona
1. **Horas Extras (fechadas)**: HE com status `fechada_para_fopag`, `enviada_para_fopag` ou `paga` são elegíveis para FOPAG.
2. **FOPAG**: A função `buildFopagCompetenciaSnapshot(competencia)` consolida HE elegíveis por funcionário e obra, gerando o snapshot da competência com `valorHorasExtrasIntegradas`.
3. **Financeiro**: A função `buildWorkforceFinancialSummary(competencia)` combina o snapshot FOPAG com HE integradas para gerar `valorFopagPrevisto`, `valorFopagRealizado`, `valorHorasExtrasPrevisto` e `valorHorasExtrasRealizado`.

### Contratos estáveis
- `FopagCompetenciaListItem.valorHorasExtras` — total de HE integradas na competência
- `FopagFinanceiroResumo.valorHorasExtrasIntegradas` — valor total de HE incluídas no cálculo
- `FinanceiroPessoalCompetenciaResumo.valorFopagPrevisto/Realizado` — refletem a FOPAG consolidada
- `FinanceiroPessoalCompetenciaResumo.valorHorasExtrasPrevisto/Realizado` — HE integradas na visão Financeiro

### Dependências pendentes para Fase 9
- Integração real de `/financeiro/contas-pagar` e `/financeiro/contas-receber` com títulos gerados por FOPAG (atualmente mocados)
- Validação end-to-end com API real rodando

---

## Testes automatizados

### FOPAG service (`fopag.service.test.ts`) — 17 testes
- Sucesso da chamada API
- Passagem de filtros como query params
- Fallback em HTTP 503, 502
- Fallback em timeout (ECONNABORTED)
- Fallback em erro de rede (ERR_NETWORK)
- Normalização de payload parcial sem kpis
- Coerência: `valorHorasExtras` alimentado por HE fechadas
- KPIs corretos no fallback
- Detalhe: sucesso, fallback 503, timeout, ID desconhecido, array de funcionários, `valorHorasExtrasIntegradas`
- Normalizador: null, undefined, data não-array, dados válidos, kpis parciais

### Financeiro service (`financeiro.service.test.ts`) — 22 testes
- Dashboard: sucesso, fallback 503/504, timeout, campos FOPAG no mock
- Pessoal: sucesso, timeout, coerência com cadeia HE→FOPAG, `valorFopagPrevisto >= 0`
- Fluxo de caixa: sucesso, fallback 503
- Contas a pagar: sucesso, fallback 502
- Contas a receber: sucesso, fallback timeout
- Título por ID: sucesso, fallback com ID válido
- Normalizador: null, undefined, pessoal parcial, kpis parciais, titulos não-array, campos FOPAG

### Cadeia HE → FOPAG → Financeiro (`workforceCost.test.ts`) — 23 testes
- `buildFopagCompetenciaSnapshot`: campos obrigatórios, totalFuncionarios, valorHorasExtras, financeiro, eventos, previstoRealizado, obras, competência fechada, competência desconhecida
- `buildWorkforceFinancialSummary`: campos obrigatórios, competência, `valorPrevisto = FOPAG + HE`, `valorRealizado <= valorPrevisto`, `variacao`, porObra, origemHorasExtras, competência desconhecida
- `getObraLaborCostSnapshot`: campos obrigatórios, `custoTotalPessoal >= fopagPrevista`, `custoHorasExtras >= 0`, competência

### Integration registry (`integration.test.ts`) — 2 novos testes
- FOPAG: `integrationStatus === 'integrated'`, todos os endpoints com `integrated: true`
- Financeiro: `integrationStatus === 'integrated'`, todos os endpoints com `integrated: true`

**Total de testes no projeto: 621 em 49 arquivos (todos passando)**

---

## Compras — preparado para Fase 9

O módulo Compras não foi integrado nesta fase. Estado atual:

| Endpoint | Status | Notas |
|----------|--------|-------|
| `GET /compras/solicitacoes` | ✅ Pronto | Service com mock + withApiFallback preparado |
| `GET /compras/cotacoes` | ✅ Pronto | Service com mock + withApiFallback preparado |
| `GET /compras/pedidos` | ✅ Pronto | Service com mock + withApiFallback preparado |
| `GET /compras/pedidos/:id` | ✅ Pronto | Service com mock + withApiFallback preparado |
| `GET /compras/dashboard` | ✅ Pronto | Service com mock + withApiFallback preparado |

**Compras é o próximo fluxo independente após FOPAG/Financeiro.** O fluxo solicitação → cotação → pedido está documentado e os contratos de tipo/schema estão estáveis. A Fase 9 deve integrar esses endpoints sem refatorações.

---

## Como testar a integração

```env
# Para usar API real
VITE_API_URL=http://localhost:3000/api
VITE_API_FALLBACK=true

# Para usar apenas mock (desenvolvimento)
VITE_API_FALLBACK=true
```

1. **FOPAG**: Navegue para **RH > FOPAG** para ver listagem de competências e detalhe com funcionários, obras e rateio.
2. **Financeiro**: Navegue para **Financeiro > Dashboard** para ver impacto nos custos de pessoal.
3. **Cadeia**: Feche uma competência em Horas Extras e confirme que aparece em FOPAG com `valorHorasExtras > 0`.

---

## Resultado dos comandos de validação

```
npm run build: ✅ 0 erros TypeScript
npm run lint:  ✅ 0 erros
npm run test:  ✅ 621 testes em 49 arquivos
npm audit:     ✅ 0 vulnerabilidades
```
