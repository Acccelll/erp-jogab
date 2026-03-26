# 08 — Roadmap

## Fase 1 ✅
- setup Vite + React + TS
- Tailwind
- Router
- Query
- Zustand
- layouts base

## Fase 2 ✅
- Sidebar
- Topbar
- ContextBar
- guards (AuthGuard, PermissionGuard)
- sistema de permissão
- 6 Zustand stores globais
- tema JOGAB
- página 404

## Fase 3 ✅
- Dashboard (página, KPIs, hooks, service, mock data)
- Obras (lista, workspace com 11 abas, hooks, services, mock data)
- RH (lista de funcionários, workspace com 10 abas, hooks, services, mock data)

## Fase 4 ✅
- Horas Extras (dashboard, aprovação, fechamento, lançamentos, detalhe de lançamento, hooks, services, mock data)

## Fase 5 ✅
- FOPAG (lista de competências, detalhe com 7 abas, hooks, services, mock data)

## Fase 6 ✅
- Compras (lista, solicitações, cotações, pedidos, detalhe do pedido)
- Fiscal (lista, entradas, saídas, detalhe do documento)

## Fase 7 ✅
- Financeiro (lista, fluxo de caixa, contas a pagar, contas a receber, detalhe de título)
- Estoque (lista, movimentações, detalhe do item)
- Medições (lista, detalhe da medição)

## Integração FOPAG + Financeiro (Fase 8) ✅
- FOPAG integrado: listagem e detalhe de competências via `withApiFallback`
  - `GET /fopag/competencias` — listagem com KPIs
  - `GET /fopag/competencias/:id` — detalhe com funcionários, obras, eventos, rateio e financeiro
- Financeiro integrado: todos os endpoints via `withApiFallback`
  - `GET /financeiro/dashboard` — dashboard com pessoal (integrado FOPAG)
  - `GET /financeiro/pessoal` — custos de pessoal oriundos de FOPAG
  - `GET /financeiro/fluxo-caixa`, `GET /financeiro/contas-pagar`, `GET /financeiro/contas-receber`, `GET /financeiro/titulos/:id`
- Cadeia HE → FOPAG → Financeiro validada e documentada (workforceCost.ts + testes)
- Registry de integração atualizado: 8 módulos integrados (+ fopag + financeiro)
- Lint: 0 erros (fixado no `fopag.service.test.ts` e `financeiro.service.test.ts`)
- Testes adicionados: FOPAG service (17), Financeiro service (22), workforceCost chain (23), integration registry (2)
- Compras preparado para Fase 9: contratos e endpoints revisados, documentados em `docs/14-integracao-fase8.md`
- Total: 621 testes em 49 arquivos

## Fase de saneamento (Fase 1 de alinhamento) ✅
- Normalização de services para resiliência a payload parcial
- Testes automatizados iniciais com Vitest (base expandida na Fase 3 de alinhamento)
- Proteção contra HTML responses no cliente HTTP
- Safe-access pattern em todas as páginas de lista

## Fase de alinhamento documental (Fase 2 de alinhamento) ✅
- Revisão de aderência entre código e spec
- Documentação de todas as rotas oficiais
- Oficialização de testes, deploy e ferramentas de qualidade
- Limpeza de artefatos obsoletos

## Fase de endurecimento de qualidade (Fase 3 de alinhamento) ✅
- Testes unitários de componentes compartilhados (EmptyState, PageHeader, KPISection, KPICard, StatusBadge, FilterBar)
- Testes unitários de stores Zustand (contextStore, drawerStore, filtersStore, notificationStore, uiStore)
- Testes de validação Zod (enums, formulários e filtros dos módulos Obras, RH, Compras, FOPAG)
- Testes de hooks TanStack Query (Dashboard, Obras, RH, FOPAG, Compras, Horas Extras)
- Testes de utilitários compartilhados (cn, formatCompetencia, formatCurrency)
- Total: 384 testes em 36 arquivos

## Fase de preparação para integração (Fase 4 de alinhamento) ✅
- Camada HTTP reforçada: ApiError tipado, classifyError, timeout configurável
- Módulo de configuração de integração centralizado (integration.ts)
- Registry de readiness por módulo com endpoints mapeados
- Fallback controlado para timeout (ECONNABORTED)
- Variáveis de ambiente documentadas (VITE_API_URL, VITE_API_FALLBACK, VITE_API_TIMEOUT)
- Documentação de readiness por módulo (docs/10-readiness-modulos.md)
- 9 módulos prontos para integração imediata, 4 parcialmente prontos
- Total: 410 testes em 37 arquivos

