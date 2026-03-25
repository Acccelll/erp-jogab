# 14 — Integração FOPAG e Financeiro (Fase 8)

> Documento gerado na Fase 8 — Integração da cadeia de Custos de Pessoal.

## Visão geral

A Fase 8 focou na integração dos módulos de **FOPAG (Folha de Pagamento)** e **Financeiro**, completando a cadeia de dados que se inicia no fechamento das Horas Extras.

## Objetivos alcançados

1.  **Integração FOPAG**: Listagem e detalhe de competências integrados com a API real via `withApiFallback`.
2.  **Integração Financeiro**: Dashboard financeiro completo e views de fluxo de caixa, contas a pagar/receber integradas.
3.  **Cadeia de Dados**: Verificação de que o fechamento em Horas Extras reflete corretamente na FOPAG e, por consequência, no dashboard Financeiro (campo `pessoal`).
4.  **Resiliência**: Implementação de normalizadores e testes de fallback para garantir funcionamento mesmo com instabilidade na API.

---

## Endpoints integrados

### FOPAG
- `GET /fopag/competencias`: Listagem de competências.
- `GET /fopag/competencias/:id`: Detalhe da competência (funcionários e rubricas).

### Financeiro
- `GET /financeiro/dashboard`: Visão consolidada (integrada com dados de FOPAG).
- `GET /financeiro/fluxo-caixa`: Projeções de caixa.
- `GET /financeiro/pessoal`: Detalhamento dos custos vindos da folha.
- `GET /financeiro/contas-pagar`: Títulos a pagar.
- `GET /financeiro/contas-receber`: Títulos a receber.
- `GET /financeiro/titulos/:id`: Detalhe do título.

---

## Cadeia de dados verificada

A integração foi validada seguindo o fluxo:
1.  **Horas Extras**: Competência fechada gera dados para FOPAG.
2.  **FOPAG**: Processa os valores e disponibiliza para consulta analítica.
3.  **Financeiro**: Consome o totalizador da FOPAG para compor o DRE e o fluxo de caixa operacional.

**Script de validação visual**: `verify_phase8_chain.py` (Playwright) confirmou que os dados transitam corretamente entre as telas sem quebras de layout.

---

## Testes automatizados

Foram adicionados testes unitários para os novos serviços integrados:
- `fopag.service.test.ts`: 17 testes (sucesso, fallback 503, timeout).
- `financeiro.service.test.ts`: 22 testes (abrangendo todas as views e normalização).

Total de testes no projeto: **555** (todos passando).

---

## Como testar a integração

1.  Certifique-se que o backend está rodando ou use as variáveis de ambiente para fallback:
    ```env
    VITE_API_URL=http://localhost:3000/api
    VITE_API_FALLBACK=true
    ```
2.  Navegue para **RH > FOPAG** para ver as competências.
3.  Navegue para **Financeiro > Dashboard** para ver o impacto nos custos de pessoal.
