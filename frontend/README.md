# ERP JOGAB — Frontend

Frontend do ERP JOGAB para gestão integrada de construção civil.

## Stack Tecnológica

| Tecnologia               | Uso                                   |
| ------------------------ | ------------------------------------- |
| React 19                 | Biblioteca de UI                      |
| Vite                     | Build tool e dev server               |
| TypeScript (strict)      | Tipagem estática                      |
| React Router v7          | Roteamento SPA                        |
| TanStack Query v5        | Cache e gerenciamento de dados da API |
| Zustand v5               | Estado global (auth, contexto, UI)    |
| Tailwind CSS v4          | Estilização utilitária                |
| shadcn/ui                | Componentes base (previsto)           |
| React Hook Form + Zod    | Formulários com validação             |
| TanStack Table           | Tabelas avançadas                     |
| Recharts                 | Gráficos e KPIs                       |
| Axios                    | Cliente HTTP                          |
| Lucide React             | Ícones                                |
| Vitest + Testing Library | Testes automatizados                  |
| Prettier + ESLint        | Formatação e linting                  |
| Husky + lint-staged      | Pre-commit hooks                      |

## Estrutura do Projeto

```
src/
├── app/                    # Aplicação (guards, layouts, pages, router, providers)
│   ├── guards/             # AuthGuard, PermissionGuard
│   ├── layouts/            # AppLayout, AuthLayout, ModuleLayout, ObraWorkspaceLayout
│   ├── pages/              # LoginPage
│   ├── providers/          # QueryProvider (TanStack Query)
│   ├── router/             # Definição centralizada de rotas
│   └── App.tsx             # Entry component
├── modules/                # Módulos por domínio
│   ├── dashboard/          # Dashboard Executivo
│   ├── obras/              # Obras (núcleo central)
│   ├── rh/                 # Recursos Humanos
│   ├── horas-extras/       # Horas Extras
│   ├── fopag/              # Folha de Pagamento
│   ├── compras/            # Compras
│   ├── fiscal/             # Fiscal
│   ├── financeiro/         # Financeiro
│   ├── estoque/            # Estoque
│   ├── medicoes/           # Medições e Faturamento
│   ├── documentos/         # Gestão Documental
│   ├── relatorios/         # Relatórios
│   ├── admin/              # Administração
│   └── perfil/             # Perfil do Usuário
├── shared/                 # Código compartilhado
│   ├── components/         # Componentes reutilizáveis (PageHeader, ContextBar, etc.)
│   ├── hooks/              # Hooks compartilhados
│   ├── lib/                # Utilitários (cn, formatCurrency, api, auth, etc.)
│   ├── stores/             # Zustand stores globais
│   └── types/              # Tipos TypeScript compartilhados
├── test/                   # Setup de testes (Vitest)
└── assets/                 # Imagens e ícones estáticos
```

Cada módulo segue a estrutura:

```
modules/<dominio>/
├── components/       # Componentes específicos do domínio
├── data/             # Mock data
├── hooks/            # TanStack Query hooks e hooks de filtro
├── pages/            # Páginas do módulo (+ testes)
├── services/         # Services de fetch (mock, preparados para API real)
├── types/            # Types e schemas Zod do domínio
└── index.ts          # Barrel exports
```

## Módulos do ERP

