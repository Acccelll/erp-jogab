# 13 — Integração Fase 7: RH mutações + Horas Extras

## Resumo

A Fase 7 completa o módulo RH com mutações reais (POST/PUT) e integra o módulo Horas Extras de ponta a ponta (listagem, detalhe, dashboard, aprovação, fechamento e dados de aprovação). Todos os endpoints usam `withApiFallback` para manter o fallback mock controlado.

## Endpoints integrados na Fase 7

| Módulo | Endpoint | Método | Status | Descrição |
|--------|----------|--------|--------|-----------|
| RH | `/rh/funcionarios` | POST | ✅ Integrado | Criar funcionário |
| RH | `/rh/funcionarios/:id` | PUT | ✅ Integrado | Atualizar funcionário |
| Horas Extras | `/horas-extras` | GET | ✅ Integrado | Listagem com filtros e KPIs |
| Horas Extras | `/horas-extras/:id` | GET | ✅ Integrado | Detalhe da hora extra |
| Horas Extras | `/horas-extras/dashboard` | GET | ✅ Integrado | Dashboard de horas extras |
| Horas Extras | `/horas-extras/:id/aprovar` | POST | ✅ Integrado | Aprovar lançamento |
| Horas Extras | `/horas-extras/fechamento` | POST | ✅ Integrado | Fechar competência |
| Horas Extras | `/horas-extras/aprovacao` | GET | ✅ Integrado | Dados de aprovação |

## Total acumulado de endpoints integrados

| Fase | Módulo | Endpoints | Descrição |
|------|--------|-----------|-----------|
| 5 | Auth | 3 | login, me, logout |
| 5 | Context | 2 | bootstrap, options |
| 5 | Dashboard | 1 | summary |
| 6 | Obras | 4 | list, detail, create, update |
| 6 | RH (leitura) | 2 | list, detail |
| **7** | **RH (mutações)** | **2** | **create, update** |
| **7** | **Horas Extras** | **6** | **list, detail, dashboard, aprovar, fechamento, aprovacao** |
| | **Total** | **20** | |

## Padrão de integração

Todos os endpoints seguem o mesmo padrão das Fases 5 e 6:

### Mutações RH (POST/PUT)

```typescript
export async function createFuncionario(payload: FuncionarioCreatePayload): Promise<FuncionarioMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(RH_API_ENDPOINTS.create, payload);
      return unwrapApiResponse<FuncionarioMutationResponse>(response.data);
    },
    () => createFuncionarioMock(payload),
  );
}

export async function updateFuncionario(payload: FuncionarioUpdatePayload): Promise<FuncionarioMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.put(RH_API_ENDPOINTS.update(payload.id), payload);
      return unwrapApiResponse<FuncionarioMutationResponse>(response.data);
    },
    () => updateFuncionarioMock(payload),
  );
}
```

### Leitura Horas Extras (GET)

```typescript
export async function fetchHorasExtras(filters?: HorasExtrasFiltersData): Promise<HorasExtrasListResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_API_ENDPOINTS.list, { params: filters });
      const raw = unwrapApiResponse<HorasExtrasListResponse>(response.data);
      return normalizeHorasExtrasListResponse(raw);
    },
    () => fetchHorasExtrasMock(filters),
  );
}
```

### Ações Horas Extras (POST)

```typescript
export async function approveHoraExtra(id: string): Promise<HoraExtraMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(HORAS_EXTRAS_API_ENDPOINTS.aprovar(id));
      return unwrapApiResponse<HoraExtraMutationResponse>(response.data);
    },
    () => approveHoraExtraServiceMock(id),
  );
}

export async function fecharCompetenciaHorasExtras(competencia: string): Promise<HorasExtrasFechamentoResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(HORAS_EXTRAS_API_ENDPOINTS.fechamento, { competencia });
      return unwrapApiResponse<HorasExtrasFechamentoResponse>(response.data);
    },
    () => fecharCompetenciaHorasExtrasMock(competencia),
  );
}
```

## Normalizers

### normalizeHorasExtrasDashboardData

Garante que a resposta da API sempre conforma o contrato `HorasExtrasDashboardData`:

| Campo | Default | Tipo |
|-------|---------|------|
| `list` | `[]` | `HoraExtraListItem[]` |
| `kpis.totalLancamentos` | `0` | `number` |
| `kpis.pendentesAprovacao` | `0` | `number` |
| `kpis.aprovadas` | `0` | `number` |
| `kpis.fechadasParaFopag` | `0` | `number` |
| `kpis.horasTotais` | `0` | `number` |
| `kpis.valorTotal` | `0` | `number` |
| `resumoCards` | `[]` | `HoraExtraResumoCard[]` |
| `fechamentoAtual` | `null` | `FechamentoCompetencia | null` |

