# 09 — Integração Backend

## Visão geral da arquitetura

O frontend do ERP JOGAB foi projetado desde o início com uma camada de integração preparada para API real. Toda comunicação HTTP passa por um arquivo centralizado (`shared/lib/api.ts`) que configura Axios com interceptors de autenticação, contexto global e tratamento de erros.

O mecanismo central é a função `withApiFallback<T>()`:

```typescript
export async function withApiFallback<T>(
  apiCall: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (shouldFallbackToMock(error)) {
      return fallback();
    }
    throw normalizeApiError(error);
  }
}
```

Cada service exporta funções públicas que tentam a API real primeiro. Se o backend não estiver disponível (sem resposta, 404, 405, 501–504), o sistema degrada graciosamente para dados mock locais. Isso permite desenvolvimento frontend independente e migração incremental para API real.

### Fluxo de uma requisição

```
Componente → Hook (TanStack Query) → Service (withApiFallback)
                                          ├── Tenta API real (Axios)
                                          │     ├── Sucesso → unwrapApiResponse → dados
                                          │     └── Falha
                                          │           ├── 401 → redirect /login
                                          │           ├── 404/405/501-504 → fallback mock
                                          │           └── Outros → throw normalizeApiError
                                          └── Fallback → função mock local → dados
```

---

## Convenções de contrato API

### URL base

Definida pela variável de ambiente `VITE_API_URL`. Valor padrão: `/api`.

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### Autenticação

Token Bearer no header `Authorization`:

```
Authorization: Bearer <token>
```

O token é obtido do `authStore` (Zustand) ou do `localStorage`. Caso a API retorne **401**, o token é removido e o usuário é redirecionado para `/login`.

### Headers de contexto global

Toda requisição autenticada inclui automaticamente os headers de contexto ativo:

| Header                    | Descrição                     | Exemplo         |
|---------------------------|-------------------------------|-----------------|
| `X-Context-Empresa`       | ID da empresa ativa           | `emp-1`         |
| `X-Context-Filial`        | ID da filial ativa            | `fil-1`         |
| `X-Context-Obra`          | ID da obra ativa              | `obra-1`        |
| `X-Context-Centro-Custo`  | ID do centro de custo ativo   | `cc-001`        |
| `X-Context-Competencia`   | Competência ativa (YYYY-MM)   | `2026-03`       |

O backend deve usar esses headers para filtrar resultados e aplicar regras de permissão por escopo.

### Envelope de resposta padrão

Todas as respostas da API devem seguir o envelope:

```json
{
  "data": T
}
```

O frontend desempacota automaticamente via `unwrapApiResponse`:

```typescript
export function unwrapApiResponse<T>(payload: T | ApiEnvelope<T>): T {
  return isApiEnvelope<T>(payload) ? payload.data : payload;
}
```

Se o payload já estiver desempacotado (sem `{ data: ... }`), a função aceita normalmente. Isso garante compatibilidade durante a transição.

### Respostas de erro

| Status HTTP | Comportamento do frontend                              |
|-------------|--------------------------------------------------------|
| 401         | Remove token, redireciona para `/login`                |
| 404         | Fallback para mock (se habilitado)                     |
| 405         | Fallback para mock (se habilitado)                     |
| 501         | Fallback para mock (se habilitado)                     |
| 502–504     | Fallback para mock (se habilitado)                     |
| Sem resposta| Fallback para mock (rede indisponível)                 |
| 400         | Erro propagado — validação de payload                  |
| 403         | Erro propagado — permissão insuficiente                |
| 409         | Erro propagado — conflito de dados                     |
| 422         | Erro propagado — entidade não processável              |
| 500         | Erro propagado — erro interno do servidor              |

O formato recomendado para erros:

```json
{
  "message": "Descrição legível do erro.",
  "code": "VALIDATION_ERROR",
  "details": {}
}
```

---

## Módulos prioritários para implementação do backend

A ordem de implementação é baseada em dependências entre módulos e valor funcional:

### Prioridade 1 — Autenticação

