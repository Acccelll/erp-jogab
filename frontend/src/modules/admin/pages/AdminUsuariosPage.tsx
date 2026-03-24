import { useUsuarios, useAdminFilters } from '../hooks';
import { AdminFilters, AdminPreviewPlaceholder, AdminTable } from '../components';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';

export function AdminUsuariosPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = useUsuarios(filters);
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração · Usuários"
        subtitle="Gestão de acesso administrativo com escopo, último acesso e governança por perfil."
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria="usuarios"
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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando usuários...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar usuários"
            description="Não foi possível carregar os usuários administrativos."
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

        {!isLoading && !isError && data && (
          <>
            <AdminTable
              category="usuarios"
              columns={['Nome', 'Email', 'Perfil', 'Status', 'Escopo', 'Último acesso']}
              rows={items.map((item) => [
                item.nome,
                item.email,
                item.perfilNome,
                item.status,
                item.obraEscopo ?? '—',
                item.ultimoAcessoEm,
              ])}
            />

            <section className="grid gap-4 xl:grid-cols-2">
              {items.slice(0, 2).map((item) => (
                <AdminPreviewPlaceholder
                  key={item.id}
                  title={item.nome}
                  description={`Usuário ${item.email} com perfil ${item.perfilNome} e status ${item.status}.`}
                />
              ))}
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
