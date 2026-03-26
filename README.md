# Pacote de contexto para IA — ERP JOGAB

Este pacote foi preparado para uso com GitHub Copilot Agent ou Claude Code.

## Ordem de leitura obrigatória
1. `JOGAB_MASTER_SPEC.md`
2. `CLAUDE.md`
3. `docs/01-visao-geral.md`
4. `docs/02-arquitetura-tecnica.md`
5. `docs/03-banco-de-dados.md`
6. `docs/04-atualizacao-horas-extras-fopag.md`
7. `docs/05-arquitetura-frontend.md`
8. `docs/06-arquitetura-de-telas.md`
9. `docs/07-regras-de-implementacao.md`
10. `docs/08-roadmap.md`
11. `docs/10-readiness-modulos.md`
12. `docs/11-integracao-fase5.md`
13. `docs/12-integracao-fase6.md`
14. `docs/13-integracao-fase7.md`
15. `docs/14-integracao-fase8.md`
16. `docs/15-integracao-fase10.md`
17. `docs/16-integracao-fase9.md`
18. `docs/17-integracao-fase11.md`
19. `docs/18-qualidade-fase13.md`

## Objetivo do pacote
Garantir que a IA implemente o ERP JOGAB com máxima fidelidade à arquitetura definida, sem improvisar stack, rotas, organização por domínio ou regras centrais do negócio.

## Uso recomendado
- Use `CLAUDE.md` como instrução-base do agente.
- Use os arquivos da pasta `prompts/` por fase de implementação.
- Use `checklists/acceptance-checklist.md` para validar entregas.

## Estado atual do frontend

Todas as 8 fases do roadmap original estão completas, além de 14 fases de alinhamento/integração/qualidade. Os 15 módulos possuem pages, services, hooks, types e mock data implementados e todos estão integrados à API real com `withApiFallback`. A Fase 11 fechou os últimos módulos parciais. A Fase 12 adicionou mutations (POST/PUT) a Compras, Fiscal, Estoque, Medições e Relatórios. A Fase 13 corrigiu os contratos de mutation, expandiu a cobertura de testes para hooks de todos os módulos secundários e corrigiu a arquitetura de contexto global. A Fase 14 aplicou code-splitting com `React.lazy` em todas as páginas de módulo, adicionou `Suspense` boundary e atualizou a documentação completa da API (63 arquivos, 880 testes). Detalhes em `docs/08-roadmap.md`, `docs/18-qualidade-fase13.md` e `docs/19-estabilizacao-fase14.md`.

### Módulos implementados

| Módulo | Rota principal | Telas implementadas |
|--------|---------------|---------------------|
| Dashboard | `/dashboard` | Dashboard executivo com KPIs |
| Obras | `/obras` | Lista, workspace com 11 abas |
| RH | `/rh/funcionarios` | Lista, workspace do funcionário com 10 abas |
| Horas Extras | `/horas-extras` | Dashboard, aprovação, fechamento |
| FOPAG | `/fopag` | Lista de competências, detalhe com 7 abas |
| Compras | `/compras` | Lista, solicitações, cotações, pedidos, detalhe |
| Fiscal | `/fiscal` | Lista, entradas, saídas, detalhe do documento |
| Financeiro | `/financeiro` | Lista, fluxo de caixa, contas a pagar/receber, detalhe |
| Estoque | `/estoque` | Lista, movimentações, detalhe do item |
| Medições | `/medicoes` | Lista, detalhe da medição |
| Documentos | `/documentos` | Lista, detalhe do documento |
| Relatórios | `/relatorios` | Lista, relatórios por categoria |
| Administração | `/admin` | Painel, usuários, perfis, permissões, parâmetros, logs, integrações |
| Perfil | `/perfil` | Página do usuário |

> Rotas completas documentadas em `docs/06-arquitetura-de-telas.md`.

---

## Testes automatizados

### Infraestrutura
- **Framework:** Vitest + Testing Library (React) + jsdom
- **Config:** `frontend/vitest.config.ts`
- **Setup:** `frontend/src/test/setup.ts`

### Cobertura atual

