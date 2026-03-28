# 10 — Readiness de Módulos para Integração Backend

> Documento gerado na Fase 4 — Preparação para Integração Progressiva.

## Visão geral

Este documento mapeia o estado de readiness de cada módulo do frontend para integração com API real. O objetivo é guiar a ordem de implementação do backend e indicar quais endpoints o frontend já espera consumir.

### Legenda

| Status | Significado |
|--------|-------------|
| ✅ **Ready** | Contrato estável, normalizador completo, validação Zod (quando aplicável), service com `withApiFallback` — pronto para API real |
| 🟡 **Partial** | Service com `withApiFallback` e normalizador, mas contrato de detalhe ou mutação ainda parcial |
| ⬜ **Mock-only** | Apenas mock local, sem preparação para API real |

---

## Módulos integrados com API real

### 1. Auth (Fase 5)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/auth/login` | POST | ✅ Integrado | Login com credenciais |
| `/auth/me` | GET | ✅ Integrado | Restaurar sessão |
| `/auth/logout` | POST | ✅ Integrado | Logout |

**Notas:** Integrado na Fase 5. Usa withApiFallback com mock controlado.

---

### 2. Context (Fase 5)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/context/bootstrap` | GET | ✅ Integrado | Bootstrap de contexto global |
| `/context/options` | GET | ✅ Integrado | Opções de contexto (empresas, filiais, obras, etc.) |

**Notas:** Integrado na Fase 5. Normaliza payload parcial, fallback mock controlado.

---

### 3. Dashboard (Fase 5)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/dashboard/summary` | GET | ✅ Integrado | Resumo executivo com KPIs, alertas, obras, RH e financeiro |

**Normalizador:** `normalizeDashboardSummary` — arrays default `[]`, generatedAt fallback.
**Validação Zod:** Não (payload dinâmico).
**Notas:** Integrado na Fase 5. Contrato simples e estável.

---

### 4. Obras — módulo central (Fase 6)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/obras` | GET | ✅ Integrado | Listagem com filtros (status, filial, busca) |
| `/obras/:id` | GET | ✅ Integrado | Detalhe completo da obra |
| `/obras` | POST | ✅ Integrado | Criar obra com validação de código duplicado |
| `/obras/:id` | PUT | ✅ Integrado | Atualizar obra |

**Normalizador:** `normalizeObrasListResponse` — arrays `[]`, KPIs com defaults numéricos.
**Validação Zod:** `obraFormSchema`, `obraStatusSchema`, `obraTipoSchema`, `obraFiltersSchema`.
**Notas:** Integrado na Fase 6. CRUD completo com withApiFallback, normalizador e validação Zod.

---

### 5. RH — Funcionários (Fase 6 + 7 — completo)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/rh/funcionarios` | GET | ✅ Integrado | Listagem com KPIs (ativos, afastados, férias, desligados) |
| `/rh/funcionarios/:id` | GET | ✅ Integrado | Detalhe com alocações e vínculo |
| `/rh/funcionarios` | POST | ✅ Integrado | Criar funcionário com validação de matrícula/CPF |
| `/rh/funcionarios/:id` | PUT | ✅ Integrado | Atualizar funcionário |

**Normalizador:** `normalizeFuncionariosListResponse` — arrays `[]`, KPIs defaults `0`.
**Validação Zod:** `funcionarioSchema`, `funcionarioCreateSchema`.
**Notas:** CRUD completo integrado. Leitura na Fase 6, mutações na Fase 7.

---

## Módulos prontos para integração imediata (Ready)

### 6. Horas Extras (Fase 7)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/horas-extras` | GET | ✅ Integrado | Listagem com filtros e KPIs |
| `/horas-extras/:id` | GET | ✅ Integrado | Detalhe da hora extra |
| `/horas-extras/dashboard` | GET | ✅ Integrado | Dashboard com resumo e cards |
| `/horas-extras/:id/aprovar` | POST | ✅ Integrado | Aprovar lançamento |
| `/horas-extras/fechamento` | POST | ✅ Integrado | Fechar competência |
| `/horas-extras/aprovacao` | GET | ✅ Integrado | Dados de aprovação |

**Normalizador:** `normalizeHorasExtrasDashboardData`, `normalizeHorasExtrasAprovacaoData`.
**Notas:** Fluxo crítico de negócio integrado na Fase 7. Aprovação e fechamento prontos. Dados de competência fechada alimentam FOPAG.

---

### 7. FOPAG (Fase 8)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/fopag/competencias` | GET | ✅ Integrado | Listagem de competências com KPIs financeiros |
| `/fopag/competencias/:id` | GET | ✅ Integrado | Detalhe da competência (funcionários, valores) |

