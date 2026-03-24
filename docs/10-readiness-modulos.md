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

## Módulos prontos para integração imediata (Ready)

### 1. Dashboard

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/dashboard/summary` | GET | ✅ | Resumo executivo com KPIs, alertas, obras, RH e financeiro |

**Normalizador:** `normalizeDashboardSummary` — arrays default `[]`, generatedAt fallback.
**Validação Zod:** Não (payload dinâmico).
**Notas:** Contrato simples e estável. Primeiro candidato para integração.

---

### 2. Obras (módulo central)

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/obras` | GET | ✅ | Listagem com filtros (status, filial, busca) |
| `/obras/:id` | GET | ✅ | Detalhe completo da obra |
| `/obras` | POST | ✅ | Criar obra com validação de código duplicado |
| `/obras/:id` | PUT | ✅ | Atualizar obra |

**Normalizador:** `normalizeObrasListResponse` — arrays `[]`, KPIs com defaults numéricos.
**Validação Zod:** `obraSchema`, `obraCreateSchema`, `obraUpdateSchema`.
**Notas:** Módulo pivô do sistema. CRUD completo preparado.

---

### 3. RH — Funcionários

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/rh/funcionarios` | GET | ✅ | Listagem com KPIs (ativos, afastados, férias, desligados) |
| `/rh/funcionarios/:id` | GET | ✅ | Detalhe com alocações e vínculo |
| `/rh/funcionarios` | POST | ✅ | Criar funcionário com validação de matrícula/CPF |
| `/rh/funcionarios/:id` | PUT | ✅ | Atualizar funcionário |

**Normalizador:** `normalizeFuncionariosListResponse` — arrays `[]`, KPIs defaults `0`.
**Validação Zod:** `funcionarioSchema`, `funcionarioCreateSchema`.
**Notas:** Segundo módulo prioritário. Validações de duplicidade preparadas.

---

### 4. Horas Extras

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/horas-extras` | GET | ✅ | Listagem com filtros e KPIs |
| `/horas-extras/:id` | GET | ✅ | Detalhe da hora extra |
| `/horas-extras/dashboard` | GET | ✅ | Dashboard com resumo e cards |
| `/horas-extras/:id/aprovar` | POST | ✅ | Aprovar lançamento |
| `/horas-extras/fechamento` | POST | ✅ | Fechar competência |

**Normalizador:** `normalizeHorasExtrasDashboardData`, `normalizeHorasExtrasAprovacaoData`.
**Notas:** Fluxo crítico de negócio. Aprovação e fechamento preparados.

---

### 5. FOPAG

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/fopag/competencias` | GET | ✅ | Listagem de competências com KPIs financeiros |
| `/fopag/competencias/:id` | GET | ✅ | Detalhe da competência (funcionários, valores) |

**Normalizador:** `normalizeFopagCompetenciasResponse`.
**Validação Zod:** `fopagCompetenciaSchema`.
**Notas:** Módulo de leitura com contrato estável.

---

### 6. Compras

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/compras/solicitacoes` | GET | ✅ | Solicitações de compra |
| `/compras/cotacoes` | GET | ✅ | Cotações em andamento |
| `/compras/pedidos` | GET | ✅ | Pedidos de compra |
| `/compras/pedidos/:id` | GET | ✅ | Detalhe do pedido |
| `/compras/dashboard` | GET | ✅ | Dashboard consolidado (3 etapas) |

**Normalizador:** `normalizeComprasDashboardData`.
**Validação Zod:** `compraSchema`, schemas de criação.
**Notas:** Fluxo de 3 etapas (solicitação → cotação → pedido) completo.

---

