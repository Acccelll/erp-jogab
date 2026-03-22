# ERP JOGAB — instruções para agentes

## Visão curta do projeto
- ERP web para construção civil.
- O frontend já é modular e navegável; a próxima fase prioriza contratos técnicos e integrações reais.
- A **Obra** é a entidade central do sistema e deve permanecer no centro dos fluxos.

## Módulo central do ERP
- **Obras** é o núcleo funcional.
- RH é o segundo domínio prioritário para as próximas sprints.
- Qualquer mudança que afete contexto, navegação ou contratos deve preservar a centralidade de Obras.

## Convenções de edição
- Trabalhe por domínio em `frontend/src/modules/<dominio>`.
- Prefira mudanças pequenas, localizadas e verificáveis.
- Reutilize tipos, hooks e services existentes antes de criar novos arquivos.
- Ao consolidar contratos, prefira reduzir duplicação a introduzir novas abstrações amplas.
- Mantenha comentários curtos e úteis, especialmente quando um service mock já estiver preparado para troca futura por API real.

## Regras obrigatórias
- **Não faça refatoração ampla** sem pedido explícito.
- **Não recrie arquitetura** do projeto.
- **Não altere layout/UI** sem necessidade direta da task.
- **Não implemente backend completo** em tasks de fundação técnica.
- Entre “preservar código residual” e “fazer compilar/testar”, escolha compilar/testar.

## Arquitetura a preservar
- Stack: React + Vite + TypeScript + React Router + TanStack Query + Zustand + React Hook Form + Zod + Tailwind.
- Estrutura principal:
  - `frontend/src/app`
  - `frontend/src/modules`
  - `frontend/src/shared`
- Manter arquitetura **modular por domínio**.
- Evitar espalhar contratos de domínio fora do módulo, salvo tipos realmente compartilhados.

## Como trabalhar nas tasks
- Quebre o trabalho em steps pequenos e testáveis.
- Faça primeiro o menor ajuste que destrave a compilação/consistência.
- Se houver shapes divergentes dentro do mesmo domínio, consolide no menor número razoável de definições.
- Se algo estiver incompleto, prefira desativar temporariamente o ponto quebrado a inventar funcionalidade nova.

## Comandos obrigatórios de validação
No frontend, rode ao final de tasks que alterem código:

```bash
cd frontend
npm install
npm run build
npm run lint
```

Se a task envolver inicialização local ou rota quebrada, valide também:

```bash
npm run dev
```

## Padrão de entrega final
- Diagnóstico curto do problema/tarefa.
- Lista objetiva de arquivos alterados.
- O que foi criado, consolidado, removido ou desativado.
- Resultado exato dos comandos de validação.
- Riscos, pendências e próximos passos, quando existirem.

## Observações para próximas sprints
- Obras e RH devem ser tratados como contratos-base para futura integração com API.
- Services mockados devem continuar funcionais, mas preparados para troca por `api.ts` sem retrabalho desnecessário.
- Payloads de criação/edição devem ficar explícitos em tipos/schemas, mesmo quando ainda não houver mutação real implementada.
