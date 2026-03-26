# Fase 11 — Fechamento dos Módulos Parciais

## Objetivo

Fechar os contratos e fluxos dos 4 módulos que permaneciam em estado **Partial** após as fases anteriores: Estoque, Medições, Documentos e Admin. Com esta fase, todos os 15 módulos do ERP JOGAB estão integrados.

---

## Escopo

### Estoque — 3 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/estoque/dashboard` | GET | Dashboard de estoque (KPIs, itens, movimentações, resumo) |
| `/estoque/movimentacoes` | GET | Listagem de movimentações |
| `/estoque/itens/:id` | GET | Detalhe do item de estoque |

### Medições — 3 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/medicoes/dashboard` | GET | Dashboard de medições (KPIs, resumo) |
| `/medicoes` | GET | Listagem de medições |
| `/medicoes/:id` | GET | Detalhe da medição |

### Documentos — 4 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/documentos/dashboard` | GET | Dashboard de documentos |
| `/documentos/:id` | GET | Detalhe do documento |
| `/documentos/upload` | POST | Upload de documento (multipart/form-data) |
| `/documentos/:id` | PUT | Atualização de metadados do documento |

### Admin — 12 endpoints integrados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/admin/dashboard` | GET | Dashboard administrativo |
| `/admin/usuarios` | GET | Listagem de usuários |
| `/admin/usuarios` | POST | Criação de usuário |
| `/admin/usuarios/:id` | PUT | Atualização de usuário |
| `/admin/perfis` | GET | Listagem de perfis |
| `/admin/perfis` | POST | Criação de perfil |
| `/admin/perfis/:id` | PUT | Atualização de perfil |
| `/admin/permissoes` | GET | Listagem de permissões |
| `/admin/permissoes/:id` | PUT | Atualização de permissão |
| `/admin/parametros` | GET | Parâmetros do sistema |
| `/admin/logs` | GET | Logs de auditoria |
| `/admin/integracoes` | GET | Integrações ativas |

**Total desta fase: 22 endpoints integrados**

---

## Padrão técnico

Segue o padrão consolidado:

- `withApiFallback(apiCall, mockFallback)` — fallback automático em erros 5xx, timeout e rede
- Normalizadores defensivos para shape completo mesmo com payloads parciais
- `unwrapApiResponse` para desembrulhar envelope `{ data: ... }`

### Novos contratos adicionados

**Documentos:**
- `UploadDocumentoPayload` — campos obrigatórios para upload via FormData
- `UpdateDocumentoPayload` — campos opcionais para atualização de metadados
- `uploadDocumentoMock` / `updateDocumentoMock` — fallbacks funcionais

**Admin (mutations):**
- `CreateUsuarioPayload`, `UpdateUsuarioPayload`
- `CreatePerfilPayload`, `UpdatePerfilPayload`
- `UpdatePermissaoPayload`
- `createUsuarioMock`, `updateUsuarioMock`, `createPerfilMock`, `updatePerfilMock`, `updatePermissaoMock`

---

## Arquivos alterados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `frontend/src/modules/documentos/services/documentos.service.ts` | Editado | Upload + update endpoints, tipos de payload, mocks de fallback |
| `frontend/src/modules/admin/services/admin.service.ts` | Editado | CRUD mutations (POST/PUT) para usuarios, perfis e permissoes |
| `frontend/src/shared/lib/integration.ts` | Editado | estoque, medicoes, documentos, admin: `partial` → `integrated` |
| `frontend/src/shared/lib/integration.test.ts` | Editado | 11→15 módulos integrados; asserts explícitos; sem módulos partial |
| `frontend/src/modules/estoque/services/estoque.service.test.ts` | Criado | 23 testes: todos os endpoints + normalizer + fallback |
| `frontend/src/modules/medicoes/services/medicoes.service.test.ts` | Criado | 24 testes: todos os endpoints + normalizer + fallback |
| `frontend/src/modules/documentos/services/documentos.service.test.ts` | Criado | 30 testes: fetch + upload + update + normalizer + fallback |
| `frontend/src/modules/admin/services/admin.service.test.ts` | Criado | 48 testes: GET + mutations + normalizers + fallback |

---

## Testes

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `estoque.service.test.ts` | 23 | dashboard, movimentações, detalhe, normalizer |
| `medicoes.service.test.ts` | 24 | dashboard, listagem, detalhe, normalizer |
| `documentos.service.test.ts` | 30 | dashboard, detalhe, upload, update, normalizer |
| `admin.service.test.ts` | 48 | GET + POST/PUT mutations + normalizers |

Cenários cobertos em cada módulo:
- ✅ Sucesso com payload da API
- ✅ Fallback em HTTP 502, 503, 504
- ✅ Fallback em ECONNABORTED (timeout)
- ✅ Fallback em ERR_NETWORK
- ✅ Normalizer com null/undefined
- ✅ Normalizer com payload parcial
- ✅ Normalizer com tipos inválidos (non-array → [])
- ✅ Mutations com sucesso e fallback

---

## Estado após a Fase 11

### Todos os módulos integrados (15 total)

| Módulo | Fase | Tipo |
|--------|------|------|
| auth | Fase 5 | GET+POST |
| context | Fase 5 | GET |
| dashboard | Fase 5 | GET |
| obras | Fase 6 | GET+POST+PUT |
| rh | Fases 6–7 | GET+POST+PUT |
| horas-extras | Fase 7 | GET+POST |
| fopag | Fase 8 | GET |
| financeiro | Fase 8 | GET |
| compras | Fase 9 | GET |
| fiscal | Fase 10 | GET |
| relatorios | Fase 10 | GET |
| estoque | **Fase 11** | GET |
| medicoes | **Fase 11** | GET |
| documentos | **Fase 11** | GET+POST+PUT |
| admin | **Fase 11** | GET+POST+PUT |

**Não há mais módulos em estado Partial.**

---

## Resultado dos testes e validação

```
Test Files  56 passed (56)
     Tests  820 passed (820)
  Duration  ~40s
```

- Build: ✅ 0 erros TypeScript
- Lint: ✅ 0 erros ESLint
- npm audit: ✅ 0 vulnerabilidades

---

## Próxima fase recomendada — Fase 12: Consolidação e E2E

Com todos os 15 módulos integrados, a Fase 12 pode focar em:

1. **Testes E2E básicos** com Playwright ou Cypress — fluxos críticos (auth, obra, RH, aprovação HE)
2. **Desativação gradual do fallback** por módulo — `VITE_API_FALLBACK=false` por domínio
3. **Code-splitting** com `React.lazy` para reduzir bundle (atualmente >500KB minificado)
4. **Cobertura de hooks** — `useEstoque`, `useMedicoes`, `useDocumentos`, `useAdmin` com TanStack Query
5. **Contrato de erro amigável** — mapeamento de erros 4xx para mensagens de UI