| Método | Endpoint         | Descrição                |
|--------|------------------|--------------------------|
| POST   | `/auth/login`    | Login com email e senha  |
| GET    | `/auth/me`       | Sessão do usuário logado |
| POST   | `/auth/logout`   | Encerrar sessão          |

**Payload de login:**

```json
{
  "email": "admin@jogab.com.br",
  "password": "jogab123"
}
```

**Resposta de login e `/auth/me`:**

```json
{
  "data": {
    "token": "jwt-token",
    "usuario": {
      "id": "usr-admin-1",
      "nome": "Administrador JOGAB",
      "email": "admin@jogab.com.br",
      "papel": "admin",
      "empresaId": "emp-1",
      "filialId": "fil-1",
      "permissoes": ["dashboard:read", "obras:read", "obras:write", ...]
    }
  }
}
```

**Papéis definidos:** `admin`, `gestor`, `operador`, `visualizador`.

### Prioridade 2 — Contexto global

| Método | Endpoint             | Descrição                                    |
|--------|----------------------|----------------------------------------------|
| GET    | `/context/bootstrap` | Contexto inicial baseado no usuário logado   |
| GET    | `/context/options`   | Opções de empresa, filial, obra, CC, período |

Esse módulo alimenta o `ContextBar` presente em todas as telas. O bootstrap é chamado após o login e retorna o contexto padrão do usuário com as opções de seleção.

### Prioridade 3 — Obras (módulo central)

CRUD completo de obras + workspace com abas de domínios relacionados. A Obra é a entidade pivô do sistema.

### Prioridade 4 — RH

CRUD de funcionários + alocações + workspace com abas (contrato, provisões, horas extras, fopag, histórico salarial, documentos, férias, 13º).

### Prioridade 5 — Horas Extras → FOPAG → Financeiro

Fluxo crítico de negócio. Consulte `docs/10-fluxo-horas-extras-fopag-financeiro.md` para detalhes.

---

## Catálogo completo de endpoints

### Autenticação (`auth.service.ts`)

| Método | Endpoint         | Constante                     |
|--------|------------------|-------------------------------|
| POST   | `/auth/login`    | `AUTH_API_ENDPOINTS.login`    |
| GET    | `/auth/me`       | `AUTH_API_ENDPOINTS.me`       |
| POST   | `/auth/logout`   | `AUTH_API_ENDPOINTS.logout`   |

### Contexto Global (`context.service.ts`)

| Método | Endpoint             | Constante                         |
|--------|----------------------|-----------------------------------|
| GET    | `/context/bootstrap` | `CONTEXT_API_ENDPOINTS.bootstrap` |
| GET    | `/context/options`   | `CONTEXT_API_ENDPOINTS.options`   |

### Dashboard (`dashboard.service.ts`)

| Método | Endpoint             | Constante                          |
|--------|----------------------|------------------------------------|
| GET    | `/dashboard/summary` | `DASHBOARD_API_ENDPOINTS.summary`  |

### Obras (`obras.service.ts`)

| Método | Endpoint             | Constante                      |
|--------|----------------------|--------------------------------|
| GET    | `/obras`             | `OBRAS_API_ENDPOINTS.list`     |
| GET    | `/obras/:obraId`     | `OBRAS_API_ENDPOINTS.detail`   |
| POST   | `/obras`             | `OBRAS_API_ENDPOINTS.create`   |
| PUT    | `/obras/:obraId`     | `OBRAS_API_ENDPOINTS.update`   |

### Obra Workspace (`obra-workspace.service.ts`)

