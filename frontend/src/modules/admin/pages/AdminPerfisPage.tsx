import { usePerfis, useAdminFilters } from '../hooks';
import { AdminFilters, AdminPreviewPlaceholder, AdminTable } from '../components';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';

export function AdminPerfisPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = usePerfis(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração · Perfis"
        subtitle="Perfis funcionais que estruturam governança, segregação de funções e escopos de acesso."
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria="perfis"
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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando perfis...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar perfis"
            description="Não foi possível carregar os perfis administrativos."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading &&
          !isError &&
          data &&
          (() => {
            const items = Array.isArray(data) ? data : [];
            return (
              <>
                <AdminTable
                  category="perfis"
                  columns={['Perfil', 'Descrição', 'Usuários', 'Status']}
                  rows={items.map((item) => [item.nome, item.descricao, String(item.usuarios), item.status])}
                />

                <section className="grid gap-4 xl:grid-cols-2">
                  {items.slice(0, 2).map((item) => (
                    <AdminPreviewPlaceholder key={item.id} title={item.nome} description={item.descricao} />
                  ))}
                </section>
              </>
            );
          })()}
      </MainContent>
    </div>
  );
}
