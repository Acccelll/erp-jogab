import { TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { FinanceiroFilters, TitulosFinanceirosTable } from '../components';
import { useContasPagar, useFinanceiroFilters } from '../hooks';

export function ContasPagarPage() {
  const { filters, setSearch, setStatus, setTipo, setOrigem, setCompetencia, clearFilters, hasActiveFilters } =
    useFinanceiroFilters();

  const { data, isLoading, isError, refetch } = useContasPagar(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro · Contas a pagar"
        subtitle="Saídas financeiras ligadas a FOPAG, compras e obrigações fiscais com programação de desembolso por obra."
        actions={
          <Link
            to="/financeiro/fluxo"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <TrendingDown size={16} />
            Ver no fluxo
          </Link>
        }
      />

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

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando contas a pagar...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar contas a pagar"
            description="Não foi possível listar os compromissos financeiros do período atual."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            <section className="rounded-xl border border-border-default bg-white p-4 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-text-strong">Programação de saída</h2>
              <p className="mt-1 text-sm text-text-muted">
                Contas a pagar preservam vínculo com obra, centro de custo, competência e módulo de origem para apoiar
                aprovação e execução do caixa.
              </p>
            </section>

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
