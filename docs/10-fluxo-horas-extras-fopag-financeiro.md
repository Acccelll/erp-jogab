# 10 — Fluxo Horas Extras → FOPAG → Financeiro

## Visão geral

O fluxo **Horas Extras → FOPAG → Financeiro** é o caminho crítico de custo de pessoal no ERP JOGAB. Ele conecta o evento operacional (hora extra realizada em campo) à consolidação mensal da folha (FOPAG) e ao impacto financeiro no caixa da empresa e no custo da obra.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO HORAS EXTRAS → FOPAG → FINANCEIRO                 │
│                                                                                 │
│  ┌───────────────┐    ┌──────────────────┐    ┌───────────────────┐            │
│  │  HORAS EXTRAS  │───▶│      FOPAG        │───▶│    FINANCEIRO     │           │
│  │  (Operacional) │    │ (Consolidação)    │    │  (Desembolso)     │           │
│  └───────┬───────┘    └────────┬─────────┘    └────────┬──────────┘           │
│          │                     │                        │                       │
│  ┌───────▼───────┐    ┌───────▼──────────┐    ┌───────▼──────────┐            │
│  │ Lançamentos    │    │ Competências      │    │ Fluxo de caixa   │           │
│  │ por funcionário│    │ por funcionário   │    │ por obra          │           │
│  │ por obra       │    │ por obra          │    │ por centro custo  │           │
│  │ por tipo       │    │ por evento        │    │ por competência   │           │
│  │ por competência│    │ por centro custo  │    │                   │           │
│  └───────────────┘    └──────────────────┘    └───────────────────┘           │
│                                                                                 │
│  Campos compartilhados em todo o fluxo:                                        │
│  funcionarioId, obraId, centroCustoId, competencia, valorCalculado             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Diagrama de fluxo detalhado

```
                    ┌──────────────────────┐
                    │   DIGITAÇÃO DE HE    │
                    │  (operador em campo) │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  STATUS: digitada     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  STATUS: pendente_    │
                    │  aprovacao            │
                    └──────────┬───────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ STATUS: aprovada  │  │ STATUS: rejeitada │
          └────────┬─────────┘  └──────────────────┘
                   │
                   ▼
          ┌──────────────────────────────────────────────┐
          │          FECHAMENTO DA COMPETÊNCIA            │
          │  (ação em lote — fecha todos os aprovados)    │
          └────────────────────┬─────────────────────────┘
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │        STATUS: fechada_para_fopag             │
          │  (imutável — preparada para composição)       │
          └────────────────────┬─────────────────────────┘
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │              MÓDULO FOPAG                      │
          │                                                │
          │  Consome lançamentos com status:               │
          │  - aprovada (elegível)                         │
          │  - fechada_para_fopag (integrada)              │
          │  - enviada_para_fopag (integrada)              │
          │  - paga (integrada)                            │
          │                                                │
          │  Gera:                                         │
          │  - Previsão por funcionário                    │
          │  - Previsão por obra                           │
          │  - Previsão por centro de custo                │
          │  - Eventos consolidados (SAL, HE, BEN, ENC)   │
          │  - Rateio por obra/centro de custo             │
          └────────────────────┬─────────────────────────┘
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │        STATUS: enviada_para_fopag             │
          └────────────────────┬─────────────────────────┘
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │            MÓDULO FINANCEIRO                   │
          │                                                │
          │  Consome dados consolidados da FOPAG:          │
          │  - Desembolso previsto vs. realizado           │
          │  - Custo de pessoal por obra                   │
          │  - Valor de HE integradas                      │
          │  - Encargos e benefícios                       │
          │                                                │
          │  Alimenta:                                     │
          │  - Fluxo de caixa                              │
          │  - Custo de pessoal (visão financeira)         │
          │  - Custo da obra                               │
          └────────────────────┬─────────────────────────┘
                               │
                               ▼
          ┌──────────────────────────────────────────────┐
          │            STATUS: paga                        │
          │  (ciclo completo — evento realizado)           │
          └──────────────────────────────────────────────┘
```

---

## Transições de status

### Status de Horas Extras

