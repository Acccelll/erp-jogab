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

## Objetivo do pacote
Garantir que a IA implemente o ERP JOGAB com máxima fidelidade à arquitetura definida, sem improvisar stack, rotas, organização por domínio ou regras centrais do negócio.

## Uso recomendado
- Use `CLAUDE.md` como instrução-base do agente.
- Use os arquivos da pasta `prompts/` por fase de implementação.
- Use `checklists/acceptance-checklist.md` para validar entregas.

## Estratégia recomendada
1. Estrutura base do frontend
2. Layout global e navegação
3. Módulo Obras
4. RH
5. Horas Extras
6. FOPAG
7. Compras
8. Fiscal
9. Financeiro
10. Estoque
11. Medições
12. Documentos, relatórios e administração
