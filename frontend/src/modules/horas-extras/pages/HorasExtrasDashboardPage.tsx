import { Link } from 'react-router-dom';
import { Plus, FileCheck2, CalendarRange, Clock3 } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useHorasExtras, useHorasExtrasFilters } from '../hooks';
import {
  HorasExtrasAprovacaoPlaceholder,
  HorasExtrasFilters,
  HorasExtrasKpiBar,
  HorasExtrasResumoCard,
  HorasExtrasTable,
} from '../components';

export function HorasExtrasDashboardPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useHorasExtrasFilters();

  const { data, isLoading, isError, refetch } = useHorasExtras(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Horas Extras"
        subtitle="Lançamentos operacionais, aprovação e preparação do fechamento por competência com reflexo em RH, FOPAG e custo da obra."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/horas-extras/fechamento"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <CalendarRange size={16} />
              Fechamento
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-jogab-600"
            >
              <Plus size={16} />
              Novo lançamento
            </button>
          </div>
        }
      />

      <HorasExtrasFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <HorasExtrasKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando horas extras...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar lançamentos de horas extras"
            description="Não foi possível carregar os lançamentos e o resumo operacional desta competência."
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
                <HorasExtrasResumoCard key={card.id} card={card} />
              ))}
            </section>

            {data.fechamentoAtual && (
              <section className="rounded-xl border border-jogab-100 bg-jogab-50/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-jogab-600">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Fechamento da competência em andamento</h2>
                      <p className="text-sm text-gray-600">
                        Há {data.fechamentoAtual.pendentesAprovacao} pendência(s) antes do envio para FOPAG.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/horas-extras/aprovacao"
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FileCheck2 size={16} />
                      Aprovação
                    </Link>
                    <Link
                      to="/horas-extras/fechamento"
                      className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-jogab-600"
                    >
                      <CalendarRange size={16} />
                      Ver fechamento
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {data.data.length === 0 ? (
              <EmptyState
                title="Nenhum lançamento encontrado"
                description={hasActiveFilters ? 'Nenhum lançamento corresponde aos filtros selecionados.' : 'Cadastre o primeiro lançamento de horas extras para iniciar o processo operacional.'}
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
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lançamentos</h2>
                  <p className="text-sm text-gray-500">Lista inicial dos eventos operacionais que alimentarão aprovação, fechamento e FOPAG.</p>
                </div>
                <HorasExtrasTable items={data.data} />
              </section>
            )}

            <HorasExtrasAprovacaoPlaceholder />
          </>
        )}
      </MainContent>
    </div>
  );
}