**Normalizador:** `normalizeFopagCompetenciasResponse`.
**Validação Zod:** `fopagCompetenciaSchema`.
**Notas:** Módulo de leitura integrado na Fase 8. Recebe dados do fechamento de Horas Extras.

---

### 8. Financeiro (Fase 8)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/financeiro/dashboard` | GET | ✅ Integrado | Dashboard financeiro principal |
| `/financeiro/fluxo-caixa` | GET | ✅ Integrado | Fluxo de caixa |
| `/financeiro/pessoal` | GET | ✅ Integrado | Custos de pessoal (integrado com FOPAG) |
| `/financeiro/contas-pagar` | GET | ✅ Integrado | Contas a pagar |
| `/financeiro/contas-receber` | GET | ✅ Integrado | Contas a receber |
| `/financeiro/titulos/:id` | GET | ✅ Integrado | Detalhe de título financeiro |

**Normalizador:** `normalizeFinanceiroDashboardData`.
**Notas:** Integrado na Fase 8. O campo `pessoal` no dashboard reflete os dados vindos da FOPAG.

---

### 9. Compras (Fase 9 + Fase 12)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/compras/solicitacoes` | GET | ✅ Integrado | Solicitações de compra |
| `/compras/solicitacoes` | POST | ✅ Integrado | Criar solicitação (Fase 12) |
| `/compras/solicitacoes/:id` | PUT | ✅ Integrado | Atualizar solicitação (Fase 12) |
| `/compras/cotacoes` | GET | ✅ Integrado | Cotações em andamento |
| `/compras/cotacoes` | POST | ✅ Integrado | Criar cotação (Fase 12) |
| `/compras/cotacoes/:id` | PUT | ✅ Integrado | Atualizar cotação (Fase 12) |
| `/compras/pedidos` | GET | ✅ Integrado | Pedidos de compra |
| `/compras/pedidos` | POST | ✅ Integrado | Emitir pedido (Fase 12) |
| `/compras/pedidos/:id` | GET | ✅ Integrado | Detalhe do pedido |
| `/compras/pedidos/:id` | PUT | ✅ Integrado | Atualizar pedido (Fase 12) |
| `/compras/dashboard` | GET | ✅ Integrado | Dashboard consolidado (3 etapas) |

**Normalizador:** `normalizeComprasDashboardData`.
**Notas:** Integrado na Fase 9 (GET). Fase 12: mutations POST/PUT para solicitações, cotações e pedidos com `withApiFallback`.

---

### 10. Fiscal (Fase 10 + Fase 12)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/fiscal/dashboard` | GET | ✅ | Dashboard fiscal |
| `/fiscal/entradas` | GET | ✅ | Documentos de entrada (NF-e recebidas) |
| `/fiscal/entradas` | POST | ✅ | Criar documento fiscal de entrada (Fase 12) |
| `/fiscal/saidas` | GET | ✅ | Documentos de saída (NF-e emitidas) |
| `/fiscal/documentos/:id` | GET | ✅ | Detalhe de documento fiscal |
| `/fiscal/documentos/:id` | PUT | ✅ | Atualizar documento fiscal (Fase 12) |

**Notas:** Integrado na Fase 10 (GET). Fase 12: mutations POST/PUT com `withApiFallback`.

---

### 11. Relatórios (Fase 10 + Fase 12)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/relatorios/dashboard` | GET | ✅ | Dashboard com categorias e resumo |
| `/relatorios/categorias/:categoria` | GET | ✅ | Relatórios por categoria |
| `/relatorios/gerar` | POST | ✅ | Gerar relatório sob demanda (Fase 12) |

**Notas:** Integrado na Fase 10 (GET). Fase 12: mutation POST gerar relatório com `withApiFallback`.

---

## Módulos integrados — Fase 11

### 12. Estoque (Fase 11 + Fase 12)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/estoque/dashboard` | GET | ✅ | Dashboard de estoque |
| `/estoque/movimentacoes` | GET | ✅ | Movimentações de estoque |
| `/estoque/movimentacoes` | POST | ✅ | Registrar movimentação (Fase 12) |
| `/estoque/itens/:id` | GET | ✅ | Detalhe de item |
| `/estoque/itens/:id` | PUT | ✅ | Atualizar item de estoque (Fase 12) |

**Notas:** Integrado na Fase 11 (GET). Fase 12: mutations POST movimentação e PUT item com `withApiFallback`.

---

### 13. Medições (Fase 11 + Fase 12)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/medicoes/dashboard` | GET | ✅ | Dashboard de medições |
| `/medicoes` | GET | ✅ | Listagem de medições |
| `/medicoes` | POST | ✅ | Criar medição (Fase 12) |
| `/medicoes/:id` | GET | ✅ | Detalhe de medição |
| `/medicoes/:id` | PUT | ✅ | Atualizar medição (Fase 12) |
| `/medicoes/:id/aprovar` | POST | ✅ | Aprovar medição (Fase 12) |