| Método | Endpoint                        | Constante                                   |
|--------|---------------------------------|---------------------------------------------|
| GET    | `/obras/:obraId/cronograma`     | `OBRA_WORKSPACE_API_ENDPOINTS.cronograma`   |
| GET    | `/obras/:obraId/equipe`         | `OBRA_WORKSPACE_API_ENDPOINTS.equipe`       |
| GET    | `/obras/:obraId/compras`        | `OBRA_WORKSPACE_API_ENDPOINTS.compras`      |
| GET    | `/obras/:obraId/financeiro`     | `OBRA_WORKSPACE_API_ENDPOINTS.financeiro`   |
| GET    | `/obras/:obraId/documentos`     | `OBRA_WORKSPACE_API_ENDPOINTS.documentos`   |
| GET    | `/obras/:obraId/contratos`      | `OBRA_WORKSPACE_API_ENDPOINTS.contratos`    |
| GET    | `/obras/:obraId/estoque`        | `OBRA_WORKSPACE_API_ENDPOINTS.estoque`      |
| GET    | `/obras/:obraId/medicoes`       | `OBRA_WORKSPACE_API_ENDPOINTS.medicoes`     |
| GET    | `/obras/:obraId/rh`             | `OBRA_WORKSPACE_API_ENDPOINTS.rh`           |
| GET    | `/obras/:obraId/riscos`         | `OBRA_WORKSPACE_API_ENDPOINTS.riscos`       |

### RH — Funcionários (`funcionarios.service.ts`)

| Método | Endpoint                        | Constante                    |
|--------|---------------------------------|------------------------------|
| GET    | `/rh/funcionarios`              | `RH_API_ENDPOINTS.list`      |
| GET    | `/rh/funcionarios/:funcId`      | `RH_API_ENDPOINTS.detail`    |
| POST   | `/rh/funcionarios`              | `RH_API_ENDPOINTS.create`    |
| PUT    | `/rh/funcionarios/:funcId`      | `RH_API_ENDPOINTS.update`    |

### RH — Alocações (`alocacoes.service.ts`)

| Método | Endpoint                                    | Constante                              |
|--------|---------------------------------------------|----------------------------------------|
| GET    | `/rh/funcionarios/:funcId/alocacoes`        | `ALOCACOES_API_ENDPOINTS.byFuncionario`|
| GET    | `/obras/:obraId/alocacoes`                  | `ALOCACOES_API_ENDPOINTS.byObra`       |
| POST   | `/rh/alocacoes`                             | `ALOCACOES_API_ENDPOINTS.create`       |
| PUT    | `/rh/alocacoes/:alocacaoId`                 | `ALOCACOES_API_ENDPOINTS.update`       |
| PATCH  | `/rh/alocacoes/:alocacaoId/encerrar`        | `ALOCACOES_API_ENDPOINTS.end`          |

### RH — Funcionário Workspace (`funcionario-workspace.service.ts`)

| Método | Endpoint                                         | Constante                                              |
|--------|--------------------------------------------------|--------------------------------------------------------|
| GET    | `/rh/funcionarios/:funcId/contrato`              | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.contrato`         |
| GET    | `/rh/funcionarios/:funcId/alocacoes`             | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.alocacoes`        |
| GET    | `/rh/funcionarios/:funcId/provisoes`             | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.provisoes`        |
| GET    | `/rh/funcionarios/:funcId/horas-extras`          | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.horasExtras`      |
| GET    | `/rh/funcionarios/:funcId/fopag`                 | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.fopag`            |
| GET    | `/rh/funcionarios/:funcId/historico-salarial`    | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.historicoSalarial`|
| GET    | `/rh/funcionarios/:funcId/documentos`            | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.documentos`       |
| GET    | `/rh/funcionarios/:funcId/ferias`                | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.ferias`           |
| GET    | `/rh/funcionarios/:funcId/decimo-terceiro`       | `FUNCIONARIO_WORKSPACE_API_ENDPOINTS.decimoTerceiro`   |

### Horas Extras (`horasExtras.service.ts`)

| Método | Endpoint                       | Constante                                |
|--------|--------------------------------|------------------------------------------|
| GET    | `/horas-extras`                | `HORAS_EXTRAS_API_ENDPOINTS.list`        |
| GET    | `/horas-extras/:id`            | `HORAS_EXTRAS_API_ENDPOINTS.detail`      |
| GET    | `/horas-extras/dashboard`      | `HORAS_EXTRAS_API_ENDPOINTS.dashboard`   |
| GET    | `/horas-extras/fechamentos`    | `HORAS_EXTRAS_API_ENDPOINTS.fechamentos` |
| POST   | `/horas-extras/:id/aprovar`    | `HORAS_EXTRAS_API_ENDPOINTS.aprovar`     |
| POST   | `/horas-extras/fechamento`     | `HORAS_EXTRAS_API_ENDPOINTS.fechamento`  |

