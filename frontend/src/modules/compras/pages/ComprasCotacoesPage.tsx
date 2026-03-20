import { useQuery } from '@tanstack/react-query';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { fetchCotacoesCompra } from '../services/compras.service';
import { useCompraFilters } from '../hooks';
import { ComprasFilters, CotacoesCompraTable } from '../components';

export function ComprasCotacoesPage() {
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

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['compras-cotacoes', filters],
    queryFn: () => fetchCotacoesCompra(filters),
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Cotações"
        subtitle="Comparativos iniciais de fornecedores e condições comerciais antes da emissão do pedido."
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
        {isLoading && <p className="text-sm text-gray-500">Carregando cotações...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar cotações"
            description="Não foi possível carregar as cotações em andamento."
            action={
              <button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhuma cotação encontrada"
            description="As solicitações filtradas ainda não avançaram para a etapa de cotação."
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && <CotacoesCompraTable items={data} />}
      </MainContent>
    </div>
  );
}
