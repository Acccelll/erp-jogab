# Fase 13 — Qualidade: Correção de Contratos e Expansão de Cobertura de Testes

**Data:** 2026-03-26  
**Status:** ✅ Concluída

---

## Contexto

A Fase 12 introduziu mutations (POST/PUT) para os módulos Compras, Fiscal, Estoque, Medições e Relatórios, mas utilizou o padrão incorreto `.then(unwrapApiResponse)` em vez do padrão correto `response.data` adotado pelo admin service. A Fase 13 corrigiu esse bug estrutural, expandiu a cobertura de testes de hooks para todos os módulos secundários, e adicionou testes das novas mutations ao medicoes e relatorios.

---

## O que foi feito

### 1. Correção do padrão de mutation (Phase 12 bug fix)

**Problema:** Todas as funções de mutation adicionadas na Fase 12 usavam:
```typescript
() => api.post(endpoint, payload).then(unwrapApiResponse)
```
Isso passava o objeto `AxiosResponse` completo para `unwrapApiResponse`, que o desempacotava uma vez para `response.data = { data: T }`, mas não extraía o `T` final. O resultado retornado era `{ data: T }` em vez de `T`.

**Padrão correto** (conforme admin service):
```typescript
async () => {
  const response = await api.post(endpoint, payload);
  return unwrapApiResponse<T>(response.data);
}
```

**Serviços corrigidos:**
- `compras.service.ts` — `createSolicitacao`, `updateSolicitacao`, `createCotacao`, `updateCotacao`, `createPedido`, `updatePedido`
- `fiscal.service.ts` — `createDocumentoFiscal`, `updateDocumentoFiscal`
- `estoque.service.ts` — `createMovimentacaoEstoque`, `updateItemEstoque`
- `medicoes.service.ts` — `createMedicao`, `updateMedicao`, `aprovarMedicao`
- `relatorios.service.ts` — `gerarRelatorio`

**Correções TypeScript adicionais:**
- `createCotacao` mock: adicionado campo `prioridade: 'media'` ausente do tipo `CotacaoCompra`
- `updateItemEstoque` fallback: `fetchItemEstoqueById` retorna `EstoqueItemDetailData`, não `EstoqueItem` — corrigido para acessar `.item`
- `updateDocumentoFiscal` fallback: idem, acessa `.documento`
- `updateMedicao` / `aprovarMedicao` fallbacks: idem, acessam `.medicao`

### 2. Novos testes de hooks (Phase 13)

Criados 7 novos arquivos de teste para hooks dos módulos secundários:

| Arquivo | Hook | Testes |
|---------|------|--------|
| `financeiro/hooks/useFinanceiro.test.tsx` | `useFinanceiro` | 4 |
| `fiscal/hooks/useFiscal.test.tsx` | `useFiscal` | 4 |
| `estoque/hooks/useEstoque.test.tsx` | `useEstoque` | 4 |
| `medicoes/hooks/useMedicoes.test.tsx` | `useMedicoes` | 4 |
| `documentos/hooks/useDocumentos.test.tsx` | `useDocumentos` | 4 |
| `relatorios/hooks/useRelatorios.test.tsx` | `useRelatorios` | 4 |
| `admin/hooks/useAdmin.test.tsx` | `useAdmin` | 4 |

Cada arquivo cobre: success path, filter passing, loading state, error state.

### 3. Novos testes de mutations nos service tests

**`medicoes.service.test.ts`** — adicionados 3 describe blocks:
- `createMedicao` (3 testes: POST, 503 fallback, ERR_NETWORK fallback)
- `updateMedicao` (2 testes: PUT, 502 fallback)
- `aprovarMedicao` (2 testes: POST aprovar, 503 fallback)

**`relatorios.service.test.ts`** — adicionado 1 describe block:
- `gerarRelatorio` (3 testes: POST, 503 fallback, ERR_NETWORK fallback)

### 4. Ajuste no integration.test.ts

- Atualizada asserção de compras: `toHaveLength(5)` → `toHaveLength(11)` (reflete os 6 novos endpoints POST/PUT da Fase 12)

---

## Resultado dos comandos de validação

```
npm run build  → 0 erros TypeScript, build completo com sucesso
npm run lint   → 0 erros
npm run test   → 63 arquivos, 880 testes passando
npm audit      → 0 vulnerabilidades
```

---

## Cobertura por categoria (pós-Fase 13)

| Categoria | Arquivos | Testes |
|-----------|----------|--------|
| Normalização de services | 1 | 80 |
| Validação Zod (schemas) | 4 | 101 |
| Páginas | 13 | 58 |
| Utilitários compartilhados | 5 | 109 |
| Stores Zustand | 5 | 39 |
| Componentes compartilhados | 5 | 37 |
| Hooks TanStack Query | 15 | 60 |
| Services de módulos (GET + mutations) | 15 | ~396 |
| **Total** | **63** | **880** |

---

## Módulos com mutations integradas (Fase 12+13)

| Módulo | GET | POST | PUT | Fallback |
|--------|-----|------|-----|---------|
| Compras | ✅ | ✅ 3 endpoints | ✅ 3 endpoints | withApiFallback |
| Fiscal | ✅ | ✅ 1 endpoint | ✅ 1 endpoint | withApiFallback |
| Estoque | ✅ | ✅ 1 endpoint | ✅ 1 endpoint | withApiFallback |
| Medições | ✅ | ✅ 2 endpoints | ✅ 1 endpoint | withApiFallback |
| Relatórios | ✅ | ✅ 1 endpoint | — | withApiFallback |
| Admin | ✅ | ✅ 2 endpoints | ✅ 3 endpoints | withApiFallback |
| Obras | ✅ | ✅ | ✅ | withApiFallback |
| RH | ✅ | ✅ | ✅ | withApiFallback |
| Horas Extras | ✅ | ✅ | — | withApiFallback |

---

## Gaps remanescentes (candidatos à Fase 14)

1. **Testes E2E:** Nenhum teste Playwright/Cypress ainda implementado. O setup de E2E requer servidor rodando e fixtures de autenticação.
2. **Componentes internos:** Filtros avançados, tabelas, cards específicos de módulo sem testes isolados.
3. **Backend real:** Repositório sem diretório `backend/` — testes de integração ponta a ponta dependem de implementação de servidor.
4. **Hooks secundários de sub-features:** `useContasPagar`, `useContasReceber`, `useFluxoCaixa`, `useFiscalEntradas`, etc. sem cobertura unitária própria.

---

## Escopo recomendado para a Fase 14

1. **Setup E2E básico:** Instalar Playwright, configurar ambiente, criar fluxos críticos (login → dashboard → obras → detalhes)
2. **Cobertura de hooks de sub-features:** `useContasPagar`, `useFluxoCaixa`, `useFiscalEntradas`, `useMedicaoDetails`, `useDocumentoDetails`
3. **Início do backend real:** Estrutura básica de servidor (Node/Express ou equivalente) com endpoints prioritários
4. **Estabilização de build:** Code-splitting com React.lazy para reduzir bundle size (>500 kB atualmente)