| Status                | Descrição                                           | Transição permitida            |
|-----------------------|-----------------------------------------------------|--------------------------------|
| `digitada`            | Lançamento criado pelo operador                     | → `pendente_aprovacao`         |
| `pendente_aprovacao`  | Aguardando aprovação do gestor                      | → `aprovada` ou `rejeitada`    |
| `aprovada`            | Aprovada pelo gestor — elegível para fechamento     | → `fechada_para_fopag`         |
| `rejeitada`           | Rejeitada pelo gestor — fora do fluxo               | (terminal)                     |
| `fechada_para_fopag`  | Competência fechada — imutável, pronta para FOPAG   | → `enviada_para_fopag`         |
| `enviada_para_fopag`  | Dados consumidos pela FOPAG na consolidação mensal  | → `paga`                       |
| `paga`                | Ciclo completo — refletida no financeiro            | (terminal)                     |
| `cancelada`           | Cancelada administrativamente                       | (terminal)                     |

### Conjuntos de status usados pelo `workforceCost.ts`

```typescript
// Elegíveis para composição da FOPAG (aparecem nas projeções)
const HE_ELIGIVEIS_FOPAG = new Set([
  'aprovada',
  'fechada_para_fopag',
  'enviada_para_fopag',
  'paga',
]);

// Efetivamente integradas à FOPAG (valor realizado)
const HE_INTEGRADAS_FOPAG = new Set([
  'fechada_para_fopag',
  'enviada_para_fopag',
  'paga',
]);
```

A diferença entre **elegível** e **integrada** é fundamental:
- **Elegível** = pode ser incluída na projeção da FOPAG (valor previsto)
- **Integrada** = já foi processada pelo fechamento da competência (valor realizado)

---

## Campos compartilhados entre módulos

Os três módulos compartilham campos-chave que garantem rastreabilidade ponta a ponta:

| Campo              | HE   | FOPAG | Financeiro | Descrição                               |
|--------------------|------|-------|------------|-----------------------------------------|
| `funcionarioId`    | ✓    | ✓     | —          | Identificador do funcionário            |
| `funcionarioNome`  | ✓    | ✓     | —          | Nome desnormalizado para exibição       |
| `matricula`        | ✓    | ✓     | —          | Matrícula do funcionário                |
| `cargo`            | ✓    | ✓     | —          | Cargo no momento do lançamento          |
| `obraId`           | ✓    | ✓     | ✓          | Obra onde a hora extra foi realizada    |
| `obraNome`         | ✓    | ✓     | ✓          | Nome desnormalizado da obra             |
| `centroCustoId`    | ✓    | ✓     | ✓          | Centro de custo de alocação             |
| `centroCustoNome`  | ✓    | ✓     | ✓          | Nome desnormalizado do centro de custo  |
| `competencia`      | ✓    | ✓     | ✓          | Competência no formato `YYYY-MM`        |
| `valorCalculado`   | ✓    | →     | →          | Valor monetário da hora extra           |
| `salarioBase`      | —    | ✓     | →          | Salário base do funcionário             |
| `horasExtrasValor` | →    | ✓     | ✓          | Soma das HE por funcionário/obra        |
| `valorPrevisto`    | —    | ✓     | ✓          | Projeção de desembolso                  |
| `valorRealizado`   | —    | ✓     | ✓          | Valor efetivamente processado           |
| `status`           | ✓    | ✓     | —          | Status do lançamento/competência        |

**Legenda:** ✓ = campo presente no módulo; → = valor derivado do módulo anterior; — = não presente.

---

## Pontos de integração

### 1. Horas Extras → FOPAG

**Momento:** Fechamento da competência no módulo de Horas Extras.

**Dados transferidos:**
- Lista de lançamentos com `status ∈ HE_ELIGIVEIS_FOPAG`
- Agrupados por `funcionarioId` e `competencia`
- Totalizados por `valorCalculado`

**Ação no FOPAG:**
- `buildFopagCompetenciaSnapshot(competencia)` consome os dados
- Gera previsão por funcionário (salário base + HE + benefícios - descontos)
- Gera previsão por obra (agrupamento dos funcionários alocados)
- Gera eventos consolidados (SAL, HE, BEN, ENC)
- Gera rateio por obra/centro de custo

**Contrato atual:**

