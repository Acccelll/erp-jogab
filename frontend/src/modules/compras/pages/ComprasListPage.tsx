import { Link } from 'react-router-dom';
import { FileStack, PackageCheck, ShoppingBag } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useCompraFilters, useCompras } from '../hooks';
import {
  ComprasFilters,
  ComprasKpiBar,
  ComprasResumoCard,
  ComprasStatusOverview,
  PedidosCompraTable,
  SolicitacoesCompraTable,
} from '../components';

export function ComprasListPage() {
  const { filters, setSearch, setStatus, setCategoria, setPrioridade, setCompetencia, clearFilters, hasActiveFilters } =
    useCompraFilters();

  const { data, isLoading, isError, refetch } = useCompras(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Compras"
        subtitle="Solicitações, cotações e pedidos conectados à obra, com preparação para integração fiscal e programação financeira."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/compras/solicitacoes"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FileStack size={16} />
              Solicitações
            </Link>
            <Link
              to="/compras/pedidos"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <ShoppingBag size={16} />
              Pedidos
            </Link>
          </div>
        }
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

      {data?.kpis && <ComprasKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando visão de compras...</p>
            </div>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Solicitações recentes</h2>
                      <p className="text-sm text-gray-500">Demandas originadas nas obras e nas áreas de apoio.</p>
                    </div>
                    <Link
                      to="/compras/solicitacoes"
                      className="text-sm font-medium text-jogab-600 hover:text-jogab-700"
                    >
                      Ver todas
                    </Link>
                  </div>
                  <SolicitacoesCompraTable items={data.solicitacoes.slice(0, 4)} />
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-jogab-100 bg-jogab-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-jogab-600">
                        <PackageCheck size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">Integração com Fiscal e Financeiro</h2>
                        <p className="text-sm text-gray-600">
                          {data.kpis.valorAguardandoFiscal > 0
                            ? 'Existem pedidos que ainda dependem de documentação fiscal antes de consolidar programação financeira.'
                            : 'Os pedidos atuais já estão prontos para avançar no fluxo fiscal-financeiro.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Pedidos em destaque</h2>
                        <p className="text-sm text-gray-500">
                          Pedidos já emitidos com impacto direto em custo comprometido da obra.
                        </p>
                      </div>
                      <Link to="/compras/pedidos" className="text-sm font-medium text-jogab-600 hover:text-jogab-700">
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
