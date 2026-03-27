# Fase 14 — Estabilização: Code-splitting, Performance e Documentação

**Data:** 2026-03-26  
**Status:** ✅ Concluída

---

## Contexto

Com a conclusão das Fases 11–13 (todos os 15 módulos integrados, mutations corrigidas, 880 testes passando), a Fase 14 focou em estabilização técnica do frontend: code-splitting para reduzir o bundle inicial, Suspense boundary para UX de carregamento progressivo, e atualização completa da documentação para refletir o estado real do sistema.

---

## O que foi feito

### 1. Code-splitting com React.lazy

**Problema:** O router carregava todos os módulos de forma estática (`import` síncrono), resultando em bundle inicial ~1 MB com warnings de chunk size.

**Solução:** Migração para `React.lazy` com importação dinâmica para todos os pages de módulo.

**Arquivo alterado:** `frontend/src/app/router/index.tsx`

Antes:
```typescript
import { DashboardPage } from '@/modules/dashboard';
import { ObrasListPage } from '@/modules/obras';
// ... ~80 imports estáticos
```

Depois:
```typescript
import { lazy } from 'react';
const DashboardPage = lazy(() => import('@/modules/dashboard').then((m) => ({ default: m.DashboardPage })));
const ObrasListPage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObrasListPage })));
// ... todos os pages lazy-loaded
```

**Benefício:** Bundle principal fragmentado em chunks por módulo. Carregamento sob demanda ao navegar.

---

### 2. Suspense boundary (`PageLoader.tsx`)

**Arquivo criado:** `frontend/src/app/router/PageLoader.tsx`

```typescript
import { Suspense } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
    </div>
  );
}

export function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
```

Todos os lazy-loaded routes são envoltos em `<Lazy>` no router, garantindo feedback visual durante carregamento do chunk.

---

### 3. Variáveis de ambiente documentadas (`.env.example`)

Atualizado `frontend/.env.example` com orientações de produção:

```env
# URL base da API real (sem barra final).
# Local: http://localhost:3000/api
# Preview/Staging: https://api.erp-jogab.example.com/api
VITE_API_URL=http://localhost:3000/api

# Habilita fallback para mock quando a API real não responde.
# 'true'  → fallback ativado (padrão; ideal para dev local e preview sem backend)
# 'false' → fallback desativado (para ambientes com backend real obrigatório)
VITE_API_FALLBACK=true

# Timeout das requisições HTTP em milissegundos (padrão: 15000 = 15s).
VITE_API_TIMEOUT=15000
```

---

### 4. Documentação atualizada

- `docs/19-estabilizacao-fase14.md` — este documento
- `docs/08-roadmap.md` — Fase 14 marcada como concluída
- `docs/10-readiness-modulos.md` — tabela de status atualizada: todos os 15 módulos ✅ Integrado
- `README.md` — estado atualizado para refletir Fase 14

---

## Estado final dos módulos (pós-Fase 14)

Todos os 15 módulos estão integrados com API real via `withApiFallback`:

| Módulo | Fase | Endpoints | Mutations |
|--------|------|-----------|-----------|
| Auth | 5 | 3 GET/POST | — |
| Context | 5 | 2 GET | — |
| Dashboard | 5 | 1 GET | — |
| Obras | 6 | 2 GET | POST, PUT |
| RH | 6+7 | 2 GET | POST, PUT |
| Horas Extras | 7 | 4 GET | POST aprovar, POST fechamento |
| FOPAG | 8 | 2 GET | — |
| Financeiro | 8 | 6 GET | — |
| Compras | 9 | 5 GET | POST, PUT solicitação, cotação, pedido |
| Fiscal | 10 | 4 GET | POST, PUT documento |
| Relatórios | 10 | 2 GET | POST gerar |
| Estoque | 11+12 | 3 GET | POST movimentação, PUT item |
| Medições | 11+12 | 3 GET | POST criar, PUT atualizar, POST aprovar |
| Documentos | 11+12 | 2 GET | POST upload, PUT atualizar |
| Admin | 11+12 | 7 GET | POST/PUT usuário, perfil, permissão |

**Total:** 87 endpoints mapeados e integrados (incluindo endpoints complementares de workspace/alocações).

---

## Guia de uso da API (resumo prático)

### Como adicionar um novo endpoint a um service existente

```typescript
// 1. Função mock (fallback)
async function fetchNovoRecursoMock(filtros?: FiltrosData): Promise<NovoRecurso[]> {
  return MOCK_DATA.filter(/* filtros */);
}

// 2. Função pública com withApiFallback
export async function fetchNovoRecurso(filtros?: FiltrosData): Promise<NovoRecurso[]> {
  return withApiFallback(
    async () => {
      const response = await api.get('/novo-recurso', { params: filtros });
      return unwrapApiResponse<NovoRecurso[]>(response.data);
    },
    () => fetchNovoRecursoMock(filtros),
  );
}

// 3. Para mutations (POST/PUT):
export async function createNovoRecurso(payload: CreateNovoRecursoPayload): Promise<NovoRecurso> {
  return withApiFallback(
    async () => {
      const response = await api.post('/novo-recurso', payload);
      return unwrapApiResponse<NovoRecurso>(response.data);
    },
    () => createNovoRecursoMock(payload),
  );
}
```

> **Atenção:** Mutations devem usar `await api.post(...)` seguido de `unwrapApiResponse(response.data)`. **Nunca** use `.then(unwrapApiResponse)` — isso passa o `AxiosResponse` completo em vez de `response.data`.

### Envelope de resposta esperado da API

```json
{ "data": T }
```

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_URL` | `/api` | URL base da API real |
| `VITE_API_FALLBACK` | `true` | Habilitar fallback para mock |
| `VITE_API_TIMEOUT` | `15000` | Timeout em ms |

### Comportamento de fallback

| Cenário | Comportamento |
|---------|---------------|
| API respondeu 200 | Usa dados reais |
| Erro de rede / timeout | Fallback para mock |
| 404 / 405 / 501–504 | Fallback para mock |
| Resposta HTML (sem backend) | Fallback para mock |
| 400 / 409 / 422 | Erro propagado (dados inválidos) |
| 401 | Redirect para `/login` |
| 403 | Erro propagado (sem permissão) |
| 500 (JSON) | Erro propagado |

---

## Resultado dos comandos de validação

```
npm run build:  0 erros TypeScript, build completo com sucesso
npm run lint:   0 erros
npm run test:   63 arquivos de teste, 880 testes passando
npm audit:      0 vulnerabilidades
```

---

## Próximos passos (pós-Fase 14)

1. **Backend real** — implementar Node/Express com os 87 endpoints mapeados (incluindo complementares de workspace/alocações)
2. **Testes E2E** — Playwright com fluxos: login → dashboard → obras → detalhe
3. **Autenticação real** — JWT com refresh token, integrar com `/auth/me`
4. **Permissões** — implementar guard por perfil usando dados de `/admin/permissoes`
