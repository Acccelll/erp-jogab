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
- `AppLayout`
- `Sidebar`
- `Topbar`
- `ContextBar`
- `ModuleLayout`
- `ObraWorkspaceLayout`

## Padrão de tela obrigatório
Cada tela principal deve seguir a ordem:
1. `PageHeader`
2. `ContextBar`
3. `FilterBar`
4. `KPISection`
5. `MainContent`
6. `SideDrawer` quando aplicável

## Critérios mínimos de qualidade
- TypeScript sem tipagem solta desnecessária
- Componentes reutilizáveis
- Rotas nomeadas conforme documentação
- Estados de loading, erro e vazio
- Navegação coerente entre módulos relacionados
- Sem hardcode desnecessário de regras de negócio