## Integração real incremental (Fase 5) ✅
- Autenticação real: login, restauração de sessão e logout via `withApiFallback`
- Contexto/bootstrap real: opções e bootstrap de contexto via `withApiFallback`
- Dashboard integrado: resumo executivo com normalizador e `withApiFallback`
- Normalizers de contexto: `normalizeContextOptions` e `normalizeContextBootstrap`
- Configuração por ambiente documentada (.env.example com comentários)
- Registry de integração atualizado: auth, context e dashboard como `integrated`
- Testes de integração: auth service (16), context service (16), integration registry (15)
- Documentação de integração (docs/11-integracao-fase5.md)
- Total: 447 testes em 39 arquivos

## Integração Obras + RH leitura (Fase 6) ✅
- Obras integrado: CRUD completo (GET list, GET detail, POST create, PUT update) via `withApiFallback`
- RH parcialmente integrado: leitura (GET list, GET detail) via `withApiFallback`
- Normalizers validados: `normalizeObrasListResponse` e `normalizeFuncionariosListResponse`
- Workspace de Obras funcional com API real: 11 abas com fallback controlado
- Mutações de Obras validadas: criação e atualização com feedback e validação Zod
- Testes adicionados: service Obras (24), workspace (12), useObraDetails (5), useObraMutations (4), service RH (17), integration (5)
- Registry atualizado: auth, context, dashboard, obras e rh como `integrated`
- Documentação completa (docs/12-integracao-fase6.md)
- Total: 514 testes em 44 arquivos

## Integração RH mutações + Horas Extras (Fase 7) ✅
- RH completo: mutações (POST create, PUT update) integradas via `withApiFallback`
- RH agora com CRUD completo (GET list, GET detail, POST create, PUT update)
- Horas Extras integrado: fluxo completo via `withApiFallback`
  - Listagem, detalhe, dashboard (GET)
  - Aprovação de lançamento (POST)
  - Fechamento de competência (POST)
  - Dados de aprovação (GET)
- Normalizers validados: `normalizeHorasExtrasDashboardData`, `normalizeHorasExtrasAprovacaoData`
- Testes adicionados: RH mutações (8), HE service (20), HE aprovação (9), integration (3)
- Registry atualizado: 6 módulos integrados (auth, context, dashboard, obras, rh, horas-extras)
- Documentação completa (docs/13-integracao-fase7.md)
- Total: 553 testes em 46 arquivos

## Fase 9 — Concluída (2026-03-26)

- ✅ Compras integrado: solicitações, cotações, pedidos, detalhe do pedido e dashboard
- ✅ 37 novos testes para o service de Compras + 3 novos testes de integração no registry
- ✅ `integration.ts` atualizado: Compras, FOPAG e Financeiro marcados como `integrated`

## Fase 10 — Concluída (2026-03-26)

- ✅ Fiscal integrado: dashboard, entradas, saídas, detalhe de documento (4 endpoints)
- ✅ Relatórios integrado: dashboard, categorias/:categoria (2 endpoints)
- ✅ 35 novos testes para Fiscal + 37 novos testes para Relatórios
- ✅ `integration.ts` atualizado: Fiscal e Relatórios marcados como `integrated`
- ✅ 11 módulos agora integrados (de 9 na Fase 9)

## Fase 12 — Concluída (2026-03-26)

- ✅ Mutations (POST/PUT) adicionadas: Compras (6), Fiscal (2), Estoque (2), Medições (3), Relatórios (1)
- ✅ `integration.ts` atualizado: 5 módulos com endpoints de mutation registrados
- ✅ Testes de mutation adicionados a compras, fiscal e estoque service tests
- ✅ 842 testes passando em 56 arquivos

## Fase 13 — Concluída (2026-03-26)

