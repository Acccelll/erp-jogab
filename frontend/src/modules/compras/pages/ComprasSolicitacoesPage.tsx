import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useCompraFilters, useSolicitacoesCompra } from '../hooks';
import { ComprasFilters, SolicitacoesCompraTable } from '../components';

export function ComprasSolicitacoesPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setCategoria,
    setPrioridade,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useCompraFilters();

  const { data, isLoading, isError, refetch } = useSolicitacoesCompra(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Solicitações de Compra"
        subtitle="Demandas originadas por obra, suprimentos e áreas administrativas antes da fase de cotação e pedido."
      />

      <ComprasFilters
        search={filters.search ?? ''}
        status={filters.status}
        categoria={filters.categoria}
        prioridade={filters.prioridade}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCategoriaChange={setCategoria}
        onPrioridadeChange={setPrioridade}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <MainContent className="space-y-4">
        {isLoading && <p className="text-sm text-gray-500">Carregando solicitações...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar solicitações"
            description="Não foi possível carregar as solicitações de compra."
            action={
              <button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhuma solicitação encontrada"
            description="Ajuste os filtros ou registre novas demandas para alimentar o fluxo de compras."
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && <SolicitacoesCompraTable items={data} />}
      </MainContent>
    </div>
  );
}
