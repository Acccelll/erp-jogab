import { ArrowRightLeft, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader, TableSkeleton, CardSkeleton, ErrorStateView } from '@/shared/components';
import { type ApiError } from '@/shared/lib/api';
import { useEstoque, useEstoqueFilters } from '../hooks';
import { EstoqueFilters, EstoqueItensTable, EstoqueKpiBar, EstoqueResumoCard, EstoqueVisaoGeral } from '../components';

export function EstoqueListPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setLocalId,
    setCompetencia,
    setMovimentacaoTipo,
    clearFilters,
    hasActiveFilters,
  } = useEstoqueFilters();
  const { data, isLoading, isError, refetch } = useEstoque(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Estoque"
        subtitle="Visão operacional de itens, saldos e rastreabilidade por obra, almoxarifado e integração com Compras, Fiscal e Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/estoque/movimentacoes"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
            >
              <ArrowRightLeft size={16} />
              Movimentações
            </Link>
            <Link
              to="/compras"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
            >
              <Boxes size={16} />
              Ir para Compras
            </Link>
          </div>
        }
      />

      <EstoqueFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        localId={filters.localId}
        competencia={filters.competencia}
        movimentacaoTipo={filters.movimentacaoTipo}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onLocalIdChange={setLocalId}
        onCompetenciaChange={setCompetencia}
        onMovimentacaoTipoChange={setMovimentacaoTipo}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <EstoqueKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-3">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </div>
            <TableSkeleton rows={8} cols={6} />
          </div>
        )}

        {isError && (
          <ErrorStateView
            type={(data as unknown as ApiError)?.type ?? 'unknown'}
            status={(data as unknown as ApiError)?.status}
            onRetry={() => void refetch()}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <EstoqueResumoCard key={card.id} card={card} />
              ))}
            </section>

            <EstoqueVisaoGeral
              statusItems={data.statusResumo}
              localItems={data.localResumo}
              tipoItems={data.tipoResumo}
            />

            {(data.itens?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhum item encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum item de estoque corresponde aos filtros selecionados.'
                    : 'Ainda não há itens disponíveis para a competência atual.'
                }
                action={
                  hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                    >
                      Limpar filtros
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-text-strong">Itens de estoque</h2>
                    <p className="text-sm text-text-muted">
                      Saldos por item, local e obra com leitura de consumo e rastreabilidade de origem.
                    </p>
                  </div>
                  <Link to="/estoque/movimentacoes" className="text-sm font-medium text-jogab-700 hover:text-jogab-700">
                    Ver movimentações
                  </Link>
                </div>
                <EstoqueItensTable items={data.itens} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
