# 06 — Arquitetura de telas

## Rotas principais
- `/dashboard`
- `/obras`
- `/obras/:obraId/...`
- `/rh/funcionarios`
- `/horas-extras`
- `/fopag`
- `/compras`
- `/fiscal`
- `/financeiro`
- `/estoque`
- `/medicoes`
- `/documentos`
- `/relatorios`
- `/admin`
- `/perfil`

## Obra como workspace
A tela `/obras/:obraId` deve ter abas para:
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

## RH
- lista de funcionários
- detalhe do funcionário com abas
- alocações
- provisões

## Horas Extras
- dashboard
- lançamentos
- detalhe
- fechamento

## FOPAG
- lista de competências
- detalhe da competência com abas:
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
