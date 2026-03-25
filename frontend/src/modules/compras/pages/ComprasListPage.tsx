import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileStack, PackageCheck, ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState, MainContent, QuickFilterChips } from '@/shared/components';
import { useCompraFilters, useCompras } from '../hooks';
import { ComprasResumoCard, ComprasStatusOverview, PedidosCompraTable, SolicitacoesCompraTable } from '../components';
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
      <div className="flex items-center justify-between border-b border-gray-200/60 px-4 py-2.5">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search ?? ''}
              onChange={(e) => setSearch(e.target.value)}
              className="w-36 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <SlidersHorizontal size={16} />
          </button>
          <Link
            to="/compras/solicitacoes"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FileStack size={14} />
            Solicitações
          </Link>
          <Link
            to="/compras/pedidos"
            className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
          >
            <ShoppingBag size={14} />
            Pedidos
          </Link>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-gray-200/60 bg-gray-50/30 px-4 py-2">
          <select
            value={filters.categoria ?? ''}
            onChange={(e) => setCategoria((e.target.value || undefined) as typeof filters.categoria)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700"
          >
            <option value="">Categoria</option>
            <option value="material">Material</option>
            <option value="servico">Serviço</option>
            <option value="equipamento">Equipamento</option>
          </select>
          <select
            value={filters.prioridade ?? ''}
            onChange={(e) => setPrioridade((e.target.value || undefined) as typeof filters.prioridade)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700"
          >
            <option value="">Prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
              Limpar
            </button>
          )}
        </div>
      )}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-100/60 px-4 py-3">
                <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar compras"
            description="Não foi possível montar a visão consolidada de solicitações, cotações e pedidos."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <ComprasResumoCard key={card.id} card={card} />
              ))}
            </section>

            <ComprasStatusOverview items={data.statusResumo} />

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
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
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
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">Solicitações recentes</h2>
                      <p className="text-xs text-gray-500">Demandas originadas nas obras e nas áreas de apoio.</p>
                    </div>
                    <Link
                      to="/compras/solicitacoes"
                      className="text-xs font-medium text-jogab-600 hover:text-jogab-700"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <SolicitacoesCompraTable items={data.solicitacoes.slice(0, 4)} />
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-jogab-100 bg-jogab-50/70 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-jogab-600">
                        <PackageCheck size={16} />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-gray-900">Integração com Fiscal e Financeiro</h2>
                        <p className="text-xs text-gray-600">
                          {data.kpis.valorAguardandoFiscal > 0
                            ? 'Existem pedidos que ainda dependem de documentação fiscal.'
                            : 'Os pedidos atuais já estão prontos para avançar no fluxo fiscal-financeiro.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-medium text-gray-900">Pedidos em destaque</h2>
                        <p className="text-xs text-gray-500">
                          Pedidos já emitidos com impacto direto em custo comprometido da obra.
                        </p>
                      </div>
                      <Link to="/compras/pedidos" className="text-xs font-medium text-jogab-600 hover:text-jogab-700">
                        Ver todos
                      </Link>
                    </div>
                    <PedidosCompraTable items={data.pedidos.slice(0, 3)} />
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
