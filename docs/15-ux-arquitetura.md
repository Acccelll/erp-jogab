# 15 — Estrutura de UX e Arquitetura de Interface (Etapa 4)

> Documento gerado na Etapa 4 — Consolidação da Experiência Global.

## Visão Geral

A Etapa 4 focou em reduzir a sensação de "ERP inchado" através de mudanças estruturais na navegação, organização de workspaces e definição de arquétipos de tela.

## 1. Navegação Global (Sidebar e Topbar)

### Sidebar com Hierarquia Visual
A Sidebar foi reorganizada para refletir a frequência de uso e a importância estratégica dos módulos:
-   **Tier 1 (Core)**: Dashboard e Obras (100% opacidade, ícones maiores).
-   **Tier 2 (Pessoas)**: Funcionários, Horas Extras e FOPAG (100% opacidade, foco operacional).
-   **Tier 3 (Operacional)**: Compras, Fiscal, Financeiro, Estoque, etc. (50% opacidade, redução de ruído visual).
-   **Tier 4 (Utility)**: Relatórios e Administração (30% opacidade, ícones menores).

### Topbar Compacta
-   Altura reduzida de `h-14` para `h-11` (e posteriormente `h-9` em algumas visualizações).
-   Breadcrumbs agora servem como bússola de localização, com destaque para a página ativa.

---

## 2. Arquétipos de Tela

Foram consolidados 3 padrões de experiência via componente `PageHeader`:

### A) Página Analítica (ex: Dashboard)
-   **Foco**: Decisão rápida.
-   **Interface**: Tipografia grande (`text-3xl`), espaçamento generoso (`py-8`), KPIs dominantes e conteúdo secundário rebaixado.

### B) Página Operacional (ex: Lista de Funcionários)
-   **Foco**: Produtividade e execução.
-   **Interface**: Topo compacto (`py-3`), 1 ação principal clara, tabela protagonista e filtros de acesso rápido.

### C) Workspace (ex: Obra Workspace)
-   **Foco**: Gestão de contexto profundo.
-   **Interface**: Header contextual resumido (`text-[11px]` uppercase), navegação interna por abas controlada e menos sensação de profundidade excessiva.

---

## 3. Workspace de Obra e Gestão de Abas

### OverflowTabs
Para resolver o problema do excesso de navegação horizontal no Workspace de Obra:
-   Implementação do componente `OverflowTabs`.
-   Exibe as **5 abas principais** (Resumo, Diário, Custos, Planejamento, Contratos).
-   Agrupa as demais abas em um menu "Mais", reduzindo a carga cognitiva e o transbordamento horizontal.

### Preenchimento de Lacunas
Implementação das páginas que estavam pendentes no workspace:
-   Contratos, RH, Estoque, Medições e Riscos.
-   Cada uma seguindo o padrão operacional dentro do contexto do workspace.

---

## 4. Auditoria de Complexidade Perceptiva

-   **Redução de Superfícies**: Menos bordas e sombras competindo; uso de `surface-raised` apenas onde necessário.
-   **Foco de Percurso**: O caminho do usuário (Breadcrumb + Sidebar Active State) está mais evidente.
-   **Consistência de Ações**: Botões de ação primária (Primary Action) agora possuem peso visual claramente distinto das ações secundárias (Secondary/Ghost).
