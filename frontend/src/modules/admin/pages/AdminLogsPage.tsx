import { useLogs, useAdminFilters } from '../hooks';
import { AdminFilters, AdminTable } from '../components';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';

export function AdminLogsPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = useLogs(filters);
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração · Logs"
        subtitle="Rastreabilidade e auditoria de eventos administrativos e integrações do ERP."
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria="logs"
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
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando logs...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar logs"
            description="Não foi possível carregar os logs administrativos."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <AdminTable
            category="logs"
            columns={['Usuário', 'Ação', 'Módulo', 'Entidade', 'Data', 'Status']}
            rows={items.map((item) => [
              item.usuarioNome,
              item.acao,
              item.modulo,
              item.entidade,
              item.data,
              item.status,
            ])}
          />
        )}
      </MainContent>
    </div>
  );
}
