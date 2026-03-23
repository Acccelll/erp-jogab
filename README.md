# Pacote de contexto para IA — ERP JOGAB

Este pacote foi preparado para uso com GitHub Copilot Agent ou Claude Code.

## Ordem de leitura obrigatória
1. `JOGAB_MASTER_SPEC.md`
2. `CLAUDE.md`
3. `docs/01-visao-geral.md`
4. `docs/02-arquitetura-tecnica.md`
5. `docs/03-banco-de-dados.md`
6. `docs/04-atualizacao-horas-extras-fopag.md`
7. `docs/05-arquitetura-frontend.md`
8. `docs/06-arquitetura-de-telas.md`
9. `docs/07-regras-de-implementacao.md`
10. `docs/08-roadmap.md`

## Objetivo do pacote
Garantir que a IA implemente o ERP JOGAB com máxima fidelidade à arquitetura definida, sem improvisar stack, rotas, organização por domínio ou regras centrais do negócio.

## Uso recomendado
- Use `CLAUDE.md` como instrução-base do agente.
- Use os arquivos da pasta `prompts/` por fase de implementação.
- Use `checklists/acceptance-checklist.md` para validar entregas.

## Estratégia recomendada
1. Estrutura base do frontend
2. Layout global e navegação
3. Módulo Obras
4. RH
5. Horas Extras
6. FOPAG
7. Compras
8. Fiscal
9. Financeiro
10. Estoque
11. Medições
12. Documentos, relatórios e administração

---

## Testes automatizados

### Infraestrutura
- **Framework:** Vitest + Testing Library (React) + jsdom
- **Config:** `frontend/vitest.config.ts`
- **Setup:** `frontend/src/test/setup.ts`

### Fluxos cobertos

| Área | Arquivo de teste | Cenários |
|------|-----------------|----------|
| HTTP Client (`shared/lib/api.ts`) | `src/shared/lib/api.test.ts` | unwrapApiResponse (envelope/raw/primitivo), normalizeApiError (JSON, HTML/não-JSON, rede, genérico), shouldFallbackToMock (rede, status 404-504, 400, não-Axios), withApiFallback (sucesso, fallback rede, fallback 502/Vercel, erro 400/500) |
| Dashboard | `src/modules/dashboard/pages/DashboardPage.test.tsx` | loading, erro com retry, dados com KPIs e seções, ação de refresh |
| Relatórios | `src/modules/relatorios/pages/RelatoriosListPage.test.tsx` | loading, erro com retry, dados com resumo/categorias/tabela, estado vazio com filtros ativos |
| Logs de Auditoria | `src/modules/admin/pages/AdminLogsPage.test.tsx` | loading, erro com retry, dados com tabela e preview cards, guarda para data undefined |

**Total: 4 arquivos, 34 testes**

### Checklist de validação local

```bash
cd frontend
npm install
npm run test          # Roda todos os testes (Vitest)
npm run test:watch    # Modo watch durante desenvolvimento
npm run build         # TypeScript + Vite build
npm run lint          # ESLint
```

### Gaps de cobertura restantes

- **Backend:** Repositório atualmente sem diretório backend — testes de integração de API (logs-auditoria, relatórios, comercial/fiscal) dependem da implementação do backend.
- **Páginas de módulo:** Obras, RH, Financeiro, Fiscal, Compras, Estoque, Medições, FOPAG, Horas Extras ainda sem testes de página.
- **Hooks e services:** Hooks de TanStack Query e services de cada módulo ainda sem testes unitários isolados.
- **Fluxo comercial/fiscal:** Conversão orçamento→pedido→ordem→nota fiscal→estoque requer backend para teste de integração end-to-end.
- **Componentes compartilhados:** PageHeader, EmptyState, KPISection, FilterBar, StatusBadge ainda sem testes unitários.
- **Stores Zustand:** authStore, contextStore, filtersStore, drawerStore sem testes unitários.
- **Validação Zod:** Schemas de filtro e domínio (obras, RH, admin, relatórios) sem testes de validação.
