# 16 — Integração Compras (Fase 9)

> Documento criado na Fase 9 — Integração do módulo Compras como fluxo independente.

## Visão geral

A Fase 9 integrou o módulo **Compras** à API real, completando o fluxo:

**Solicitação → Cotação → Pedido**

Todos os 5 endpoints foram integrados com `withApiFallback`, garantindo fallback controlado para mock quando a API real estiver indisponível. O módulo é independente da cadeia crítica HE → FOPAG → Financeiro, o que o torna o próximo candidato natural após a Fase 8.

---

## Endpoints integrados

### Compras
| Endpoint | Método | Status |
|----------|--------|--------|
| `/compras/solicitacoes` | GET | ✅ Integrado com fallback |
| `/compras/cotacoes` | GET | ✅ Integrado com fallback |
| `/compras/pedidos` | GET | ✅ Integrado com fallback |
| `/compras/pedidos/:id` | GET | ✅ Integrado com fallback |
| `/compras/dashboard` | GET | ✅ Integrado com fallback |

**Normalizador:** `normalizeComprasDashboardData` — garante estrutura completa mesmo com payload parcial. Arrays default `[]`, KPIs default `0`.

---

## Fluxo funcional validado

### Solicitação → Cotação → Pedido

```
SolicitacaoCompra           CotacaoCompra           PedidoCompra
┌─────────────────┐         ┌──────────────┐        ┌──────────────────┐
│ id              │──sol → │ solicitacaoId│──cot → │ solicitacaoId    │
│ titulo          │         │ objeto       │        │ cotacaoId        │
│ status          │         │ status       │        │ fornecedorNome   │
│ valorEstimado   │         │ valorCotado  │        │ valorPedido      │
│ integracaoFiscal│         │ fornecedor   │        │ fiscalStatus     │
│ integracaoFin.  │         │ prazoEntrega │        │ financeiroStatus │
└─────────────────┘         └──────────────┘        └──────────────────┘
```

1. **Solicitação** (`fetchSolicitacoesCompra`) — listagem paginada com filtros de status, categoria, prioridade, competência e busca.
2. **Cotação** (`fetchCotacoesCompra`) — listagem de cotações vinculadas a uma solicitação.
3. **Pedido** (`fetchPedidosCompra` + `fetchPedidoCompraById`) — pedidos emitidos com detalhe completo (itens, timeline, observações).
4. **Dashboard** (`fetchComprasDashboard`) — visão consolidada das 3 etapas com KPIs e resumo de status.

---

## Comportamento de fallback

| Situação | Comportamento |
|----------|---------------|
| HTTP 503 (serviço indisponível) | Fallback para mock |
| HTTP 502 (gateway inválido) | Fallback para mock |
| HTTP 504 (gateway timeout) | Fallback para mock |
| Timeout ECONNABORTED | Fallback para mock |
| ERR_NETWORK (sem conexão) | Fallback para mock |
| HTTP 400 (bad request) | Propaga erro |
| HTTP 422 (validation error) | Propaga erro |
| HTTP 500 com JSON | Propaga erro |

O fallback é controlado por `withApiFallback` em `shared/lib/api.ts` e habilitado por padrão via `VITE_API_FALLBACK=true`.

---

## Testes automatizados

### ComprasService (`compras.service.test.ts`) — 37 testes

**fetchSolicitacoesCompra (7 testes):**
- ✅ Sucesso da chamada API
- ✅ Passagem de filtros como query params
- ✅ Fallback em HTTP 503
- ✅ Fallback em HTTP 502
- ✅ Fallback em timeout (ECONNABORTED)
- ✅ Fallback em erro de rede (ERR_NETWORK)
- ✅ Campos obrigatórios no resultado do fallback (id, codigo, status, obraId)

**fetchCotacoesCompra (5 testes):**
- ✅ Sucesso da chamada API
- ✅ Passagem de filtros como query params
- ✅ Fallback em HTTP 503
- ✅ Fallback em timeout
- ✅ Campos obrigatórios no resultado do fallback (id, solicitacaoId, status)

