import { Link } from 'react-router-dom';
import { TrendingDown } from 'lucide-react';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { FinanceiroFilters, TitulosFinanceirosTable } from '../components';
import { useContasPagar, useFinanceiroFilters } from '../hooks';

export function ContasPagarPage() {
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

  const { data, isLoading, isError, refetch } = useContasPagar(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro · Contas a pagar"
        subtitle="Saídas financeiras ligadas a FOPAG, compras e obrigações fiscais com programação de desembolso por obra."
        actions={
          <Link to="/financeiro/fluxo" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <TrendingDown size={16} />
            Ver no fluxo
          </Link>
        }
      />
      <ContextBar />
      <FinanceiroFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo="pagar"
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
      <MainContent>
        {isLoading && <p className="text-sm text-gray-500">Carregando contas a pagar...</p>}
        {isError && (
          <EmptyState
            title="Erro ao carregar contas a pagar"
            description="Não foi possível listar os compromissos financeiros do período atual."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white">Tentar novamente</button>}
          />
        )}
        {!isLoading && !isError && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-gray-900">Programação de saída</h2>
              <p className="mt-1 text-sm text-gray-500">Contas a pagar preservam vínculo com obra, centro de custo, competência e módulo de origem para apoiar aprovação e execução do caixa.</p>
            </div>
            {!data || data.length === 0 ? (
              <EmptyState
                title="Nenhuma conta a pagar encontrada"
                description="Os filtros atuais não retornaram compromissos financeiros a pagar."
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
