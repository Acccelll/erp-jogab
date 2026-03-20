# JOGAB_MASTER_SPEC

## Missão do projeto
Implementar o ERP JOGAB para construção civil com foco em controle de recursos, custos por obra, previsibilidade financeira e integração entre módulos.

## Princípios não negociáveis
1. A **Obra** é a entidade central do ERP.
2. O frontend deve seguir **React + Vite + TypeScript + React Router + TanStack Query + Zustand + React Hook Form + Zod + Tailwind CSS + shadcn/ui**.
3. A arquitetura frontend deve ser **por domínio**, não por páginas soltas.
4. O sistema deve preservar **histórico, rastreabilidade e contexto**.
5. Horas Extras e FOPAG são módulos formais do sistema.
6. A UI deve operar com **sidebar + topbar + context bar + layouts padronizados + navegação encadeada**.
7. A tela da obra deve funcionar como **workspace central**.
8. O banco e o frontend devem respeitar os conceitos de **planejado, comprometido e realizado**.
9. Não simplificar, remover ou fundir módulos sem autorização explícita.
10. Não alterar nomenclaturas centrais sem autorização explícita.

## Módulos oficiais
- Dashboard
- Obras
- Recursos Humanos
- Horas Extras
- FOPAG
- Compras
- Fiscal
- Financeiro
- Estoque
- Medições e Faturamento
- Documentos
- Relatórios
- Administração
- Perfil

## Núcleo conceitual
- A Obra concentra custos, equipe, compras, fiscal, financeiro, estoque, medições e documentos.
- RH é a origem cadastral e trabalhista.
- Hora Extra nasce como evento operacional.
- FOPAG consolida folha prevista por competência.
- Financeiro reflete previsões e realizados.

## Diretrizes de implementação
- Entregar em fases pequenas e verificáveis.
- Sempre listar arquivos criados/alterados.
- Sempre justificar desvios necessários.
- Nunca reescrever a arquitetura base.
- Preferir componentes reutilizáveis.
- Usar tipagem forte em TypeScript.
- Evitar duplicação de regras visuais e de domínio.

## Ordem de leitura obrigatória
1. `CLAUDE.md`
2. `docs/01-visao-geral.md`
3. `docs/02-arquitetura-tecnica.md`
4. `docs/03-banco-de-dados.md`
5. `docs/04-atualizacao-horas-extras-fopag.md`
6. `docs/05-arquitetura-frontend.md`
7. `docs/06-arquitetura-de-telas.md`
8. `docs/07-regras-de-implementacao.md`
9. `docs/08-roadmap.md`

## Saída esperada do agente
Para cada etapa, o agente deve entregar:
- resumo do que entendeu
- plano curto de execução
- arquivos criados/alterados
- implementação
- pendências
- riscos ou decisões tomadas
