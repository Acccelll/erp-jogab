# 03 — Banco de dados

## Conceitos obrigatórios
- Obra como pivô relacional
- Centro de custo, conta contábil e competência como campos recorrentes
- Histórico por vigência
- Origem de lançamento rastreável
- Status padronizados

## Entidades-base críticas
- obra
- obra_contrato
- obra_cronograma
- funcionario
- funcionario_historico_salarial
- funcionario_alocacao
- solicitacao_compra
- pedido_compra
- documento_fiscal
- titulo_financeiro
- estoque_movimento
- medicao
- documento_entidade
- log_auditoria

## Regra de frontend derivada do banco
Toda tela transacional deve estar preparada para exibir:
- status
- origem
- obra
- centro de custo
- competência
- histórico ou rastreabilidade
