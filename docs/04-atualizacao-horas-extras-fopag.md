# 04 — Atualização Horas Extras e FOPAG

## Horas Extras
### Objetivo
Controlar, aprovar, calcular e apropriar horas extras com reflexo em RH, FOPAG, custo da obra e previsões financeiras.

### Submódulos
- regras de horas extras
- lançamento
- aprovação
- fechamento por competência
- consolidação por funcionário
- consolidação por obra
- integração com FOPAG
- integração com financeiro
- relatórios

### Tipos suportados
- HE 50%
- HE 100%
- HE noturna
- adicional noturno
- domingo
- feriado
- tipos parametrizáveis

### Status
- digitada
- pendente_aprovacao
- aprovada
- rejeitada
- fechada_para_fopag
- enviada_para_fopag
- paga
- cancelada

## FOPAG
### Objetivo
Consolidar a previsão mensal da folha por competência.

### Estrutura conceitual
- competência
- previsão por funcionário
- eventos da folha
- consolidação por obra
- consolidação por centro de custo
- comparação previsto x realizado

### Fontes de alimentação
- cadastro do funcionário
- histórico salarial
- benefícios
- férias
- 13º
- rescisões
- provisões
- horas extras aprovadas

### Regras
- separar folha prevista de realizada
- permitir visão por obra
- gerar previsão de desembolso ao financeiro
