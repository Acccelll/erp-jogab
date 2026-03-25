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

## Objetivo do pacote
Garantir que a IA implemente o ERP JOGAB com máxima fidelidade à arquitetura definida, sem improvisar stack, rotas, organização por domínio ou regras centrais do negócio.

## Uso recomendado
- Use `CLAUDE.md` como instrução-base do agente.
- Use os arquivos da pasta `prompts/` por fase de implementação.
- Use `checklists/acceptance-checklist.md` para validar entregas.

## Estado atual do frontend

Todas as 8 fases do roadmap original estão completas. Os 14 módulos possuem páginas, services, hooks, types e mock data implementados. Detalhes em `docs/08-roadmap.md`.

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
| Utilitários compartilhados | 3 | 72 | HTTP client (api.ts), helpers (utils.ts), módulo de integração (integration.ts) |
| Stores Zustand | 5 | 39 | contextStore, notificationStore, filtersStore, uiStore, drawerStore |
| Componentes compartilhados | 5 | 37 | KPISection, StatusBadge, EmptyState, PageHeader, FilterBar |
| Hooks TanStack Query | 6 | 23 | Dashboard, Obras, RH, FOPAG, Compras, Horas Extras |

**Total: 37 arquivos, 410 testes**

### Comandos

```bash
cd frontend
npm install
npm run test          # Vitest (todos os testes)
npm run test:watch    # Vitest (modo watch)
npm run build         # TypeScript + Vite build
npm run lint          # ESLint
```

### Gaps de cobertura restantes

- **Backend:** Repositório sem diretório backend — testes de integração de API dependem da implementação do backend
- **Hooks de módulos secundários:** Hooks de Financeiro, Fiscal, Estoque, Medições, Documentos, Relatórios e Admin sem testes unitários isolados
- **Componentes específicos de módulo:** Filtros, tabelas e cards internos de cada módulo sem testes dedicados
- **Testes end-to-end:** Ainda sem testes de integração E2E

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

### Readiness por módulo

| Status | Módulos | Qtd |
|--------|---------|-----|
| ✅ Ready | Dashboard, Obras, RH, Horas Extras, FOPAG, Compras, Financeiro, Fiscal, Relatórios | 9 |
| 🟡 Partial | Estoque, Medições, Documentos, Admin | 4 |

**Total:** 45 endpoints prontos de 48 mapeados. Detalhes em `docs/10-readiness-modulos.md`.

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