**Notas:** Integrado na Fase 11 (GET). Fase 12: mutations POST criar, PUT atualizar, POST aprovar com `withApiFallback`.

---

### 14. Documentos

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/documentos/dashboard` | GET | ✅ | Dashboard de documentos |
| `/documentos/:id` | GET | 🟡 | Detalhe do documento — contrato parcial |

**Pendência:** Upload e gestão de documentos ainda não preparados.

---

### 15. Admin

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/admin/dashboard` | GET | ✅ | Dashboard administrativo |
| `/admin/usuarios` | GET | ✅ | Listagem de usuários |
| `/admin/perfis` | GET | ✅ | Listagem de perfis |
| `/admin/permissoes` | GET | ✅ | Listagem de permissões |
| `/admin/parametros` | GET | ✅ | Parâmetros do sistema |
| `/admin/logs` | GET | ✅ | Logs de auditoria |
| `/admin/integracoes` | GET | ✅ | Integrações |

**Pendência:** CRUD de usuários/perfis/permissões (mutações) não preparado.

---

## Resumo de readiness

| Módulo | Status | Endpoints Integrados | Endpoints Ready | Total Endpoints |
|--------|--------|---------------------|-----------------|-----------------|
| Auth | ✅ Integrado | 3 | 3 | 3 |
| Context | ✅ Integrado | 2 | 2 | 2 |
| Dashboard | ✅ Integrado | 1 | 1 | 1 |
| Obras | ✅ Integrado | 4 | 4 | 4 |
| RH | ✅ Integrado | 4 | 4 | 4 |
| Horas Extras | ✅ Integrado | 6 | 6 | 6 |
| FOPAG | ✅ Integrado | 2 | 2 | 2 |
| Financeiro | ✅ Integrado | 6 | 6 | 6 |
| Compras | ✅ Integrado (Fase 9) | 5 | 5 | 5 |
| Fiscal | ✅ Integrado (Fase 10) | 4 | 4 | 4 |
| Relatórios | ✅ Integrado (Fase 10) | 2 | 2 | 2 |
| Estoque | 🟡 Partial | 0 | 2 | 3 |
| Medições | 🟡 Partial | 0 | 2 | 3 |
| Documentos | 🟡 Partial | 0 | 1 | 2 |
| Admin | 🟡 Partial | 0 | 7 | 7 |

**Total:** 39 endpoints integrados, 51 endpoints ready de 54 mapeados.

---

## Ordem recomendada de implementação no backend

1. ~~**Autenticação**~~ — ✅ Integrado (Fase 5)
2. ~~**Contexto**~~ — ✅ Integrado (Fase 5)
3. ~~**Dashboard**~~ — ✅ Integrado (Fase 5)
4. ~~**Obras**~~ — ✅ Integrado (Fase 6)
5. ~~**RH**~~ — ✅ Integrado completo (Fase 6 + 7)
6. ~~**Horas Extras**~~ — ✅ Integrado (Fase 7)
7. ~~**FOPAG**~~ — ✅ Integrado (Fase 8)
8. ~~**Financeiro**~~ — ✅ Integrado (Fase 8)
9. ~~**Compras**~~ — ✅ Integrado (Fase 9)
10. ~~**Fiscal**~~ — ✅ Integrado (Fase 10)
11. ~~**Relatórios**~~ — ✅ Integrado (Fase 10)
12. **Estoque, Medições** — Mutations integradas na Fase 12 ✅
13. **Admin** — Mutations de CRUD integradas na Fase 11 ✅
14. **Fase 14** — Testes E2E (Playwright), hooks de sub-features, início do backend real

---

## Convenções para integração

### Envelope de resposta

```json
{ "data": T }
```

### Headers de contexto

```
Authorization: Bearer <token>
X-Context-Empresa: <empresaId>
X-Context-Filial: <filialId>
X-Context-Obra: <obraId>
X-Context-Centro-Custo: <centroCustoId>
X-Context-Competencia: <YYYY-MM>
```

### Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3000/api   # URL base da API
VITE_API_FALLBACK=true                    # Habilitar fallback para mock
VITE_API_TIMEOUT=15000                    # Timeout de requisição em ms
```

### Comportamento de fallback

O frontend tenta a API real primeiro. Se ocorrer erro de rede, timeout, 404, 405, 501-504, ou resposta HTML, degrada para mock local. Erros 400, 403, 409, 422 e 500 (JSON) são propagados normalmente.

Para desabilitar fallback e forçar uso exclusivo da API real:
```env
VITE_API_FALLBACK=false
```
