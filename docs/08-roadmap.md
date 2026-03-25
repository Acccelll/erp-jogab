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

## Fase 8 ✅
- Documentos (lista, detalhe do documento)
- Relatórios (lista, relatórios por categoria)
- Administração (painel, usuários, perfis, permissões, parâmetros, logs, integrações)
- Perfil (página do usuário)

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

## Próximos passos
- Completar integração de RH com mutações (POST/PUT)
- Conectar Horas Extras como próximo módulo integrado
- Seguir fluxo crítico: HE → FOPAG → Financeiro → Compras
- Desabilitar fallback gradualmente por módulo (`VITE_API_FALLBACK=false`)
- Code-splitting com React.lazy para reduzir bundle size
- Testes de integração end-to-end com API real
- Completar contratos parciais: estoque detalhe, medições detalhe, documentos gestão, admin CRUD

## Estado atual (2026-03-25)

**Resultado dos comandos de validação:**
- `npm run build`: 0 erros TypeScript, build completo com sucesso
- `npm run lint`: 0 erros
- `npm run test`: 44 arquivos de teste, 514 testes passando
- `npm audit`: 0 vulnerabilidades

**Testes encontrados vs declarados:**
- Arquivos de teste no repositório: 44 (17 `.test.ts` + 27 `.test.tsx`)
- Testes executados pelo Vitest: 514 em 44 arquivos — todos passando
- Padrão de include: `src/**/*.test.{ts,tsx}` — correto e abrangente

**Endpoints efetivamente integrados (Fase 5 + 6):**
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

**Módulos que continuam apenas preparados:**
- Horas Extras, FOPAG, Compras, Financeiro, Fiscal, Relatórios (serviços com mock, prontos para withApiFallback)
- Estoque, Medições, Documentos, Admin (parcialmente prontos)
- RH mutações (POST/PUT) — prontas mas não integradas nesta fase

**Rotas implementadas:**
- `/horas-extras/lancamentos` — lista de lançamentos
- `/horas-extras/:lancamentoId` — detalhe do lançamento
- Todas as demais rotas documentadas em `docs/06-arquitetura-de-telas.md` estão presentes