### Horas Extras — Aprovação (`horasExtrasAprovacao.service.ts`)

| Método | Endpoint                   | Constante                                    |
|--------|----------------------------|----------------------------------------------|
| GET    | `/horas-extras/aprovacao`  | `HORAS_EXTRAS_APROVACAO_API_ENDPOINTS.list`  |

### FOPAG (`fopag.service.ts`)

| Método | Endpoint                              | Constante                                  |
|--------|---------------------------------------|--------------------------------------------|
| GET    | `/fopag/competencias`                 | `FOPAG_API_ENDPOINTS.competencias`         |
| GET    | `/fopag/competencias/:competenciaId`  | `FOPAG_API_ENDPOINTS.competenciaDetail`    |

### Compras (`compras.service.ts`)

| Método | Endpoint                       | Constante                              |
|--------|--------------------------------|----------------------------------------|
| GET    | `/compras/solicitacoes`        | `COMPRAS_API_ENDPOINTS.solicitacoes`   |
| GET    | `/compras/cotacoes`            | `COMPRAS_API_ENDPOINTS.cotacoes`       |
| GET    | `/compras/pedidos`             | `COMPRAS_API_ENDPOINTS.pedidos`        |
| GET    | `/compras/pedidos/:pedidoId`   | `COMPRAS_API_ENDPOINTS.pedidoDetail`   |
| GET    | `/compras/dashboard`           | `COMPRAS_API_ENDPOINTS.dashboard`      |

### Fiscal (`fiscal.service.ts`)

| Método | Endpoint                            | Constante                               |
|--------|-------------------------------------|-----------------------------------------|
| GET    | `/fiscal/dashboard`                 | `FISCAL_API_ENDPOINTS.dashboard`        |
| GET    | `/fiscal/entradas`                  | `FISCAL_API_ENDPOINTS.entradas`         |
| GET    | `/fiscal/saidas`                    | `FISCAL_API_ENDPOINTS.saidas`           |
| GET    | `/fiscal/documentos/:documentoId`   | `FISCAL_API_ENDPOINTS.documentoDetail`  |

### Financeiro (`financeiro.service.ts`)

| Método | Endpoint                           | Constante                                  |
|--------|------------------------------------|--------------------------------------------|
| GET    | `/financeiro/dashboard`            | `FINANCEIRO_API_ENDPOINTS.dashboard`       |
| GET    | `/financeiro/fluxo-caixa`          | `FINANCEIRO_API_ENDPOINTS.fluxoCaixa`      |
| GET    | `/financeiro/pessoal`              | `FINANCEIRO_API_ENDPOINTS.pessoal`         |
| GET    | `/financeiro/contas-pagar`         | `FINANCEIRO_API_ENDPOINTS.contasPagar`     |
| GET    | `/financeiro/contas-receber`       | `FINANCEIRO_API_ENDPOINTS.contasReceber`   |
| GET    | `/financeiro/titulos/:tituloId`    | `FINANCEIRO_API_ENDPOINTS.tituloDetail`    |

### Estoque (`estoque.service.ts`)

| Método | Endpoint                       | Constante                            |
|--------|--------------------------------|--------------------------------------|
| GET    | `/estoque/dashboard`           | `ESTOQUE_API_ENDPOINTS.dashboard`    |
| GET    | `/estoque/movimentacoes`       | `ESTOQUE_API_ENDPOINTS.movimentacoes`|
| GET    | `/estoque/itens/:itemId`       | `ESTOQUE_API_ENDPOINTS.itemDetail`   |

### Medições (`medicoes.service.ts`)

| Método | Endpoint                   | Constante                           |
|--------|----------------------------|-------------------------------------|
| GET    | `/medicoes/dashboard`      | `MEDICOES_API_ENDPOINTS.dashboard`  |
| GET    | `/medicoes`                | `MEDICOES_API_ENDPOINTS.list`       |
| GET    | `/medicoes/:medicaoId`     | `MEDICOES_API_ENDPOINTS.detail`     |

### Documentos (`documentos.service.ts`)

