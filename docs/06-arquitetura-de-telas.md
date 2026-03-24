# 06 — Arquitetura de telas

## Rotas oficiais do frontend

### Autenticação
- `/login` — tela de login (AuthLayout)

### Dashboard
- `/dashboard` — dashboard executivo

### Obras (núcleo central)
- `/obras` — lista de obras
- `/obras/:obraId` — workspace da obra (abas abaixo)
  - `/obras/:obraId` (index) — visão geral
  - `/obras/:obraId/cronograma`
  - `/obras/:obraId/contratos`
  - `/obras/:obraId/equipe`
  - `/obras/:obraId/rh`
  - `/obras/:obraId/compras`
  - `/obras/:obraId/financeiro`
  - `/obras/:obraId/estoque`
  - `/obras/:obraId/medicoes`
  - `/obras/:obraId/documentos`
  - `/obras/:obraId/riscos`

### RH
- `/rh` — redirect para `/rh/funcionarios`
- `/rh/funcionarios` — lista de funcionários
- `/rh/funcionarios/:funcId` — detalhe do funcionário (abas abaixo)
  - `/rh/funcionarios/:funcId` (index) — visão geral
  - `/rh/funcionarios/:funcId/contrato`
  - `/rh/funcionarios/:funcId/historico-salarial`
  - `/rh/funcionarios/:funcId/documentos`
  - `/rh/funcionarios/:funcId/alocacoes`
  - `/rh/funcionarios/:funcId/ferias`
  - `/rh/funcionarios/:funcId/decimo-terceiro`
  - `/rh/funcionarios/:funcId/provisoes`
  - `/rh/funcionarios/:funcId/horas-extras`
  - `/rh/funcionarios/:funcId/fopag`

### Horas Extras
- `/horas-extras` — dashboard de horas extras
- `/horas-extras/fechamento` — fechamento por competência
- `/horas-extras/aprovacao` — aprovação de lançamentos

### FOPAG
- `/fopag` — lista de competências
- `/fopag/:competenciaId` — detalhe da competência (abas abaixo)
  - `/fopag/:competenciaId` (index) — visão geral
  - `/fopag/:competenciaId/funcionarios`
  - `/fopag/:competenciaId/obras`
  - `/fopag/:competenciaId/eventos`
  - `/fopag/:competenciaId/rateio`
  - `/fopag/:competenciaId/financeiro`
  - `/fopag/:competenciaId/previsto-realizado`

### Compras
- `/compras` — lista/dashboard de compras
- `/compras/solicitacoes` — solicitações de compra
- `/compras/cotacoes` — cotações
- `/compras/pedidos` — pedidos de compra
- `/compras/pedidos/:pedidoId` — detalhe do pedido

### Fiscal
- `/fiscal` — lista/dashboard fiscal
- `/fiscal/entradas` — notas fiscais de entrada
- `/fiscal/saidas` — notas fiscais de saída
- `/fiscal/documentos/:documentoId` — detalhe do documento fiscal

### Financeiro
- `/financeiro` — lista/dashboard financeiro
- `/financeiro/fluxo` — fluxo de caixa
- `/financeiro/contas-pagar` — contas a pagar
- `/financeiro/contas-receber` — contas a receber
- `/financeiro/titulos/:tituloId` — detalhe do título financeiro

### Estoque
- `/estoque` — lista de itens em estoque
- `/estoque/movimentacoes` — movimentações de estoque
- `/estoque/itens/:itemId` — detalhe do item

### Medições e Faturamento
- `/medicoes` — lista de medições
- `/medicoes/:medicaoId` — detalhe da medição

### Documentos
- `/documentos` — lista de documentos
- `/documentos/:documentoId` — detalhe do documento

### Relatórios
- `/relatorios` — lista de relatórios disponíveis
- `/relatorios/:categoria` — relatórios por categoria

### Administração
- `/admin` — painel de administração
- `/admin/usuarios` — gestão de usuários
- `/admin/perfis` — gestão de perfis de acesso
- `/admin/permissoes` — gestão de permissões
- `/admin/parametros` — parâmetros do sistema
- `/admin/logs` — logs de auditoria
- `/admin/integracoes` — integrações externas

### Perfil
- `/perfil` — perfil do usuário logado

### Catch-all
- `/*` — página 404 (NotFoundPage)

## Obra como workspace

A tela `/obras/:obraId` funciona como workspace completo com 11 abas:
- visão geral
- cronograma
- contratos
- equipe
- RH
- compras
- financeiro
- estoque
- medições
- documentos
- riscos

## Funcionário como workspace

A tela `/rh/funcionarios/:funcId` funciona como workspace com 10 abas:
- visão geral
- contrato
- histórico salarial
- documentos
- alocações
- férias
- décimo terceiro
- provisões
- horas extras
- fopag

## Horas Extras
- dashboard com KPIs e resumo
- aprovação de lançamentos
- fechamento por competência

> **Nota:** Rotas de lançamento individual (`/horas-extras/lancamentos`, `/horas-extras/:lancamentoId`) estão previstas no spec original mas ainda não implementadas. Devem ser adicionadas em sprint futura.

## FOPAG
- lista de competências
- detalhe da competência com 7 abas:
  - visão geral
  - por funcionário
  - por obra
  - eventos
  - rateio
  - financeiro
  - previsto x realizado

## Padrão técnico de tela
- `PageHeader`
- `ContextBar`
- `Filters`
- `KPISection`
- `MainContent`
- `SideDrawer`
