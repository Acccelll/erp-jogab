# 11 — Integração Fase 5: Auth + Contexto + Dashboard

## Resumo

A Fase 5 conecta os três primeiros domínios do ERP JOGAB à API real de forma incremental:
autenticação, contexto global e dashboard. Todos usam `withApiFallback` para manter
o fallback mock controlado quando a API não está disponível.

## Endpoints integrados

| Módulo    | Endpoint              | Método | Status       | Descrição                          |
|-----------|-----------------------|--------|--------------|------------------------------------|
| Auth      | `/auth/login`         | POST   | ✅ Integrado | Login com credenciais              |
| Auth      | `/auth/me`            | GET    | ✅ Integrado | Restaurar sessão do usuário        |
| Auth      | `/auth/logout`        | POST   | ✅ Integrado | Logout                             |
| Context   | `/context/bootstrap`  | GET    | ✅ Integrado | Bootstrap de contexto global       |
| Context   | `/context/options`    | GET    | ✅ Integrado | Opções de contexto (selects)       |
| Dashboard | `/dashboard/summary`  | GET    | ✅ Integrado | Resumo executivo com KPIs          |

## Módulos que continuam apenas preparados

| Módulo       | Status    | Observação                                        |
|-------------|-----------|---------------------------------------------------|
| Obras       | Ready     | Candidato principal para Fase 6                   |
| RH          | Ready     | Segundo candidato para Fase 6                     |
| Horas Extras| Ready     | Service com mock, normalizador completo            |
| FOPAG       | Ready     | Service com mock, normalizador completo            |
| Compras     | Ready     | Service com mock, normalizador completo            |
| Financeiro  | Ready     | Service com mock, normalizador completo            |
| Fiscal      | Ready     | Service com mock, normalizador completo            |
| Relatórios  | Ready     | Service com mock, normalizador completo            |
| Estoque     | Partial   | Dashboard e listagem prontos, detalhe parcial      |
| Medições    | Partial   | Dashboard e listagem prontos, detalhe parcial      |
| Documentos  | Partial   | Dashboard pronto, upload/gestão pendente           |
| Admin       | Partial   | Leituras prontas, CRUD pendente                    |

## Padrão de integração

Todos os endpoints integrados seguem o mesmo padrão:

```typescript
export async function fetchXxx(): Promise<XxxType> {
  return withApiFallback(
    async () => {
      const response = await api.get('/endpoint');
      const raw = unwrapApiResponse<XxxType>(response.data);
      return normalizeXxx(raw);
    },
    () => fetchXxxMock(),
  );
}
```

**Fluxo:**
1. Tenta a API real via `api.get()`/`api.post()`
2. Desempacota a resposta com `unwrapApiResponse()` (suporta envelope `{ data: T }`)
3. Normaliza o payload com normalizer específico (garante defaults seguros)
4. Se falhar com erro elegível (network, timeout, HTML, 5xx), cai no mock
5. Se falhar com erro de cliente (400, 401, 403), propaga o erro normalizado

## Tratamento de erros

| Cenário                    | Comportamento                                      |
|----------------------------|----------------------------------------------------|
| API responde com sucesso   | Usa dados reais, normaliza payload                 |
| API retorna 401            | Limpa token, redireciona para `/login`             |
| API retorna 400/403        | Propaga `ApiError` com tipo `http`                 |
| API retorna 5xx            | Fallback para mock (se `VITE_API_FALLBACK=true`)  |
| Timeout (ECONNABORTED)     | Fallback para mock                                 |
| Erro de rede (sem resposta)| Fallback para mock                                 |
| API retorna HTML           | Fallback para mock (detectado por `isHtmlPayload`) |

## Configuração por ambiente

### Variáveis de ambiente

| Variável            | Default              | Descrição                                         |
|---------------------|----------------------|---------------------------------------------------|
| `VITE_API_URL`      | `/api`               | URL base da API real                               |
| `VITE_API_FALLBACK` | `true`               | Ativa fallback mock quando API indisponível        |
| `VITE_API_TIMEOUT`  | `15000`              | Timeout das requisições em milissegundos           |

### Cenários de uso

| Cenário            | `VITE_API_URL`                    | `VITE_API_FALLBACK` |
|--------------------|-----------------------------------|---------------------|
| Dev local sem API  | `http://localhost:3000/api`       | `true`              |
| Dev local com API  | `http://localhost:3000/api`       | `false`             |
| Preview/Staging    | URL da API de staging             | `true`              |
| Produção           | URL da API de produção            | `false`             |

## Normalizers de contexto

Dois normalizers foram adicionados na Fase 5 para garantir resiliência a payloads parciais:

- **`normalizeContextOptions()`** — Garante arrays vazios quando campos faltam
- **`normalizeContextBootstrap()`** — Garante contexto com nulls e options normalizadas

## Testes adicionados

| Arquivo                          | Testes | Descrição                                     |
|----------------------------------|--------|-----------------------------------------------|
| `auth.service.test.ts`           | 16     | Mock auth, credenciais, sessão, erro patterns |
| `context.service.test.ts`        | 16     | Mock context, normalizers, merge              |
| `integration.test.ts` (atualizado)| 15    | Registry atualizado com auth/context          |

**Total da Fase 5: 447 testes em 39 arquivos (vs 410 em 37 da Fase 4)**

## Próximo candidato: Fase 6

**Recomendação:** Obras (módulo central do ERP) como primeiro módulo de dados integrado.

**Motivos:**
- É a entidade central do sistema
- Contrato CRUD estável com validação Zod
- 4 endpoints ready
- Normalizadores completos
- Segundo candidato: RH

## Arquivos alterados na Fase 5

| Arquivo                                           | Tipo        | Mudança                                      |
|---------------------------------------------------|-------------|----------------------------------------------|
| `frontend/src/shared/lib/context.service.ts`      | Modificado  | API real + normalizers + fallback mock        |
| `frontend/src/shared/lib/integration.ts`          | Modificado  | Auth/context no registry, integrated flags    |
| `frontend/.env.example`                           | Modificado  | Documentação de variáveis com comentários     |
| `frontend/src/shared/lib/auth.service.test.ts`    | Criado      | Testes de autenticação                        |
| `frontend/src/shared/lib/context.service.test.ts` | Criado      | Testes de contexto                            |
| `frontend/src/shared/lib/integration.test.ts`     | Modificado  | Testes atualizados para novos módulos         |
| `docs/08-roadmap.md`                              | Modificado  | Fase 5 registrada, próximos passos atualizados|
| `docs/11-integracao-fase5.md`                     | Criado      | Documentação completa da integração           |
