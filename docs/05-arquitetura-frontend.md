# 05 — Arquitetura frontend

## Stack
- React
- Vite
- TypeScript
- React Router
- Axios
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- TanStack Table
- Recharts

## Organização
Arquitetura por domínio.

## Estrutura de pastas principal
- `src/app`
- `src/modules`
- `src/shared`
- `src/assets`

## Layouts obrigatórios
- `AuthLayout`
- `AppLayout`
- `ModuleLayout`
- `ObraWorkspaceLayout`

## Stores globais sugeridas
- `authStore`
- `uiStore`
- `contextStore`
- `filtersStore`
- `notificationStore`
- `drawerStore`

## Contexto global
Deve existir contexto ativo com:
- empresa
- filial
- obra ativa
- competência ativa
- período ativo
- centro de custo ativo

## Regras de dados
- TanStack Query para dados da API
- Zustand para estado global e contexto
- React Hook Form + Zod para formulários
