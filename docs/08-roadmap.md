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

## Próximos passos (Fase 14)

- Setup E2E básico (Playwright) com fluxos: login → dashboard → obras → detalhes
- Cobertura de hooks de sub-features: `useContasPagar`, `useFluxoCaixa`, `useFiscalEntradas`, etc.
- Início do backend real (Node/Express) com endpoints prioritários
- Code-splitting com React.lazy (bundle atual ~1MB, warning de >500 kB)



**Resultado dos comandos de validação:**
- `npm run build`: 0 erros TypeScript, build completo com sucesso
- `npm run lint`: 0 erros
- `npm run test`: 52 arquivos de teste, 715 testes passando
- `npm audit`: 0 vulnerabilidades

**Endpoints efetivamente integrados (Fases 5–10):**
- `POST /auth/login` — login real com fallback mock
- `GET /auth/me` — restauração de sessão com fallback mock
- `POST /auth/logout` — logout com fallback mock
- `GET /context/bootstrap` — bootstrap de contexto com fallback mock
- `GET /context/options` — opções de contexto com fallback mock
- `GET /dashboard/summary` — resumo executivo com fallback mock
- `GET /obras` — listagem de obras com fallback mock
- `GET /obras/:id` — detalhe da obra com fallback mock
- `POST /obras` — criação de obra com fallback mock
- `PUT /obras/:id` — atualização de obra com fallback mock
- `GET /rh/funcionarios` — listagem de funcionários com fallback mock
- `GET /rh/funcionarios/:id` — detalhe do funcionário com fallback mock
- `POST /rh/funcionarios` — criação de funcionário com fallback mock
- `PUT /rh/funcionarios/:id` — atualização de funcionário com fallback mock
- `GET /horas-extras` — listagem de horas extras com fallback mock
- `GET /horas-extras/:id` — detalhe da hora extra com fallback mock
- `GET /horas-extras/dashboard` — dashboard de horas extras com fallback mock
- `POST /horas-extras/:id/aprovar` — aprovação de hora extra com fallback mock
- `POST /horas-extras/fechamento` — fechamento de competência com fallback mock
- `GET /horas-extras/aprovacao` — dados de aprovação com fallback mock
- `GET /fopag/competencias` — listagem de competências FOPAG com fallback mock
- `GET /fopag/competencias/:id` — detalhe da competência FOPAG com fallback mock
- `GET /financeiro/dashboard` — dashboard financeiro principal com fallback mock
- `GET /financeiro/fluxo-caixa` — fluxo de caixa com fallback mock
- `GET /financeiro/pessoal` — custos de pessoal (integrado FOPAG) com fallback mock
- `GET /financeiro/contas-pagar` — contas a pagar com fallback mock
- `GET /financeiro/contas-receber` — contas a receber com fallback mock
- `GET /financeiro/titulos/:id` — detalhe de título financeiro com fallback mock
- `GET /compras/solicitacoes` — listagem de solicitações com fallback mock
- `GET /compras/cotacoes` — listagem de cotações com fallback mock
- `GET /compras/pedidos` — listagem de pedidos com fallback mock
- `GET /compras/pedidos/:id` — detalhe do pedido com fallback mock
- `GET /compras/dashboard` — dashboard consolidado de compras com fallback mock
- `GET /fiscal/dashboard` — dashboard fiscal com fallback mock
- `GET /fiscal/entradas` — documentos de entrada com fallback mock
- `GET /fiscal/saidas` — documentos de saída com fallback mock
- `GET /fiscal/documentos/:id` — detalhe de documento fiscal com fallback mock
- `GET /relatorios/dashboard` — dashboard de relatórios com fallback mock
- `GET /relatorios/categorias/:categoria` — relatórios por categoria com fallback mock

**Módulos que continuam apenas preparados (partial):**
- Estoque, Medições, Documentos, Admin (parcialmente prontos — candidatos à Fase 11)

**Rotas implementadas:**
- `/horas-extras/lancamentos` — lista de lançamentos
- `/horas-extras/:lancamentoId` — detalhe do lançamento
- Todas as demais rotas documentadas em `docs/06-arquitetura-de-telas.md` estão presentes