**fetchPedidosCompra (6 testes):**
- ✅ Sucesso da chamada API
- ✅ Passagem de filtros como query params
- ✅ Fallback em HTTP 503
- ✅ Fallback em HTTP 504
- ✅ Fallback em timeout
- ✅ Campos obrigatórios no resultado do fallback (id, fornecedorNome, valorPedido, status)

**fetchPedidoCompraById (5 testes):**
- ✅ Sucesso da chamada API com ID válido
- ✅ Fallback em HTTP 503
- ✅ Fallback em timeout
- ✅ Null para ID desconhecido no fallback
- ✅ Linkage solicitacao ↔ cotacao no fallback

**fetchComprasDashboard (7 testes):**
- ✅ Sucesso da chamada API com KPIs
- ✅ Passagem de filtros como query params
- ✅ Fallback em HTTP 503
- ✅ Fallback em HTTP 502
- ✅ Fallback em timeout
- ✅ Coerência dos KPIs (totalSolicitacoes ≥ solicitacoesPendentes)
- ✅ Todas as 3 etapas populadas no fallback

**normalizeComprasDashboardData (7 testes):**
- ✅ Defaults seguros para payload null
- ✅ Defaults seguros para payload undefined
- ✅ Normalização de payload parcial sem listas
- ✅ Normalização de payload parcial sem kpis
- ✅ Normalização de payload completo válido
- ✅ Conversão de listas não-array para arrays vazios
- ✅ Merge de kpis parciais com defaults

### Integration registry (`integration.test.ts`) — 3 novos testes
- ✅ `getModuleReadiness('fopag')`: `integrationStatus === 'integrated'`, todos os endpoints com `integrated: true`
- ✅ `getModuleReadiness('financeiro')`: `integrationStatus === 'integrated'`, todos os endpoints com `integrated: true`
- ✅ `getModuleReadiness('compras')`: `integrationStatus === 'integrated'`, 5 endpoints, todos com `integrated: true`

**Total de testes no projeto: 664 em 50 arquivos (todos passando)**

---

## Correções retroativas aplicadas

A Fase 9 também corrigiu o registry `integration.ts` que não havia sido atualizado para FOPAG e Financeiro na Fase 8:

| Módulo | Antes | Depois |
|--------|-------|--------|
| FOPAG | `integrationStatus: 'ready'`, endpoints `integrated: false` | `integrationStatus: 'integrated'`, endpoints `integrated: true` |
| Financeiro | `integrationStatus: 'ready'`, endpoints `integrated: false` | `integrationStatus: 'integrated'`, endpoints `integrated: true` |
| Compras | `integrationStatus: 'ready'`, endpoints `integrated: false` | `integrationStatus: 'integrated'`, endpoints `integrated: true` |

---

## Como testar a integração

```env
# Para usar API real
VITE_API_URL=http://localhost:3000/api
VITE_API_FALLBACK=true

# Para usar apenas mock (desenvolvimento)
VITE_API_FALLBACK=true
```

1. **Solicitações**: Navegue para **Compras** para ver listagem de solicitações com filtros por status, categoria e prioridade.
2. **Cotações**: Acesse a aba **Cotações** para ver cotações vinculadas às solicitações.
3. **Pedidos**: Acesse a aba **Pedidos** para ver pedidos emitidos; clique em um pedido para ver o detalhe com itens e timeline.
4. **Dashboard**: O dashboard consolida as 3 etapas com KPIs de valor comprometido e status de integração fiscal/financeiro.

---

## Fase 10 — Próximo candidato

O próximo fluxo independente recomendado é **Fiscal**, com 4 endpoints prontos:

| Endpoint | Status |
|----------|--------|
| `GET /fiscal/dashboard` | ✅ Pronto |
| `GET /fiscal/entradas` | ✅ Pronto |
| `GET /fiscal/saidas` | ✅ Pronto |
| `GET /fiscal/documentos/:id` | ✅ Pronto |

O módulo Fiscal é independente e seus contratos estão estáveis. Após Fiscal, o candidato seguinte é **Relatórios** (2 endpoints prontos).

---

## Resultado dos comandos de validação

```
npm run build: ✅ 0 erros TypeScript
npm run lint:  ✅ 0 erros
npm run test:  ✅ 664 testes em 50 arquivos
npm audit:     ✅ 0 vulnerabilidades
```