| Método | Endpoint                       | Constante                              |
|--------|--------------------------------|----------------------------------------|
| GET    | `/documentos/dashboard`        | `DOCUMENTOS_API_ENDPOINTS.dashboard`   |
| GET    | `/documentos/:documentoId`     | `DOCUMENTOS_API_ENDPOINTS.detail`      |

### Relatórios (`relatorios.service.ts`)

| Método | Endpoint                               | Constante                              |
|--------|----------------------------------------|----------------------------------------|
| GET    | `/relatorios/dashboard`                | `RELATORIOS_API_ENDPOINTS.dashboard`   |
| GET    | `/relatorios/categorias/:categoria`    | `RELATORIOS_API_ENDPOINTS.categoria`   |

### Administração (`admin.service.ts`)

| Método | Endpoint               | Constante                          |
|--------|------------------------|------------------------------------|
| GET    | `/admin/dashboard`     | `ADMIN_API_ENDPOINTS.dashboard`    |
| GET    | `/admin/usuarios`      | `ADMIN_API_ENDPOINTS.usuarios`     |
| GET    | `/admin/perfis`        | `ADMIN_API_ENDPOINTS.perfis`       |
| GET    | `/admin/permissoes`    | `ADMIN_API_ENDPOINTS.permissoes`   |
| GET    | `/admin/parametros`    | `ADMIN_API_ENDPOINTS.parametros`   |
| GET    | `/admin/logs`          | `ADMIN_API_ENDPOINTS.logs`         |
| GET    | `/admin/integracoes`   | `ADMIN_API_ENDPOINTS.integracoes`  |

---

## Estrutura sugerida para o backend

A organização do backend deve espelhar a arquitetura por domínio do frontend.

### Opção A — Node.js + Express

```
backend/
├── src/
│   ├── app.ts                      # Setup Express, middlewares
│   ├── server.ts                   # Entrypoint
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Validação JWT
│   │   ├── context.middleware.ts    # Extração dos headers X-Context-*
│   │   ├── error.middleware.ts      # Handler global de erros
│   │   └── validation.middleware.ts # Validação Zod dos payloads
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.types.ts
│   │   ├── context/
│   │   │   ├── context.controller.ts
│   │   │   ├── context.service.ts
│   │   │   └── context.routes.ts
│   │   ├── obras/
│   │   │   ├── obras.controller.ts
│   │   │   ├── obras.service.ts
│   │   │   ├── obras.routes.ts
│   │   │   ├── obras.types.ts
│   │   │   └── obra-workspace.controller.ts
│   │   ├── rh/
│   │   │   ├── funcionarios.controller.ts
│   │   │   ├── funcionarios.service.ts
│   │   │   ├── alocacoes.controller.ts
│   │   │   ├── alocacoes.service.ts
│   │   │   ├── funcionario-workspace.controller.ts
│   │   │   ├── rh.routes.ts
│   │   │   └── rh.types.ts
│   │   ├── horas-extras/
│   │   │   ├── horasExtras.controller.ts
│   │   │   ├── horasExtras.service.ts
│   │   │   ├── horasExtras.routes.ts
│   │   │   └── horasExtras.types.ts
│   │   ├── fopag/
│   │   │   ├── fopag.controller.ts
│   │   │   ├── fopag.service.ts
│   │   │   ├── fopag.routes.ts
│   │   │   └── fopag.types.ts
│   │   ├── compras/
│   │   ├── fiscal/
│   │   ├── financeiro/
│   │   ├── estoque/
│   │   ├── medicoes/
│   │   ├── documentos/
│   │   ├── relatorios/
│   │   └── admin/
│   └── shared/
│       ├── database/
│       │   ├── prisma.ts            # Cliente Prisma
│       │   └── migrations/
│       ├── types/
│       │   └── index.ts             # Tipos compartilhados
│       └── utils/
│           ├── envelope.ts          # Helper { data: T }
│           └── pagination.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Opção B — NestJS

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── context.decorator.ts   # @Context() para extrair headers
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── envelope.interceptor.ts # Envelopa { data: T }
│   │   └── pipes/
│   │       └── zod-validation.pipe.ts
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   └── auth.service.ts
│       ├── context/
│       ├── obras/
│       ├── rh/
│       ├── horas-extras/
│       ├── fopag/
│       ├── compras/
│       ├── fiscal/
│       ├── financeiro/
│       ├── estoque/
│       ├── medicoes/
│       ├── documentos/
│       ├── relatorios/
│       └── admin/
├── prisma/
│   └── schema.prisma
└── package.json
```

