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
- Horas Extras (dashboard, aprovação, fechamento, hooks, services, mock data)

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

## Próximos passos
- Integração com API real (substituir services mock)
- Code-splitting com React.lazy para reduzir bundle size
- Testes de integração end-to-end
- Rotas pendentes: `/horas-extras/lancamentos`, `/horas-extras/:lancamentoId`
- Backend: repositório ainda sem implementação