| Módulo        | Rota principal               | Status                                                                        |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| Dashboard     | `/dashboard`                 | ✅ Implementado                                                               |
| Obras         | `/obras`, `/obras/:obraId/*` | ✅ Implementado (11 abas)                                                     |
| RH            | `/rh/funcionarios`           | ✅ Implementado (10 abas do funcionário)                                      |
| Horas Extras  | `/horas-extras`              | ✅ Implementado (dashboard, aprovação, fechamento)                            |
| FOPAG         | `/fopag`                     | ✅ Implementado (7 abas da competência)                                       |
| Compras       | `/compras`                   | ✅ Implementado (solicitações, cotações, pedidos)                             |
| Fiscal        | `/fiscal`                    | ✅ Implementado (entradas, saídas, detalhe)                                   |
| Financeiro    | `/financeiro`                | ✅ Implementado (fluxo, contas, detalhe)                                      |
| Estoque       | `/estoque`                   | ✅ Implementado (movimentações, detalhe)                                      |
| Medições      | `/medicoes`                  | ✅ Implementado (lista, detalhe)                                              |
| Documentos    | `/documentos`                | ✅ Implementado (lista, detalhe)                                              |
| Relatórios    | `/relatorios`                | ✅ Implementado (lista, por categoria)                                        |
| Administração | `/admin`                     | ✅ Implementado (usuários, perfis, permissões, parâmetros, logs, integrações) |
| Perfil        | `/perfil`                    | ✅ Implementado                                                               |

> Rotas completas em `docs/06-arquitetura-de-telas.md`.

## Conceito Central

A **Obra** é o núcleo do sistema. Cada obra funciona como um workspace com 11 abas:
Visão Geral, Cronograma, Contratos, Equipe, RH, Compras, Financeiro, Estoque, Medições, Documentos e Riscos.

## Contexto Global

O sistema mantém um contexto global ativo (persistido) com:

- **Empresa** — empresa selecionada
- **Filial** — filial da empresa
- **Obra** — obra ativa (central no ERP)
- **Competência** — mês/ano de referência (formato YYYY-MM)

## Stores Globais (Zustand)

| Store               | Responsabilidade                                                          |
| ------------------- | ------------------------------------------------------------------------- |
| `authStore`         | Autenticação, usuário e token (persistido)                                |
| `contextStore`      | Empresa, filial, obra, competência, período, centro de custo (persistido) |
| `uiStore`           | Estado da sidebar (open/collapsed)                                        |
| `filtersStore`      | Filtros por módulo                                                        |
| `notificationStore` | Fila de notificações/toasts                                               |
| `drawerStore`       | Estado do SideDrawer global                                               |

## Layouts

- **AppLayout** — Sidebar + Topbar + ContextBar + SideDrawer + conteúdo
- **AuthLayout** — Layout centralizado para login
- **ModuleLayout** — Wrapper de conteúdo do módulo (pass-through)
- **ObraWorkspaceLayout** — Header da obra + abas + conteúdo da aba

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção (tsc + vite)
npm run lint         # Linting com ESLint
npm run test         # Testes com Vitest
npm run test:watch   # Testes em modo watch
npm run preview      # Preview do build
npm run format       # Formatação com Prettier
npm run format:check # Verificar formatação
```

## Testes

- **Framework:** Vitest + Testing Library + jsdom
- **Total:** 10 arquivos, 128 testes
- **Padrão:** testes co-localizados com o código (`*.test.ts` / `*.test.tsx`)
- **Cobertura:** cliente HTTP, normalização de services, páginas de lista (loading/erro/dados/vazio)

## Deploy

- **Vercel:** `vercel.json` com SPA rewrite (exclui `/api/`)
- **Netlify:** `netlify.toml` como alternativa

## Padrão de Tela

Cada tela principal segue a composição:

1. `PageHeader` — título, subtítulo, ações
2. `ContextBar` — selects de empresa/filial/obra/competência
3. `FilterBar` — filtros específicos do módulo
4. `KPISection` — cards de indicadores
5. `MainContent` — conteúdo principal (tabelas, formulários)
6. `SideDrawer` — painel lateral contextual

## Observações sobre o estado atual

- Todos os modules usam **dados mock** via services simulados. Services estão preparados para troca por API real sem retrabalho.
- Services possuem **normalização explícita** para resiliência a payloads parciais.
- Páginas implementam padrão de **safe-access** com fallback para arrays/objetos vazios.
- **Backend ainda não implementado** — repositório sem diretório backend.
- Rotas de lançamento individual de Horas Extras (`/horas-extras/lancamentos`, `/horas-extras/:lancamentoId`) estão pendentes (ver `docs/06-arquitetura-de-telas.md`).
