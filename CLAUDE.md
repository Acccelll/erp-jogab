# CLAUDE.md

Você está implementando o frontend do **ERP JOGAB**.

## Antes de qualquer alteração
Leia obrigatoriamente, nesta ordem:
1. `JOGAB_MASTER_SPEC.md`
2. `docs/01-visao-geral.md`
3. `docs/02-arquitetura-tecnica.md`
4. `docs/03-banco-de-dados.md`
5. `docs/04-atualizacao-horas-extras-fopag.md`
6. `docs/05-arquitetura-frontend.md`
7. `docs/06-arquitetura-de-telas.md`
8. `docs/07-regras-de-implementacao.md`
9. `docs/08-roadmap.md`
10. `docs/10-readiness-modulos.md`
11. `docs/18-qualidade-fase13.md` (se existir)
12. `docs/19-estabilizacao-fase14.md` (se existir)
13. `docs/15-ux-arquitetura.md` (se existir)
14. `docs/15-integracao-fase10.md` (se existir)
15. `docs/16-integracao-fase9.md` (se existir)

## Regras obrigatórias
- Não mude a stack definida.
- Não mude a arquitetura por domínio.
- Não elimine o contexto global de obra/filial/competência.
- Não simplifique Horas Extras ou FOPAG para versões reduzidas.
- Não crie rotas fora do padrão definido.
- Não use arquitetura improvisada de componentes.
- Não misture componentes compartilhados com componentes específicos de domínio sem necessidade.
- Não remova a centralidade da Obra.
- Não altere contratos de navegação sem refletir isso na arquitetura de telas.

## Como trabalhar
- Implemente em lotes pequenos.
- Explique rapidamente o plano antes de codar.
- Liste arquivos criados e alterados ao final.
- Aponte dúvidas estruturais apenas se bloquearem a implementação.
- Se houver conflito entre documentos, priorize nesta ordem:
  1. `JOGAB_MASTER_SPEC.md`
  2. `docs/05-arquitetura-frontend.md`
  3. `docs/06-arquitetura-de-telas.md`
  4. `docs/02-arquitetura-tecnica.md`
  5. `docs/03-banco-de-dados.md`
  6. `docs/04-atualizacao-horas-extras-fopag.md`

## Stack obrigatória
- React
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- TanStack Table
- Recharts

## Estrutura obrigatória
- `src/app`
- `src/modules`
- `src/shared`
- `src/assets`

## Layout obrigatório
O shell autenticado é composto por:
- `AppLayout` — layout raiz: Sidebar + Topbar + ContextBar + Outlet + SideDrawer
- `Sidebar` — navegação lateral (52px colapsado, 220px expandido)
- `Topbar` — barra superior com breadcrumbs, ações, notificações e menu do usuário
- `ContextBar` — barra de contexto global (Empresa, Filial, Obra, Centro de Custo, Competência) — renderizada no AppLayout, abaixo da Topbar
- `ModuleLayout` — wrapper de módulos com padding e scroll
- `ObraWorkspaceLayout` — layout do workspace de obra com `ObraHeader` + `OverflowTabs` (7 abas visíveis)

> **Regra:** `ContextBar` é renderizado globalmente no `AppLayout`. Páginas individuais **não** devem renderizar `ContextBar` diretamente — ele já está no shell.

## Padrão de tela obrigatório
Cada tela principal deve seguir a ordem:
1. `PageHeader` (quando aplicável)
2. `FilterBar` / `QuickFilterChips`
3. `KPISection` (quando aplicável)
4. `MainContent` (tabela, cards, gráficos)
5. `SideDrawer` quando aplicável

## Critérios mínimos de qualidade
- TypeScript sem tipagem solta desnecessária
- Componentes reutilizáveis
- Rotas nomeadas conforme documentação
- Estados de loading, erro e vazio
- Navegação coerente entre módulos relacionados
- Sem hardcode desnecessário de regras de negócio
