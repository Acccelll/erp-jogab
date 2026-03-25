import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useCompraFilters, usePedidosCompra } from '../hooks';
import { ComprasFilters, PedidosCompraTable } from '../components';

export function ComprasPedidosPage() {
  const { filters, setSearch, setStatus, setCategoria, setPrioridade, setCompetencia, clearFilters, hasActiveFilters } =
    useCompraFilters();

  const { data, isLoading, isError, refetch } = usePedidosCompra(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Pedidos de Compra"
        subtitle="Pedidos emitidos com leitura de fornecedor, obra, integração fiscal e comprometimento financeiro."
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
        {isLoading && <p className="text-sm text-text-muted">Carregando pedidos...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar pedidos"
            description="Não foi possível carregar os pedidos de compra."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhum pedido encontrado"
            description="As compras filtradas ainda não avançaram para a emissão de pedido."
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && <PedidosCompraTable items={data} />}
      </MainContent>
    </div>
  );
}