### Middleware de contexto (exemplo Express)

```typescript
export function contextMiddleware(req, res, next) {
  req.context = {
    empresaId: req.headers['x-context-empresa'] ?? null,
    filialId: req.headers['x-context-filial'] ?? null,
    obraId: req.headers['x-context-obra'] ?? null,
    centroCustoId: req.headers['x-context-centro-custo'] ?? null,
    competencia: req.headers['x-context-competencia'] ?? null,
  };
  next();
}
```

### Envelope de resposta (exemplo Express)

```typescript
export function sendData<T>(res, data: T, status = 200) {
  res.status(status).json({ data });
}
```

---

## Configuração de ambiente

### Variáveis de ambiente do frontend

| Variável             | Descrição                                              | Valor padrão          |
|----------------------|--------------------------------------------------------|-----------------------|
| `VITE_API_URL`       | URL base da API                                        | `/api`                |
| `VITE_API_FALLBACK`  | Habilita fallback para mock (`true`/`false`)           | `true` (implícito)    |

**Arquivo `.env.example` existente:**

```
VITE_API_URL=http://localhost:3000/api
```

### Variáveis sugeridas para o backend

| Variável          | Descrição                        | Exemplo                                      |
|-------------------|----------------------------------|----------------------------------------------|
| `PORT`            | Porta do servidor                | `3000`                                       |
| `DATABASE_URL`    | String de conexão do banco       | `postgresql://user:pass@localhost:5432/jogab` |
| `JWT_SECRET`      | Segredo para tokens JWT          | `<segredo-forte>`                             |
| `JWT_EXPIRES_IN`  | Expiração do token               | `8h`                                         |
| `CORS_ORIGIN`     | Origem permitida para CORS       | `http://localhost:5173`                       |
| `NODE_ENV`        | Ambiente de execução             | `development`                                |

---

## Estratégia de migração mock → API real

### Princípio

Cada service já está estruturado com `withApiFallback`. A migração consiste em:
1. Implementar o endpoint no backend
2. Garantir que o contrato de resposta seja compatível com os tipos TypeScript do frontend
3. O frontend automaticamente usa a API real (e cai para mock apenas se falhar)

### Passos por módulo

```
1. Definir schema Prisma para as entidades do módulo
2. Criar migration do banco de dados
3. Implementar controller + service + routes no backend
4. Popular banco com dados de seed (baseados nos mocks existentes)
5. Testar endpoint com curl/Postman
6. Apontar VITE_API_URL para o backend local
7. Verificar que o frontend consome dados reais
8. Quando estável, desativar fallback: VITE_API_FALLBACK=false
```

### Ordem recomendada de migração

| Fase | Módulo                  | Endpoints | Justificativa                                        |
|------|-------------------------|-----------|------------------------------------------------------|
| 1    | Autenticação            | 3         | Pré-requisito para todos os módulos                  |
| 2    | Contexto Global         | 2         | Alimenta o ContextBar usado em todas as telas        |
| 3    | Obras                   | 4 + 10    | Entidade central — pivot de todo o sistema           |
| 4    | RH (Funcionários)       | 4         | Base cadastral para HE, FOPAG, alocações             |
| 5    | RH (Alocações)          | 5         | Vínculo funcionário ↔ obra ↔ centro de custo         |
| 6    | RH (Workspace)          | 9         | Abas do workspace do funcionário                     |
| 7    | Horas Extras            | 7         | Evento operacional crítico                           |
| 8    | FOPAG                   | 2         | Consolidação mensal (depende de RH e HE)             |
| 9    | Dashboard               | 1         | Visão executiva consolidada                          |
| 10   | Compras                 | 5         | Módulo operacional independente                      |
| 11   | Fiscal                  | 4         | Depende de Compras                                   |
| 12   | Financeiro              | 6         | Depende de FOPAG e Fiscal                            |
| 13   | Estoque                 | 3         | Módulo operacional independente                      |
| 14   | Medições                | 3         | Depende de Obras e Contratos                         |
| 15   | Documentos              | 2         | Módulo transversal                                   |
| 16   | Relatórios              | 2         | Depende de dados consolidados de todos os módulos    |
| 17   | Administração           | 7         | Configuração e auditoria                             |

