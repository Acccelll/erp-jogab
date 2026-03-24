# 05 — Arquitetura frontend

## Stack
- React 19
- Vite
- TypeScript (strict)
- React Router v7
- Axios
- TanStack Query v5
- Zustand v5
- React Hook Form
- Zod
- Tailwind CSS v4
- shadcn/ui
- TanStack Table
- Recharts
- Lucide React

## Organização
Arquitetura por domínio.

## Estrutura de pastas principal
```
src/
├── app/
│   ├── guards/        # AuthGuard, PermissionGuard
│   ├── layouts/       # AppLayout, AuthLayout, ModuleLayout, ObraWorkspaceLayout, Sidebar, Topbar
│   ├── pages/         # LoginPage
│   ├── providers/     # QueryProvider
│   ├── router/        # Definição centralizada de rotas
│   └── App.tsx
├── modules/           # 14 módulos por domínio
│   ├── dashboard/
│   ├── obras/
│   ├── rh/
│   ├── horas-extras/
│   ├── fopag/
│   ├── compras/
│   ├── fiscal/
│   ├── financeiro/
│   ├── estoque/
│   ├── medicoes/
│   ├── documentos/
│   ├── relatorios/
│   ├── admin/
│   └── perfil/
├── shared/
│   ├── components/    # PageHeader, ContextBar, KPISection, FilterBar, etc.
│   ├── hooks/         # usePermissions
│   ├── lib/           # api.ts, utils.ts, auth.service.ts, context.service.ts, etc.
│   ├── stores/        # Zustand stores globais
│   └── types/         # Tipos compartilhados
├── test/              # Setup de testes (Vitest)
└── assets/
```

Cada módulo segue a estrutura interna:
```
modules/<dominio>/
├── components/       # Componentes específicos do domínio
├── data/             # Mock data
├── hooks/            # TanStack Query hooks e hooks de filtro
├── pages/            # Páginas do módulo (+ testes)
├── services/         # Services de fetch (preparados para API real)
├── types/            # Types e schemas Zod do domínio
└── index.ts          # Barrel exports
```

## Layouts obrigatórios
- `AuthLayout` — layout centralizado para login
- `AppLayout` — Sidebar + Topbar + ContextBar + SideDrawer + conteúdo
- `ModuleLayout` — wrapper pass-through para conteúdo do módulo
- `ObraWorkspaceLayout` — header da obra + 11 abas + conteúdo da aba

## Guards de rota
- `AuthGuard` — protege rotas autenticadas, redireciona para `/login`
- `PermissionGuard` — controle de acesso por permissão

## Stores globais (Zustand)
- `authStore` — autenticação, usuário e token (persistido)
- `contextStore` — empresa, filial, obra, competência, período, centro de custo (persistido)
- `uiStore` — estado da sidebar (open/collapsed)
- `filtersStore` — filtros por módulo
- `notificationStore` — fila de notificações/toasts
- `drawerStore` — estado do SideDrawer global

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

## Utilitários compartilhados (shared/lib)
- `api.ts` — cliente HTTP Axios com interceptors, fallback para mock, detecção de HTML responses
- `auth.service.ts` — autenticação mock (preparado para API real)
- `context.service.ts` — gestão de contexto global
- `utils.ts` — utilitários gerais (cn, formatCurrency, etc.)
- `erpRelations.ts` — mapeamento de relacionamentos entre entidades do ERP
- `executiveInsights.ts` — geração de insights para dashboard executivo
- `workforceCost.ts` — cálculos de custo de mão de obra

## Padrão de normalização
Todos os services de módulos prioritários possuem funções de normalização explícitas que aceitam `unknown` e retornam arrays/objetos tipados com defaults seguros. Isso protege contra payloads parciais ou malformados da API.

## Testes automatizados

### Infraestrutura
- **Framework:** Vitest + Testing Library (React) + jsdom
- **Config:** `frontend/vitest.config.ts`
- **Setup:** `frontend/src/test/setup.ts`
- **Padrão de arquivo:** `*.test.ts` / `*.test.tsx` co-localizados com o código testado

### Cobertura atual
- 36 arquivos de teste, 384 testes
- Testes de normalização de services (80 cenários cobrindo todos os 14 módulos)
- Testes de validação Zod (schemas de Obras, RH, Compras, FOPAG)
- Testes de páginas com estados de loading, erro, dados e vazio
- Testes de stores Zustand, hooks TanStack Query e utilitários compartilhados
- Testes do cliente HTTP (unwrapApiResponse, normalizeApiError, shouldFallbackToMock, withApiFallback)

### Comandos
```bash
npm run test          # Vitest (run mode)
npm run test:watch    # Vitest (watch mode)
```

## Deploy

### Vercel (principal)
- **Config:** `frontend/vercel.json`
- SPA rewrite para `/index.html` (exclui `/api/`, `/assets/`, `/favicon.ico`, `/vite.svg`)
- Deploy automático de preview por branch/PR

### Netlify (alternativa)
- **Config:** `netlify.toml` (raiz do repositório)
- Build: `npm run build` com base em `frontend/` e publish `dist/`
- Redirect SPA para `/index.html`

## Qualidade de código
- **Prettier:** formatação automática (singleQuote, printWidth 120, trailingComma all)
- **ESLint:** linting com suporte TypeScript + React hooks + Prettier integration
- **Husky:** pre-commit hook via lint-staged
- **TypeScript strict:** sem `any` solto, tipagem forte em services e types
