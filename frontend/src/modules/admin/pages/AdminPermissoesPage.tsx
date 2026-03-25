import { usePermissoes, useAdminFilters } from '../hooks';
import { AdminFilters, AdminPreviewPlaceholder, AdminTable } from '../components';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';

export function AdminPermissoesPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = usePermissoes(filters);
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração · Permissões"
        subtitle="Matriz de acesso por módulo, recurso e nível de autorização."
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria="permissoes"
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
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando permissões...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar permissões"
            description="Não foi possível carregar a matriz de permissões."
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
              category="permissoes"
              columns={['Módulo', 'Recurso', 'Nível', 'Perfil', 'Status']}
              rows={items.map((item) => [item.modulo, item.recurso, item.nivel, item.perfilNome, item.status])}
            />

            <section className="grid gap-4 xl:grid-cols-2">
              {items.slice(0, 2).map((item) => (
                <AdminPreviewPlaceholder
                  key={item.id}
                  title={`${item.modulo} · ${item.recurso}`}
                  description={`Perfil ${item.perfilNome} com nível ${item.nivel}.`}
                />
              ))}
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