| Categoria | Arquivos | Testes | Detalhes |
|-----------|----------|--------|----------|
| Normalização de services | 1 | 80 | 80 cenários cobrindo todos os 14 módulos |
| Validação Zod (schemas) | 4 | 101 | Schemas de Obras, RH, Compras, FOPAG |
| Páginas | 13 | 58 | Dashboard, Obras, RH, FOPAG, Compras, Horas Extras, Financeiro, Fiscal, Estoque, Medições, Documentos, Relatórios, Admin |
| Utilitários compartilhados | 5 | 109 | HTTP client (api.ts), helpers (utils.ts), módulo de integração (integration.ts), auth service, context service |
| Stores Zustand | 5 | 39 | contextStore, notificationStore, filtersStore, uiStore, drawerStore |
| Componentes compartilhados | 5 | 37 | KPISection, StatusBadge, EmptyState, PageHeader, FilterBar |
| Hooks TanStack Query | 15 | 60 | Dashboard, Obras, RH, FOPAG, Compras, HE + Financeiro, Fiscal, Estoque, Medições, Documentos, Relatorios, Admin (Fase 13) |
| Services de módulos | 15 | 396 | Obras, RH, HE, Compras (GET+POST+PUT), Fiscal (GET+POST+PUT), Estoque (GET+POST+PUT), Medições (GET+POST+PUT), Relatorios (GET+POST), Admin (GET+POST+PUT) |

**Total: 63 arquivos, 880 testes**

### Comandos

```bash
cd frontend
npm install
npm run test          # Vitest (todos os testes)
npm run test:watch    # Vitest (modo watch)
npm run build         # TypeScript + Vite build
npm run lint          # ESLint
```

### Gaps de cobertura restantes (pós-Fase 14)

- **Backend real:** Repositório sem diretório backend — testes de integração E2E dependem de backend funcional
- **Componentes específicos de módulo:** Filtros, tabelas e cards internos de cada módulo sem testes dedicados
- **Testes end-to-end:** Ainda sem testes E2E (Playwright/Cypress) — prioritário para próxima fase

---

## Preparação para integração (Fase 4 de alinhamento)

A Fase 4 preparou o frontend para conexão progressiva com backend real. Detalhes completos em `docs/10-readiness-modulos.md`.

### Camada HTTP reforçada

- `ApiError` tipado com classificação automática (network / timeout / http / html / payload / unknown)
- `classifyError()` e `normalizeApiError()` para tratamento uniforme
- Timeout configurável via `VITE_API_TIMEOUT` (padrão 15 000 ms)
- Fallback para timeout (`ECONNABORTED`) elegível para degradação para mock

### Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `VITE_API_URL` | `/api` | URL base da API |
| `VITE_API_FALLBACK` | `true` | Habilitar fallback para mock local quando API falha |
| `VITE_API_TIMEOUT` | `15000` | Timeout de requisição em ms |

Para desabilitar fallback e forçar API real: `VITE_API_FALLBACK=false`.

---

## Integração real incremental (Fases 5–14)

A Fase 5 conectou os três primeiros domínios à API real via `withApiFallback`. As fases seguintes completaram todos os 15 módulos. Detalhes completos em `docs/09-integracao-backend.md` e `docs/19-estabilizacao-fase14.md`.

### Endpoints efetivamente integrados (Fases 5–14)

