# Fase 10 — Integração: Fiscal e Relatórios

## Objetivo

Integrar os módulos **Fiscal** e **Relatórios** à API real, fechando o conjunto de módulos de leitura que já estavam com status *ready* (contrato estável, normalizadores prontos e `withApiFallback` implementado no service).

Esta é a décima fase de integração incremental do ERP JOGAB.

---

## Escopo

### Fiscal — 4 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/fiscal/dashboard` | GET | Dashboard fiscal (KPIs, documentos, resumo) |
| `/fiscal/entradas` | GET | Listagem de documentos de entrada (NF-e, NFS-e, CT-e) |
| `/fiscal/saidas` | GET | Listagem de documentos de saída |
| `/fiscal/documentos/:id` | GET | Detalhe de documento fiscal |

### Relatórios — 2 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/relatorios/dashboard` | GET | Dashboard de relatórios (resumo executivo, categorias, cobertura de módulos) |
| `/relatorios/categorias/:categoria` | GET | Relatórios filtrados por categoria (obras, rh, horas-extras, fopag, compras, financeiro) |

**Total desta fase: 6 endpoints integrados**

---

## Padrão técnico

Ambos os módulos seguem o padrão já consolidado nas fases anteriores:

- `withApiFallback(apiCall, mockFallback)` — fallback automático para mock quando a API retorna erros 5xx, timeout (`ECONNABORTED`) ou erro de rede (`ERR_NETWORK`)
- Normalizadores defensivos que garantem shape completo mesmo para payloads parciais da API
- `unwrapApiResponse` para desembrulhar o envelope `{ data: ... }` da resposta

### Normalizadores

- **`normalizeFiscalDashboardData(payload)`** — garante `documentos`, `kpis` (7 campos), `resumoCards` e `statusResumo`
- **`normalizeRelatoriosDashboardData(payload)`** — garante `itens`, `categorias`, `resumo` (5 campos), `resumoCards`, `saidasOperacionais`, `coberturaModulos`
- **`normalizeRelatorioCategoriaData(payload, categoria)`** — garante `categoria`, `itens`, `resumoCards`, `saidasOperacionais`, `coberturaModulos`

---

## Arquivos alterados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `frontend/src/shared/lib/integration.ts` | Editado | `fiscal` e `relatorios`: `integrationStatus: 'ready'` → `'integrated'`, todos os endpoints `integrated: false` → `true` |
| `frontend/src/shared/lib/integration.test.ts` | Editado | Contagem de módulos integrados 9 → 11; asserts explícitos para `fiscal` e `relatorios` |
| `frontend/src/modules/fiscal/services/fiscal.service.test.ts` | Criado | 35 testes cobrindo todos os endpoints, normalizador e cenários de fallback |
| `frontend/src/modules/relatorios/services/relatorios.service.test.ts` | Criado | 37 testes cobrindo todos os endpoints, normalizadores e cenários de fallback |

> Nota: os services `fiscal.service.ts` e `relatorios.service.ts` já tinham `withApiFallback` implementado corretamente desde a preparação das fases anteriores. A Fase 10 confirmou e registrou a integração no registry.

---

## Testes

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `fiscal.service.test.ts` | 35 | dashboard, entradas, saídas, detalhe, normalizador |
| `relatorios.service.test.ts` | 37 | dashboard, categorias (obras, rh), normalizadores (dashboard + categoria) |

Cenários cobertos em cada endpoint:
- ✅ Sucesso com payload da API
- ✅ Fallback em HTTP 502, 503, 504
- ✅ Fallback em ECONNABORTED (timeout)
- ✅ Fallback em ERR_NETWORK
- ✅ Normalizador com payload null/undefined
- ✅ Normalizador com payload parcial (listas faltando, kpis/resumo faltando)
- ✅ Normalizador com tipos inválidos (non-array → [])

---

## Estado após a Fase 10

### Módulos integrados (11 total)

| Módulo | Fase | Endpoints |
|--------|------|-----------|
| auth | Fase 5 | login, refresh, logout |
| context | Fase 5 | obras, competencias, filiais |
| dashboard | Fase 5 | dashboard principal |
| obras | Fase 6 | CRUD completo (7 endpoints) |
| rh | Fases 6–7 | GET list/detail + POST/PUT funcionário |
| horas-extras | Fase 7 | list, detail, dashboard, approve, close, aprovacao |
| fopag | Fase 8 | competencias, competencia/:id |
| financeiro | Fase 8 | dashboard, pessoal, fluxo-caixa, contas-pagar, contas-receber, titulos/:id |
| compras | Fase 9 | solicitacoes, cotacoes, pedidos, pedidos/:id, dashboard |
| fiscal | **Fase 10** | dashboard, entradas, saidas, documentos/:id |
| relatorios | **Fase 10** | dashboard, categorias/:categoria |

### Módulos parciais (4 restantes)

| Módulo | Status | Pendências |
|--------|--------|------------|
| estoque | partial | dashboard pronto; detalhe do item parcial |
| medicoes | partial | dashboard e listagem prontos; detalhe parcial |
| documentos | partial | dashboard pronto; upload e gestão pendentes |
| admin | partial | múltiplos endpoints prontos; permissões e logs pendentes |

---

## Resultado dos testes e validação

```
Test Files  52 passed (52)
     Tests  715 passed (715)
  Duration  ~34s
```

- Build: ✅ 0 erros TypeScript
- Lint: ✅ 0 erros ESLint
- npm audit: ✅ 0 vulnerabilidades

---

## Próxima fase recomendada — Fase 11: Estoque

**Candidato principal:** Estoque (dashboard + movimentações prontos, detalhe parcial)

Escopo sugerido:
- `GET /estoque/dashboard`
- `GET /estoque/movimentacoes`
- `GET /estoque/itens/:id` (avaliar maturidade do contrato)

Candidato secundário: Medições (mesma estrutura de maturidade)
