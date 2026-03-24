import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { FinanceiroFilters, TitulosFinanceirosTable } from '../components';
import { useContasReceber, useFinanceiroFilters } from '../hooks';

export function ContasReceberPage() {
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

  const { data, isLoading, isError, refetch } = useContasReceber(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro · Contas a receber"
        subtitle="Entradas previstas e realizadas conectadas a medições, faturamento, contratos e ajustes financeiros por obra."
        actions={
          <Link
            to="/financeiro/fluxo"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <TrendingUp size={16} />
            Ver no fluxo
          </Link>
        }
      />

      <FinanceiroFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo="receber"
        origem={filters.origem}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onOrigemChange={setOrigem}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        lockTipo
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="py-12 text-center text-sm text-gray-500">
            Carregando contas a receber...
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar contas a receber"
            description="Não foi possível listar as entradas financeiras previstas e realizadas."
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

        {!isLoading && !isError && (
          <div className="space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-gray-900">
                Pipeline de recebimento
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Títulos a receber consolidam medições, faturamento e contratos para apoiar
                a previsão de caixa da obra.
              </p>
            </section>

            {!data || data.length === 0 ? (
              <EmptyState
                title="Nenhuma conta a receber encontrada"
                description="Os filtros atuais não retornaram títulos de entrada financeira."
              />
            ) : (
              <TitulosFinanceirosTable items={data} />
            )}
          </div>
        )}
      </MainContent>
    </div>
  );
}