| Módulo | Endpoint | Método | Descrição |
|--------|----------|--------|-----------|
| Auth | `/auth/login` | POST | Login com credenciais |
| Auth | `/auth/me` | GET | Restauração de sessão |
| Auth | `/auth/logout` | POST | Logout |
| Context | `/context/bootstrap` | GET | Bootstrap de contexto global |
| Context | `/context/options` | GET | Opções de contexto (selects) |
| Dashboard | `/dashboard/summary` | GET | Resumo executivo com KPIs |
| Obras | `/obras` | GET | Listagem de obras com filtros |
| Obras | `/obras/:id` | GET | Detalhe da obra |
| Obras | `/obras` | POST | Criar obra |
| Obras | `/obras/:id` | PUT | Atualizar obra |
| RH | `/rh/funcionarios` | GET | Listagem de funcionários |
| RH | `/rh/funcionarios/:id` | GET | Detalhe do funcionário |
| RH | `/rh/funcionarios` | POST | Criar funcionário |
| RH | `/rh/funcionarios/:id` | PUT | Atualizar funcionário |
| Horas Extras | `/horas-extras` | GET | Listagem de horas extras |
| Horas Extras | `/horas-extras/:id` | GET | Detalhe da hora extra |
| Horas Extras | `/horas-extras/dashboard` | GET | Dashboard de horas extras |
| Horas Extras | `/horas-extras/:id/aprovar` | POST | Aprovar hora extra |
| Horas Extras | `/horas-extras/fechamento` | POST | Fechar competência |
| Horas Extras | `/horas-extras/aprovacao` | GET | Dados de aprovação |
| FOPAG | `/fopag/competencias` | GET | Listagem de competências |
| FOPAG | `/fopag/competencias/:id` | GET | Detalhe da competência |
| Financeiro | `/financeiro/dashboard` | GET | Dashboard financeiro |
| Financeiro | `/financeiro/fluxo-caixa` | GET | Fluxo de caixa |
| Financeiro | `/financeiro/pessoal` | GET | Custos de pessoal |
| Financeiro | `/financeiro/contas-pagar` | GET | Contas a pagar |
| Financeiro | `/financeiro/contas-receber` | GET | Contas a receber |
| Financeiro | `/financeiro/titulos/:id` | GET | Detalhe de título |
| Compras | `/compras/solicitacoes` | GET | Listagem de solicitações |
| Compras | `/compras/cotacoes` | GET | Listagem de cotações |
| Compras | `/compras/pedidos` | GET | Listagem de pedidos |
| Compras | `/compras/pedidos/:id` | GET | Detalhe do pedido |
| Compras | `/compras/dashboard` | GET | Dashboard de compras |
| Compras | `/compras/solicitacoes` | POST/PUT | Criar/atualizar solicitação |
| Compras | `/compras/cotacoes` | POST/PUT | Criar/atualizar cotação |
| Compras | `/compras/pedidos` | POST/PUT | Criar/atualizar pedido |
| Fiscal | `/fiscal/dashboard` | GET | Dashboard fiscal |
| Fiscal | `/fiscal/entradas` | GET | Documentos de entrada |
| Fiscal | `/fiscal/saidas` | GET | Documentos de saída |
| Fiscal | `/fiscal/documentos/:id` | GET | Detalhe do documento |
| Fiscal | `/fiscal/documentos` | POST/PUT | Criar/atualizar documento |
| Relatórios | `/relatorios/dashboard` | GET | Dashboard de relatórios |
| Relatórios | `/relatorios/categorias/:categoria` | GET | Relatórios por categoria |
| Relatórios | `/relatorios/gerar` | POST | Gerar relatório |
| Estoque | `/estoque/dashboard` | GET | Dashboard de estoque |
| Estoque | `/estoque/movimentacoes` | GET | Listagem de movimentações |
| Estoque | `/estoque/itens/:id` | GET | Detalhe de item |
| Estoque | `/estoque/movimentacoes` | POST | Registrar movimentação |
| Estoque | `/estoque/itens/:id` | PUT | Atualizar item |
| Medições | `/medicoes/dashboard` | GET | Dashboard de medições |
| Medições | `/medicoes` | GET | Listagem de medições |
| Medições | `/medicoes/:id` | GET | Detalhe de medição |
| Medições | `/medicoes` | POST | Criar medição |
| Medições | `/medicoes/:id` | PUT | Atualizar medição |
| Medições | `/medicoes/:id/aprovar` | POST | Aprovar medição |
| Documentos | `/documentos/dashboard` | GET | Dashboard de documentos |
| Documentos | `/documentos/:id` | GET | Detalhe do documento |
| Documentos | `/documentos/upload` | POST | Upload de documento |
| Documentos | `/documentos/:id` | PUT | Atualizar documento |
| Admin | `/admin/dashboard` | GET | Dashboard administrativo |
| Admin | `/admin/usuarios` | GET/POST/PUT | Usuários |
| Admin | `/admin/perfis` | GET/POST/PUT | Perfis |
| Admin | `/admin/permissoes` | GET/PUT | Permissões |
| Admin | `/admin/parametros` | GET | Parâmetros |
| Admin | `/admin/logs` | GET | Logs de auditoria |
| Admin | `/admin/integracoes` | GET | Integrações |

### Status dos módulos

| Status | Módulos | Qtd |
|--------|---------|-----|
| ✅ Integrado | Auth, Contexto, Dashboard, Obras, RH, Horas Extras, FOPAG, Financeiro, Compras, Fiscal, Relatórios, Estoque, Medições, Documentos, Admin | 15 |

- **Integrado:** conectado à API real com `withApiFallback`, normalizers e testes.

**Total:** 61 endpoints integrados de 61 mapeados. Todos os módulos estão integrados. Detalhes em `docs/10-readiness-modulos.md`.

---

## Deploy

### Vercel (principal)
- **Config:** `frontend/vercel.json`
- SPA rewrite para `/index.html` (exclui rotas `/api/`)
- Deploy automático de preview por branch/PR

### Netlify (alternativa)
- **Config:** `netlify.toml` (raiz do repositório)
- Build: `npm run build` com base em `frontend/`
- Redirect SPA para `/index.html`
