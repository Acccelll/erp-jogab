import { ReceiptText, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useMedicoes, useMedicoesFilters } from '../hooks';
import { MedicoesFilters, MedicoesKpiBar, MedicoesOverview, MedicoesResumoCard, MedicoesTable } from '../components';

export function MedicoesListPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setAprovacaoStatus,
    setFaturamentoStatus,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useMedicoesFilters();

  const { data, isLoading, isError, refetch } = useMedicoes(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Medições e Faturamento"
        subtitle="Medições por obra e contrato com preparação para aprovação, faturamento e integração com Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/financeiro/contas-receber"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Wallet size={16} />
              Contas a receber
            </Link>
            <Link
              to="/obras"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <ReceiptText size={16} />
              Ver Obras
            </Link>
          </div>
        }
      />

      <MedicoesFilters
        search={filters.search ?? ''}
        status={filters.status}
        aprovacaoStatus={filters.aprovacaoStatus}
        faturamentoStatus={filters.faturamentoStatus}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onAprovacaoStatusChange={setAprovacaoStatus}
        onFaturamentoStatusChange={setFaturamentoStatus}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      {data?.kpis && <MedicoesKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando visão de medições...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar medições"
            description="Não foi possível montar a visão principal de medições, aprovação e faturamento."
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
                <MedicoesResumoCard key={card.id} card={card} />
              ))}
            </section>

            <MedicoesOverview statusItems={data.statusResumo} competenciaItems={data.competenciaResumo} />

            {(data.medicoes?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhuma medição encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhuma medição corresponde aos filtros selecionados.'
                    : 'Ainda não há medições disponíveis para o contexto atual.'
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
                    <h2 className="text-lg font-semibold text-gray-900">Listagem de medições</h2>
                    <p className="text-sm text-gray-500">
                      Leitura consolidada do avanço medido por obra, contrato, aprovação e faturamento.
                    </p>
                  </div>
                </div>
                <MedicoesTable items={data.medicoes} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
