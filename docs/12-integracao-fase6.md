# 12 — Integração Fase 6: Obras + RH (leitura)

## Resumo

A Fase 6 integra o módulo Obras de ponta a ponta com a API real e inicia a integração parcial de RH (somente leitura). Todos os endpoints usam `withApiFallback` para manter o fallback mock controlado.

## Endpoints integrados na Fase 6

| Módulo | Endpoint | Método | Status | Descrição |
|--------|----------|--------|--------|-----------|
| Obras | `/obras` | GET | ✅ Integrado | Listagem de obras com filtros |
| Obras | `/obras/:id` | GET | ✅ Integrado | Detalhe da obra |
| Obras | `/obras` | POST | ✅ Integrado | Criar obra |
| Obras | `/obras/:id` | PUT | ✅ Integrado | Atualizar obra |
| RH | `/rh/funcionarios` | GET | ✅ Integrado | Listagem de funcionários |
| RH | `/rh/funcionarios/:id` | GET | ✅ Integrado | Detalhe do funcionário |

## Endpoints ainda não integrados de RH

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/rh/funcionarios` | POST | 🔵 Ready | Criar funcionário (aguardando Fase 7) |
| `/rh/funcionarios/:id` | PUT | 🔵 Ready | Atualizar funcionário (aguardando Fase 7) |

## Total acumulado de endpoints integrados

| Fase | Módulo | Endpoints | Descrição |
|------|--------|-----------|-----------|
| 5 | Auth | 3 | login, me, logout |
| 5 | Context | 2 | bootstrap, options |
| 5 | Dashboard | 1 | summary |
| **6** | **Obras** | **4** | **list, detail, create, update** |
| **6** | **RH** | **2** | **list, detail** |
| | **Total** | **12** | |

## Padrão de integração

Todos os endpoints seguem o mesmo padrão da Fase 5:

```typescript
export async function fetchObras(filters?: ObraFiltersData): Promise<ObrasListResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRAS_API_ENDPOINTS.list, { params: filters });
      const raw = unwrapApiResponse<ObrasListResponse>(response.data);
      return normalizeObrasListResponse(raw);
    },
    () => fetchObrasMock(filters),
  );
}
```

### Mutações (POST/PUT)

```typescript
export async function createObra(payload: ObraCreatePayload): Promise<ObraMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(OBRAS_API_ENDPOINTS.create, payload);
      return unwrapApiResponse<ObraMutationResponse>(response.data);
    },
    () => createObraMock(payload),
  );
}
```

## Normalizers

### normalizeObrasListResponse

Garante que a resposta da API sempre conforma o contrato `ObrasListResponse`:

| Campo | Default | Tipo |
|-------|---------|------|
| `data` | `[]` | `ObraListItem[]` |
| `kpis.totalObras` | `0` | `number` |
| `kpis.obrasAtivas` | `0` | `number` |
| `kpis.obrasConcluidas` | `0` | `number` |
| `kpis.obrasParalisadas` | `0` | `number` |
| `kpis.orcamentoTotal` | `0` | `number` |
| `kpis.custoRealizadoTotal` | `0` | `number` |
| `total` | `0` | `number` |

### normalizeFuncionariosListResponse

Garante que a resposta da API sempre conforma o contrato `FuncionariosListResponse`:

| Campo | Default | Tipo |
|-------|---------|------|
| `data` | `[]` | `FuncionarioListItem[]` |
| `kpis.totalFuncionarios` | `0` | `number` |
| `kpis.ativos` | `0` | `number` |
| `kpis.afastados` | `0` | `number` |
| `kpis.ferias` | `0` | `number` |
| `kpis.desligados` | `0` | `number` |
| `kpis.custoFolhaEstimado` | `0` | `number` |
| `total` | `0` | `number` |

## Validação Zod

Os schemas Zod continuam validando os dados de formulário:

- `obraFormSchema` — campos obrigatórios para criação/edição de obra
- `obraStatusSchema` — enum de status válidos
- `obraTipoSchema` — enum de tipos válidos
- `obraFiltersSchema` — filtros de listagem

## Workspace da Obra

O workspace `/obras/:obraId` com 11 abas continua funcional com `withApiFallback`:

| Aba | Endpoint | Status |
|-----|----------|--------|
| Visão Geral | `/obras/:id` + `/obras/:id/kpis` + `/obras/:id/resumo-blocos` | ✅ |
| Cronograma | `/obras/:id/cronograma` | ✅ |
| Equipe | `/obras/:id/equipe` | ✅ |
| Compras | `/obras/:id/compras` | ✅ |
| Financeiro | `/obras/:id/financeiro` | ✅ |
| Documentos | `/obras/:id/documentos` | ✅ |
| Contratos | `/obras/:id/contratos` | ✅ |
| Estoque | `/obras/:id/estoque` | ✅ |
| Medições | `/obras/:id/medicoes` | ✅ |
| RH | `/obras/:id/rh` | ✅ |
| Riscos | `/obras/:id/riscos` | ✅ |

## Testes adicionados na Fase 6

| Arquivo | Testes | Descrição |
|---------|--------|-----------|
| `obras.service.test.ts` | 24 | Normalizer, endpoints, CRUD, filtros, referências |
| `obra-workspace.service.test.ts` | 12 | Endpoints workspace, 10 abas |
| `useObraDetails.test.tsx` | 5 | Hook de detalhe (loading, error, success, undefined) |
| `useObraMutations.test.tsx` | 4 | Hooks de criação e atualização |
| `funcionarios.service.test.ts` | 17 | Normalizer RH, endpoints, listagem, detalhe |
| `integration.test.ts` (atualizado) | +5 | Obras e RH integrados no registry |

**Total da Fase 6: 514 testes em 44 arquivos (vs 447 em 39 da Fase 5)**

## Tratamento de erros

O tratamento de erros permanece idêntico ao da Fase 5:

| Cenário | Comportamento |
|---------|---------------|
| API responde com sucesso | Usa dados reais, normaliza payload |
| API retorna 401 | Limpa token, redireciona para `/login` |
| API retorna 400/403/409 | Propaga `ApiError` com tipo `http` |
| API retorna 5xx | Fallback para mock (se `VITE_API_FALLBACK=true`) |
| Timeout (ECONNABORTED) | Fallback para mock |
| Erro de rede (sem resposta) | Fallback para mock |
| API retorna HTML | Fallback para mock (detectado por `isHtmlPayload`) |

## Próximo candidato: Fase 7

**Recomendação:** Completar integração de RH (mutações POST/PUT) e iniciar Horas Extras.

**Motivos:**
- RH já tem GET integrado, falta apenas completar mutações
- Horas Extras é o próximo módulo crítico no fluxo de negócio
- Fluxo HE → FOPAG → Financeiro é a cadeia mais importante após Obras + RH

**Ordem sugerida:**
1. RH mutações (POST/PUT)
2. Horas Extras (dashboard, listagem, aprovação, fechamento)
3. FOPAG (competências)
4. Compras (solicitações, cotações, pedidos)

## Arquivos alterados na Fase 6

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| `frontend/src/shared/lib/integration.ts` | Modificado | Obras e RH marcados como integrated |
| `frontend/src/shared/lib/integration.test.ts` | Modificado | Testes atualizados para 5 módulos integrados |
| `frontend/src/modules/obras/services/obras.service.test.ts` | Criado | Testes do service de Obras |
| `frontend/src/modules/obras/services/obra-workspace.service.test.ts` | Criado | Testes do workspace de Obras |
| `frontend/src/modules/obras/hooks/useObraDetails.test.tsx` | Criado | Testes do hook de detalhe |
| `frontend/src/modules/obras/hooks/useObraMutations.test.tsx` | Criado | Testes do hook de mutações |
| `frontend/src/modules/rh/services/funcionarios.service.test.ts` | Criado | Testes do service de RH |
| `docs/08-roadmap.md` | Modificado | Fase 6 registrada |
| `docs/10-readiness-modulos.md` | Modificado | Obras integrado, RH parcialmente integrado |
| `docs/12-integracao-fase6.md` | Criado | Documentação completa da integração |
| `README.md` | Modificado | Contagem de testes e status atualizado |
