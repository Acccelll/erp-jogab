import { Landmark, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { FinanceiroFilters, FinanceiroKpiBar, FinanceiroResumoCard, FinanceiroVisaoStatusTipo, TitulosFinanceirosTable } from '../components';
import { useFinanceiro, useFinanceiroFilters } from '../hooks';

export function FinanceiroListPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setOrigem,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useFinanceiroFilters();

  const { data, isLoading, isError, refetch } = useFinanceiro(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro"
        subtitle="Programação financeira com integração conceitual entre Obra, FOPAG, Compras, Fiscal e Medições."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/financeiro/fluxo" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Landmark size={16} />
              Fluxo de caixa
            </Link>
            <Link to="/financeiro/contas-pagar" className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600">
              <TrendingDown size={16} />
              Contas a pagar
            </Link>
            <Link to="/financeiro/contas-receber" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <TrendingUp size={16} />
              Contas a receber
            </Link>
          </div>
        }
      />

      <ContextBar />

      <FinanceiroFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        origem={filters.origem}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onOrigemChange={setOrigem}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <FinanceiroKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando visão financeira...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar Financeiro"
            description="Não foi possível montar a visão consolidada de caixa, contas a pagar e contas a receber."
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
                <FinanceiroResumoCard key={card.id} card={card} />
              ))}
            </section>

            <FinanceiroVisaoStatusTipo statusItems={data.statusResumo} tipoItems={data.tipoResumo} />

            {data.titulos.length === 0 ? (
              <EmptyState
                title="Nenhum título encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum título corresponde aos filtros selecionados para o módulo Financeiro.'
                    : 'A base financeira ainda não possui títulos disponíveis para a competência atual.'
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
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Títulos financeiros</h2>
                    <p className="text-sm text-gray-500">Leitura consolidada dos títulos com vínculo de obra, competência, origem e status.</p>
                  </div>
                  <Link to="/financeiro/fluxo" className="text-sm font-medium text-jogab-600 hover:text-jogab-700">
                    Ver fluxo projetado
                  </Link>
                </div>
                <TitulosFinanceirosTable items={data.titulos} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
