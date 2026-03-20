# ERP JOGAB — Frontend

Frontend do ERP JOGAB para gestão integrada de construção civil.

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca de UI |
| Vite | Build tool e dev server |
| TypeScript (strict) | Tipagem estática |
| React Router v7 | Roteamento SPA |
| TanStack Query v5 | Cache e gerenciamento de dados da API |
| Zustand v5 | Estado global (auth, contexto, UI) |
| Tailwind CSS v4 | Estilização utilitária |
| shadcn/ui | Componentes base (previsto) |
| React Hook Form + Zod | Formulários com validação |
| TanStack Table | Tabelas avançadas |
| Recharts | Gráficos e KPIs |
| Axios | Cliente HTTP |
| Lucide React | Ícones |

## Estrutura do Projeto

```
src/
├── app/                    # Aplicação (layouts, router, providers)
│   ├── layouts/            # AppLayout, AuthLayout, ModuleLayout, ObraWorkspaceLayout
│   ├── providers/          # QueryProvider (TanStack Query)
│   ├── router/             # Definição de rotas
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
│   ├── lib/                # Utilitários (cn, formatCurrency, api)
│   ├── stores/             # Zustand stores globais
│   └── types/              # Tipos TypeScript compartilhados
└── assets/                 # Imagens e ícones estáticos
```

## Módulos do ERP

| Módulo | Rota | Fase |
|---|---|---|
| Dashboard | `/dashboard` | 3 |
| Obras | `/obras`, `/obras/:obraId/*` | 3 |
| RH | `/rh/funcionarios` | 3 |
| Horas Extras | `/horas-extras` | 4 |
| FOPAG | `/fopag` | 5 |
| Compras | `/compras` | 6 |
| Fiscal | `/fiscal` | 6 |
| Financeiro | `/financeiro` | 7 |
| Estoque | `/estoque` | 7 |
| Medições | `/medicoes` | 7 |
| Documentos | `/documentos` | 8 |
| Relatórios | `/relatorios` | 8 |
| Administração | `/admin` | 8 |
| Perfil | `/perfil` | 8 |

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

| Store | Responsabilidade |
|---|---|
| `authStore` | Autenticação, usuário e token (persistido) |
| `contextStore` | Empresa, filial, obra, competência, período, centro de custo (persistido) |
| `uiStore` | Estado da sidebar (open/collapsed) |
| `filtersStore` | Filtros por módulo |
| `notificationStore` | Fila de notificações/toasts |
| `drawerStore` | Estado do SideDrawer global |

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
npm run preview      # Preview do build
```

## Padrão de Tela

Cada tela principal segue a composição:
1. `PageHeader` — título, subtítulo, ações
2. `ContextBar` — selects de empresa/filial/obra/competência
3. `FilterBar` — filtros específicos do módulo
4. `KPISection` — cards de indicadores
5. `MainContent` — conteúdo principal (tabelas, formulários)
6. `SideDrawer` — painel lateral contextual

## Fase Atual

**Fase 2** — Layout, navegação, contexto global e consistência visual (completa).

### Entregues na Fase 2
- AppLayout com Sidebar + Topbar + ContextBar + SideDrawer
- Sidebar dark com 14 itens em 3 grupos (Geral, Operacional, Gerencial)
- Sidebar collapsível, auto-close em mobile, active state por rota
- Topbar com breadcrumbs, busca (placeholder), notificações e dropdown de usuário
- ContextBar funcional com selects de empresa/filial/obra/competência (mock data)
- ContextBar responsiva com scroll horizontal em mobile
- Indicador visual de contexto ativo
- ModuleLayout simplificado como wrapper pass-through
- ObraWorkspaceLayout com header, 11 abas e sync automático do contexto
- Página 404/NotFound com navegação de volta
- Placeholders visuais para todos os 14 módulos
- Placeholders para todas as 11 abas da obra
- 6 Zustand stores globais (auth, context, UI, filters, notification, drawer)
- Tema JOGAB com cores brand, sidebar dark, tokens semânticos
- README do frontend substituído

Próxima: **Fase 3** — Dashboard, Obras e RH.