```typescript
// Entrada (filtrado de mockHorasExtras)
interface HoraExtraParaFopag {
  funcionarioId: string;
  funcionarioNome: string;
  matricula: string;
  cargo: string;
  obraId: string;
  obraNome: string;
  centroCustoId: string;
  centroCustoNome: string;
  competencia: string;
  valorCalculado: number;
  status: StatusHoraExtra;
}

// Saída (gerada por buildFopagCompetenciaSnapshot)
interface FopagFuncionarioSnapshot {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  matricula: string;
  cargo: string;
  obraPrincipalId: string;
  obraPrincipalNome: string;
  salarioBase: number;
  horasExtrasValor: number;
  beneficiosValor: number;
  descontosValor: number;
  valorPrevisto: number;
  valorRealizado: number;
}
```

### 2. FOPAG → Financeiro

**Momento:** Consulta do módulo Financeiro ao custo de pessoal.

**Dados transferidos:**
- Desembolso previsto vs. realizado da competência
- Valor de horas extras integradas
- Encargos e benefícios consolidados
- Detalhamento por obra com percentual de participação

**Contrato atual:**

```typescript
// Gerado pelo buildFopagCompetenciaSnapshot
interface FopagFinanceiroSnapshot {
  valorPrevistoDesembolso: number;
  valorRealizadoDesembolso: number;
  valorEncargos: number;
  valorBeneficios: number;
  valorHorasExtrasIntegradas: number;
  principalSaida: string;
}
```

### 3. Horas Extras + FOPAG → Custo da Obra

**Momento:** Consulta do workspace da obra ao custo de pessoal.

**Função:** `getObraLaborCostSnapshot(obraId, competencia)`

**Dados gerados:**

```typescript
interface ObraLaborCostSnapshot {
  competencia: string;
  equipeAtiva: number;
  totalHorasExtras: number;       // horas (quantidade)
  custoHorasExtras: number;        // valor monetário
  fopagPrevista: number;
  fopagRealizada: number;
  custoTotalPessoal: number;       // fopag + HE
}
```

### 4. Visão financeira consolidada de pessoal

**Função:** `buildWorkforceFinancialSummary(competencia)`

**Dados gerados:**

```typescript
interface WorkforceFinancialSummary {
  competencia: string;
  totalFuncionarios: number;
  totalObras: number;
  totalCentrosCusto: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorPrevisto: number;            // total geral
  valorRealizado: number;           // total geral
  variacao: number;                 // previsto - realizado
  statusFechamento: 'aberta' | 'fechada';
  origemHorasExtras: {
    totalLancamentos: number;
    totalLancamentosElegiveis: number;
    totalLancamentosIntegrados: number;
  };
  porObra: ObraWorkforceSummary[];
  porCentroCusto: CentroCustoWorkforceSummary[];
}
```

---

## O papel da biblioteca `workforceCost.ts`

O arquivo `shared/lib/workforceCost.ts` é a **ponte de dados** entre os três módulos. Ele centraliza a lógica de composição que, no futuro, será substituída por endpoints de API.

### Funções exportadas

| Função                             | Consumidor principal | Descrição                                                        |
|------------------------------------|----------------------|------------------------------------------------------------------|
| `buildFopagCompetenciaSnapshot`    | Módulo FOPAG         | Gera snapshot completo da competência com funcionários, obras, eventos, rateios e dados financeiros |
| `getObraLaborCostSnapshot`         | Workspace da Obra    | Gera resumo de custo de pessoal da obra em uma competência       |
| `buildWorkforceFinancialSummary`   | Módulo Financeiro    | Gera visão financeira consolidada de pessoal por competência     |

### Fluxo interno de dados

```
mockHorasExtras ──────┐
                       │
mockFuncionarios ──────┤
                       ▼
              ┌─────────────────────────────┐
              │   buildFopagCompetenciaSnapshot    │
              │                                     │
              │  1. Filtra HE por competência       │
              │  2. Separa elegíveis e integradas    │
              │  3. Agrupa por funcionário            │
              │     (salário + HE + benefícios)      │
              │  4. Agrupa por obra                   │
              │     (total func + valores)            │
              │  5. Calcula rateio por CC             │
              │  6. Gera eventos (SAL, HE, BEN, ENC) │
              │  7. Monta projeção financeira         │
              │  8. Monta previsto vs. realizado       │
              └──────────┬──────────────────────────┘
                         │
            ┌────────────┼────────────────┐
            ▼            ▼                ▼
    FOPAG Detalhe   Obra Workspace   Financeiro
    (competência)   (custo pessoal)  (desembolso)
```