- ✅ Bug fix: padrão de `unwrapApiResponse` corrigido em todas as mutations da Fase 12
- ✅ TypeScript: corrigidos erros de tipo nas funções fallback de update
- ✅ 7 novos arquivos de teste de hooks: Financeiro, Fiscal, Estoque, Medições, Documentos, Relatórios, Admin
- ✅ Testes de mutation adicionados a medicoes e relatorios service tests
- ✅ README e documentação atualizados
- ✅ **880 testes passando em 63 arquivos**

## Estado atual (2026-03-26 — Fase 13)

**Resultado dos comandos de validação:**
- `npm run build`: 0 erros TypeScript, build completo com sucesso
- `npm run lint`: 0 erros
- `npm run test`: 63 arquivos de teste, 880 testes passando
- `npm audit`: 0 vulnerabilidades

## Fase 14 — Estabilização (✅ Concluída)

**Objetivo:** Estabilização técnica, code-splitting e atualização de documentação.

**O que foi feito:**
- Code-splitting com `React.lazy` para todos os pages de módulo (`router/index.tsx`)
- `PageLoader.tsx` com `Suspense` boundary e spinner de carregamento
- `.env.example` atualizado com orientações de produção
- `docs/19-estabilizacao-fase14.md` criado com guia completo de uso da API
- Tabela de readiness de módulos atualizada: todos os 15 módulos ✅ Integrado

**Resultado dos comandos de validação:**
- `npm run build`: 0 erros TypeScript, build completo com sucesso
- `npm run lint`: 0 erros
- `npm run test`: 63 arquivos de teste, 880 testes passando
- `npm audit`: 0 vulnerabilidades

**Todos os 61 endpoints integrados (Fases 5–14):**

| Módulo | Endpoints integrados |
|--------|---------------------|
| Auth | POST /auth/login, GET /auth/me, POST /auth/logout |
| Context | GET /context/bootstrap, GET /context/options |
| Dashboard | GET /dashboard/summary |
| Obras | GET /obras, GET /obras/:id, POST /obras, PUT /obras/:id |
| RH | GET /rh/funcionarios, GET /rh/funcionarios/:id, POST /rh/funcionarios, PUT /rh/funcionarios/:id |
| Horas Extras | GET /horas-extras, GET /horas-extras/:id, GET /horas-extras/dashboard, GET /horas-extras/aprovacao, POST /horas-extras/:id/aprovar, POST /horas-extras/fechamento |
| FOPAG | GET /fopag/competencias, GET /fopag/competencias/:id |
| Financeiro | GET /financeiro/dashboard, GET /financeiro/fluxo-caixa, GET /financeiro/pessoal, GET /financeiro/contas-pagar, GET /financeiro/contas-receber, GET /financeiro/titulos/:id |
| Compras | GET /compras/solicitacoes, GET /compras/cotacoes, GET /compras/pedidos, GET /compras/pedidos/:id, GET /compras/dashboard, POST/PUT solicitação, cotação, pedido |
| Fiscal | GET /fiscal/dashboard, GET /fiscal/entradas, GET /fiscal/saidas, GET /fiscal/documentos/:id, POST /fiscal/documentos, PUT /fiscal/documentos/:id |
| Relatórios | GET /relatorios/dashboard, GET /relatorios/categorias/:categoria, POST /relatorios/gerar |
| Estoque | GET /estoque/dashboard, GET /estoque/movimentacoes, GET /estoque/itens/:id, POST /estoque/movimentacoes, PUT /estoque/itens/:id |
| Medições | GET /medicoes/dashboard, GET /medicoes, GET /medicoes/:id, POST /medicoes, PUT /medicoes/:id, POST /medicoes/:id/aprovar |
| Documentos | GET /documentos/dashboard, GET /documentos/:id, POST /documentos/upload, PUT /documentos/:id |
| Admin | GET /admin/dashboard, GET /admin/usuarios, GET /admin/perfis, GET /admin/permissoes, GET /admin/parametros, GET /admin/logs, GET /admin/integracoes, POST/PUT usuário, perfil, permissão |

Todos os módulos usam `withApiFallback` — fallback gracioso para mock local quando API não está disponível.

## Próximos passos (pós-Fase 14)

- **Backend real** — implementar Node/Express com os 61 endpoints mapeados
- **Testes E2E** — Playwright com fluxos: login → dashboard → obras → detalhe
- **Autenticação real** — JWT com refresh token
- **Permissões** — guard por perfil usando dados de `/admin/permissoes`
