import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileStack, PackageCheck, ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState, MainContent, QuickFilterChips, TableSkeleton, ErrorStateView } from '@/shared/components';
import { type ApiError } from '@/shared/lib/api';
import { useCompraFilters, useCompras } from '../hooks';
import { PedidosCompraTable, SolicitacoesCompraTable } from '../components';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

export function ComprasListPage() {
  const { filters, setSearch, setStatus, setCategoria, setPrioridade, clearFilters, hasActiveFilters } =
    useCompraFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError, refetch } = useCompras(filters);

  const statusChips = useMemo<QuickFilterChip[]>(() => {
    if (!data?.kpis) return [];
    return [
      { label: 'Todas', value: null },
      { label: 'Abertas', value: 'aberta', variant: 'info' },
      { label: 'Em cotação', value: 'em_cotacao', variant: 'warning' },
      { label: 'Aprovadas', value: 'aprovada', variant: 'success' },
      { label: 'Entregues', value: 'entregue', variant: 'success' },
    ];
  }, [data?.kpis]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter bar */}
      <div className="flex items-center justify-between border-b border-border-default/60 px-4 py-2.5">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-white px-2.5 py-1 text-sm">
            <Search size={14} className="text-text-subtle" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search ?? ''}
              onChange={(e) => setSearch(e.target.value)}
              className="w-36 border-0 bg-transparent text-sm outline-none placeholder:text-text-subtle"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="rounded-md p-1.5 text-text-subtle hover:bg-surface-soft hover:text-text-muted"
          >
            <SlidersHorizontal size={16} />
          </button>
          <Link
            to="/compras/solicitacoes"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <FileStack size={14} />
            Solicitações
          </Link>
          <Link
            to="/compras/pedidos"
            className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
          >
            <ShoppingBag size={14} />
            Pedidos
          </Link>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-default/60 bg-surface-soft/30 px-4 py-2">
          <select
            value={filters.categoria ?? ''}
            onChange={(e) => setCategoria((e.target.value || undefined) as typeof filters.categoria)}
            className="rounded-md border border-border-default bg-white px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Categoria</option>
            <option value="material">Material</option>
            <option value="servico">Serviço</option>
            <option value="equipamento">Equipamento</option>
          </select>
          <select
            value={filters.prioridade ?? ''}
            onChange={(e) => setPrioridade((e.target.value || undefined) as typeof filters.prioridade)}
            className="rounded-md border border-border-default bg-white px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-sm text-text-muted hover:text-text-body">
              Limpar
            </button>
          )}
        </div>
      )}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
            <TableSkeleton rows={5} cols={4} />
            <TableSkeleton rows={5} cols={4} />
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
            {(data.solicitacoes?.length ?? 0) === 0 && (data.pedidos?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhuma compra encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhuma solicitação ou pedido corresponde aos filtros selecionados.'
                    : 'Cadastre a primeira solicitação para iniciar o fluxo operacional de compras.'
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
              <section className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-medium text-text-strong">Solicitações recentes</h2>
                    <Link
                      to="/compras/solicitacoes"
                      className="text-xs font-medium text-jogab-700 hover:text-jogab-700"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <SolicitacoesCompraTable items={data.solicitacoes.slice(0, 4)} />
                </div>

                <div className="space-y-3">
                  {data.kpis.valorAguardandoFiscal > 0 && (
                    <div className="flex items-start gap-2.5 rounded-md border border-jogab-100 bg-jogab-50/50 p-2.5">
                      <PackageCheck size={14} className="mt-0.5 shrink-0 text-jogab-700" />
                      <p className="text-xs text-text-muted">
                        Existem pedidos que ainda dependem de documentação fiscal.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-medium text-text-strong">Pedidos em destaque</h2>
                    <Link to="/compras/pedidos" className="text-xs font-medium text-jogab-700 hover:text-jogab-700">
                      Ver todos
                    </Link>
                  </div>
                  <PedidosCompraTable items={data.pedidos.slice(0, 3)} />
                </div>
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