### Regras de negócio implementadas

1. **Salário base:** Obtido do cadastro do funcionário; se indisponível, estimado a partir de `valorCalculado * 12`
2. **Benefícios:** 12% do salário base (mock — parametrizável no futuro)
3. **Descontos:** 5% do salário base (mock — parametrizável no futuro)
4. **Encargos:** 22% sobre (salário base + horas extras)
5. **Valor previsto:** salário + HE + benefícios + encargos - descontos
6. **Valor realizado:** ~97.5% a 98.5% do previsto (mock — substituir por valor real)
7. **Rateio por obra:** Proporcional ao número de lançamentos HE por obra/CC
8. **Percentual de participação:** Proporção do valor previsto da obra sobre o total

---

## Alinhamento de tipos

Os tipos estão bem estruturados e distribuídos nos módulos corretos:

| Tipo                            | Localização                           | Usado por            |
|---------------------------------|---------------------------------------|----------------------|
| `HoraExtraLancamento`          | `modules/horas-extras/types`          | HE, workforceCost    |
| `StatusHoraExtra`              | `modules/horas-extras/types`          | HE, workforceCost    |
| `FopagCompetenciaDetalhe`      | `modules/fopag/types`                 | FOPAG                |
| `FopagCompetenciaListItem`     | `modules/fopag/types`                 | FOPAG                |
| `Funcionario`                  | `modules/rh/types`                    | RH, workforceCost    |
| `AlocacaoResumo`               | `shared/types`                        | RH, Obras, HE        |

A biblioteca `workforceCost.ts` acessa dados mock diretamente. Na migração para API real, essas funções devem ser substituídas por chamadas de API que retornem os mesmos shapes.

---

## Riscos e recomendações

### Riscos identificados

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| `workforceCost.ts` acessa mocks diretamente | Alto — acoplamento a dados locais | Substituir por chamadas de API; manter interface de saída |
| Valores de benefícios/descontos/encargos são hardcoded | Médio — imprecisão em produção | Parametrizar no backend via tabela de configuração |
| Valor realizado é estimado (% do previsto) | Alto — dados incorretos | Backend deve retornar valor realizado real do sistema de folha |
| Rateio proporcional por contagem de HE | Médio — pode não refletir custo real | Backend deve usar critério configurável (valor, horas, headcount) |
| Não há validação de competência fechada antes de nova HE | Médio — inconsistência temporal | Backend deve impedir lançamento em competência fechada |

### Recomendações para implementação do backend

1. **Manter os shapes de saída:** As interfaces TypeScript do frontend são o contrato. O backend deve retornar dados no mesmo formato.

2. **Evento `fechada_para_fopag` deve ser uma transação atômica:** Ao fechar a competência, todos os lançamentos aprovados devem mudar de status em uma única transação do banco.

3. **A FOPAG deve consumir dados via view materializada ou stored procedure:** O cálculo de `buildFopagCompetenciaSnapshot` é complexo e deve ser otimizado no banco.

4. **Implementar audit trail:** Toda transição de status deve gerar registro de auditoria (já modelado no mock de `horas-extras-aprovacao.mock`).

5. **Separar previsto de realizado:** O frontend já distingue esses dois conceitos. O backend deve ter colunas separadas para valores previstos e realizados.

6. **Parametrizar percentuais:** Encargos (22%), benefícios (12%), descontos (5%) devem vir de uma tabela de configuração editável pelo módulo de Administração.

7. **Endpoints de consolidação:** Criar endpoints dedicados para as três funções de `workforceCost.ts`:
   - `GET /fopag/competencias/:id/snapshot` → equivale a `buildFopagCompetenciaSnapshot`
   - `GET /obras/:obraId/custo-pessoal` → equivale a `getObraLaborCostSnapshot`
   - `GET /financeiro/pessoal` → equivale a `buildWorkforceFinancialSummary`

8. **Validações de negócio no backend:**
   - Não permitir aprovação de HE em competência fechada
   - Não permitir fechamento sem HE aprovadas
   - Não permitir reabrir competência com HE já enviadas para FOPAG
   - Validar que o funcionário está alocado na obra informada na HE