### Convivência mock/API

Durante a migração, o sistema opera no modo híbrido:

- **Módulos já migrados:** API real responde, mock não é acionado
- **Módulos pendentes:** Backend retorna 404/501, frontend usa mock automaticamente
- **Degradação:** Se o backend cair, todos os módulos degradam para mock

Para desativar o fallback em produção quando a API estiver completa:

```
VITE_API_FALLBACK=false
```

---

## Padrão de contrato por módulo (exemplo Obras)

O frontend define contratos tipados que servem de especificação para o backend:

```typescript
// frontend/src/modules/obras/services/obras.service.ts
export interface ObrasApiContract {
  list: {
    filters?: ObraFiltersData;
    response: ObrasListResponse;
  };
  detail: {
    obraId: string;
    response: ObraDetailResponse;
  };
  create: {
    payload: ObraCreatePayload;
    response: ObraMutationResponse;
  };
  update: {
    obraId: string;
    payload: ObraUpdatePayload;
    response: ObraMutationResponse;
  };
}
```

O backend deve respeitar esses tipos para garantir compatibilidade zero-config.

---

## Resumo de totais

| Categoria                  | Quantidade |
|----------------------------|------------|
| Módulos com endpoints      | 15         |
| Total de endpoints GET     | 66         |
| Total de endpoints POST    | 5          |
| Total de endpoints PUT     | 3          |
| Total de endpoints PATCH   | 1          |
| **Total geral de endpoints** | **75**   |

---

## Fase 4 — Preparação para integração progressiva

### Camada HTTP reforçada

A Fase 4 adicionou classificação de erros estruturada à camada HTTP:

```typescript
type ApiErrorType = 'network' | 'timeout' | 'http' | 'html' | 'payload' | 'unknown';

class ApiError extends Error {
  readonly type: ApiErrorType;
  readonly status?: number;
}
```

`normalizeApiError()` agora retorna `ApiError` com tipo classificado, permitindo tratamento diferenciado no frontend (ex: mensagens específicas para timeout vs erro de validação).

`classifyError()` mapeia qualquer erro capturado para um `ApiErrorType`:
- `network` — sem resposta (rede indisponível)
- `timeout` — requisição excedeu o limite (ECONNABORTED)
- `http` — erro HTTP com status (400, 403, 500, etc.)
- `html` — resposta HTML em vez de JSON (SPA rewrite)
- `unknown` — erro não classificável

### Timeout configurável

A instância Axios agora respeita `VITE_API_TIMEOUT` (default: 15000ms). Timeout (ECONNABORTED) é tratado como fallback-eligible, igual a erros de rede.

### Variáveis de ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API | `/api` |
| `VITE_API_FALLBACK` | Habilitar fallback para mock | `true` |
| `VITE_API_TIMEOUT` | Timeout de requisição em ms | `15000` |

### Registry de readiness

O arquivo `shared/lib/integration.ts` centraliza o mapeamento de readiness por módulo. Consulte `docs/10-readiness-modulos.md` para a documentação completa.

### Estratégia de migração mock → API real

1. **Implementar o endpoint no backend** seguindo o contrato documentado
2. **Configurar `VITE_API_URL`** para apontar ao backend real
3. **Manter `VITE_API_FALLBACK=true`** durante desenvolvimento
4. **Testar com fallback desabilitado** (`VITE_API_FALLBACK=false`) para validar integração
5. **Monitorar `ApiError.type`** para identificar problemas de integração (timeout, html, etc.)
6. **Quando estável**, remover o mock do service (opcional — mocks podem coexistir indefinidamente)
