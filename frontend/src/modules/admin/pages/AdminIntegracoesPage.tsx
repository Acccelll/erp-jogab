import { useIntegracoes, useAdminFilters } from '../hooks';
import { AdminFilters, AdminPreviewPlaceholder, AdminTable } from '../components';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';

export function AdminIntegracoesPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = useIntegracoes(filters);
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração · Integrações"
        subtitle="Saúde das integrações sistêmicas com foco em autenticação, sincronização e governança."
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria="integracoes"
        status={filters.status}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onStatusChange={setStatus}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando integrações...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar integrações"
            description="Não foi possível carregar o estado das integrações."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <AdminTable
              category="integracoes"
              columns={['Integração', 'Descrição', 'Status', 'Última sincronização']}
              rows={items.map((item) => [item.nome, item.descricao, item.status, item.ultimaSincronizacaoEm ?? '—'])}
            />

            <section className="grid gap-4 xl:grid-cols-2">
              {items.slice(0, 2).map((item) => (
                <AdminPreviewPlaceholder
                  key={item.id}
                  title={item.nome}
                  description={`${item.descricao} Status atual: ${item.status}.`}
                />
              ))}
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