### 7. Financeiro

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/financeiro/dashboard` | GET | ✅ | Dashboard financeiro principal |
| `/financeiro/fluxo-caixa` | GET | ✅ | Fluxo de caixa |
| `/financeiro/pessoal` | GET | ✅ | Custos de pessoal |
| `/financeiro/contas-pagar` | GET | ✅ | Contas a pagar |
| `/financeiro/contas-receber` | GET | ✅ | Contas a receber |
| `/financeiro/titulos/:id` | GET | ✅ | Detalhe de título financeiro |

**Normalizador:** `normalizeFinanceiroDashboardData`.
**Notas:** 5 views distintas, todas com normalizadores.

---

### 8. Fiscal

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/fiscal/dashboard` | GET | ✅ | Dashboard fiscal |
| `/fiscal/entradas` | GET | ✅ | Documentos de entrada (NF-e recebidas) |
| `/fiscal/saidas` | GET | ✅ | Documentos de saída (NF-e emitidas) |
| `/fiscal/documentos/:id` | GET | ✅ | Detalhe de documento fiscal |

**Normalizador:** `normalizeFiscalDashboardData`.
**Notas:** Módulo de leitura com contratos estáveis.

---

### 9. Relatórios

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/relatorios/dashboard` | GET | ✅ | Dashboard com categorias e resumo |
| `/relatorios/categorias/:categoria` | GET | ✅ | Relatórios por categoria |

**Normalizador:** `normalizeRelatoriosDashboardData`, `normalizeRelatorioCategoriaData`.
**Notas:** Módulo de leitura com normalizadores completos.

---

## Módulos parcialmente prontos (Partial)

### 10. Estoque

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/estoque/dashboard` | GET | ✅ | Dashboard de estoque |
| `/estoque/movimentacoes` | GET | ✅ | Movimentações de estoque |
| `/estoque/itens/:id` | GET | 🟡 | Detalhe de item — contrato parcial |

**Pendência:** Detalhe de item com contrato a refinar.

---

### 11. Medições

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/medicoes/dashboard` | GET | ✅ | Dashboard de medições |
| `/medicoes` | GET | ✅ | Listagem de medições |
| `/medicoes/:id` | GET | 🟡 | Detalhe — contrato parcial |

**Pendência:** Detalhe de medição a consolidar.

---

### 12. Documentos

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/documentos/dashboard` | GET | ✅ | Dashboard de documentos |
| `/documentos/:id` | GET | 🟡 | Detalhe do documento — contrato parcial |

**Pendência:** Upload e gestão de documentos ainda não preparados.

---

### 13. Admin

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

| Módulo | Status | Endpoints Ready | Total Endpoints |
|--------|--------|-----------------|-----------------|
| Dashboard | ✅ Ready | 1 | 1 |
| Obras | ✅ Ready | 4 | 4 |
| RH | ✅ Ready | 4 | 4 |
| Horas Extras | ✅ Ready | 5 | 5 |
| FOPAG | ✅ Ready | 2 | 2 |
| Compras | ✅ Ready | 5 | 5 |
| Financeiro | ✅ Ready | 6 | 6 |
| Fiscal | ✅ Ready | 4 | 4 |
| Relatórios | ✅ Ready | 2 | 2 |
| Estoque | 🟡 Partial | 2 | 3 |
| Medições | 🟡 Partial | 2 | 3 |
| Documentos | 🟡 Partial | 1 | 2 |
| Admin | 🟡 Partial | 7 | 7 |

**Total:** 45 endpoints prontos de 48 mapeados.

---

## Ordem recomendada de implementação no backend

1. **Autenticação** — `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
2. **Contexto** — `GET /context/bootstrap`, `GET /context/options`
3. **Dashboard** — 1 endpoint, contrato simples
4. **Obras** — Módulo central, CRUD completo
5. **RH** — CRUD + alocações
6. **Horas Extras → FOPAG → Financeiro** — Fluxo crítico de negócio
7. **Compras** — Fluxo de 3 etapas
8. **Fiscal** — Módulo de leitura
9. **Relatórios** — Consolidação de dados
10. **Estoque, Medições, Documentos** — Completar contratos parciais
11. **Admin** — Adicionar mutações de CRUD

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