### normalizeHorasExtrasAprovacaoData

Garante que a resposta da API sempre conforma o contrato `HorasExtrasAprovacaoData`:

| Campo | Default | Tipo |
|-------|---------|------|
| `kpis.pendentes` | `0` | `number` |
| `kpis.emRisco` | `0` | `number` |
| `kpis.valorPendente` | `0` | `number` |
| `kpis.obrasImpactadas` | `0` | `number` |
| `resumoCards` | `[]` | `HoraExtraAprovacaoResumoCard[]` |
| `aprovacoes` | `[]` | `HoraExtraAprovacaoItem[]` |
| `historico` | `[]` | `HoraExtraHistoricoItem[]` |

## Validação de mutações RH

As mutações de RH incluem validação de:
- **Matrícula única:** duplicata gera erro
- **CPF único:** duplicata gera erro
- **Consistência de alocação:** obra e centro de custo devem ser compatíveis
- **Status desligado:** preenche `dataDesligamento` automaticamente

## Testes adicionados na Fase 7

| Arquivo | Testes | Descrição |
|---------|--------|-----------|
| `funcionarios.service.test.ts` | +8 | Mutações RH: create, update, duplicate CPF, desligamento, reflexo em fetch |
| `horasExtras.service.test.ts` | 20 | Endpoints, normalizer dashboard, list, detail, fechamentos, dashboard, approve, close |
| `horasExtrasAprovacao.service.test.ts` | 9 | Endpoint, normalizer aprovação, fetch com/sem competência |
| `integration.test.ts` (atualizado) | +3 | RH completo, HE integrado, 6 módulos integrados |

**Total da Fase 7: 553 testes em 46 arquivos (vs 514 em 44 da Fase 6)**

## Tratamento de erros

O tratamento de erros permanece idêntico ao das Fases 5 e 6:

| Cenário | Comportamento |
|---------|---------------|
| API responde com sucesso | Usa dados reais, normaliza payload |
| API retorna 401 | Limpa token, redireciona para `/login` |
| API retorna 400/403/409 | Propaga `ApiError` com tipo `http` |
| API retorna 5xx | Fallback para mock (se `VITE_API_FALLBACK=true`) |
| Timeout (ECONNABORTED) | Fallback para mock |
| Erro de rede (sem resposta) | Fallback para mock |
| API retorna HTML | Fallback para mock (detectado por `isHtmlPayload`) |

## Fluxo HE → FOPAG → Financeiro (preparação)

### Dados que Horas Extras alimentam para FOPAG

Quando uma competência de Horas Extras é fechada (`fecharCompetenciaHorasExtras`):

1. Os lançamentos aprovados recebem status `fechada_para_fopag`
2. O fechamento gera um registro `FechamentoCompetencia` com:
   - `competencia` (YYYY-MM)
   - `status` (fechada)
   - `totalLancamentos`, `totalHoras`, `valorTotal`
   - `dataFechamento`
3. Esses dados são consultados por FOPAG via `GET /fopag/competencias`

### Contratos e dependências preservados

| Origem | Destino | Contrato | Status |
|--------|---------|----------|--------|
| HE fechamento | FOPAG competências | `FechamentoCompetencia` → `FopagCompetencia` | Ready |
| FOPAG competência | Financeiro pessoal | `FopagCompetencia.valorTotal` → custo de pessoal | Ready |
| HE lançamentos | FOPAG detalhe | `HoraExtraListItem[]` por competência | Ready |

### Ordem recomendada para Fase 8

1. **FOPAG** — integrar `GET /fopag/competencias` e `GET /fopag/competencias/:id`
2. **Financeiro** — integrar dashboard e custos de pessoal (dados vindos de FOPAG)
3. **Compras** — fluxo de 3 etapas independente

## Arquivos alterados na Fase 7

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| `frontend/src/shared/lib/integration.ts` | Modificado | RH completo + HE marcados como integrated |
| `frontend/src/shared/lib/integration.test.ts` | Modificado | Testes atualizados para 6 módulos integrados |
| `frontend/src/modules/rh/services/funcionarios.service.test.ts` | Modificado | +8 testes de mutações (create, update, error) |
| `frontend/src/modules/horas-extras/services/horasExtras.service.test.ts` | Criado | 20 testes do service de Horas Extras |
| `frontend/src/modules/horas-extras/services/horasExtrasAprovacao.service.test.ts` | Criado | 9 testes do service de aprovação |
| `docs/08-roadmap.md` | Modificado | Fase 7 registrada |
| `docs/10-readiness-modulos.md` | Modificado | RH e HE como integrados |
| `docs/13-integracao-fase7.md` | Criado | Documentação completa da integração |
| `README.md` | Modificado | Contagem de testes e status atualizado |
