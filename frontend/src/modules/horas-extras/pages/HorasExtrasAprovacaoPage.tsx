import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useApproveHoraExtra, useHorasExtrasAprovacao, useHorasExtrasFilters } from '../hooks';
import {
  HorasExtrasAprovacaoResumoCard,
  HorasExtrasAprovacaoTable,
  HorasExtrasFilters,
  HorasExtrasHistoricoTable,
  HorasExtrasKpiBar,
  HorasExtrasSectionHeader,
} from '../components';

export function HorasExtrasAprovacaoPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useHorasExtrasFilters();

  const { data, isLoading, isError, refetch } = useHorasExtrasAprovacao(filters.competencia);
  const approveMutation = useApproveHoraExtra();

  const filteredAprovacoes = useMemo(() => {
    const items = data?.aprovacoes ?? [];

    return items.filter((item) => {
      const searchBase = `${item.funcionarioNome} ${item.obraNome} ${item.matricula}`.toLowerCase();
      const matchesSearch = !filters.search || searchBase.includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesTipo = !filters.tipo || item.tipo === filters.tipo;

      return matchesSearch && matchesStatus && matchesTipo;
    });
  }, [data?.aprovacoes, filters.search, filters.status, filters.tipo]);

  const filteredHistorico = useMemo(() => {
    const items = data?.historico ?? [];

    return items.filter((item) => {
      const searchBase = `${item.funcionarioNome} ${item.obraNome} ${item.descricao}`.toLowerCase();
      return !filters.search || searchBase.includes(filters.search.toLowerCase());
    });
  }, [data?.historico, filters.search]);

  const kpis = data
    ? {
        totalLancamentos: filteredAprovacoes.length,
        pendentesAprovacao: data.kpis.pendentes,
        aprovadas: filteredAprovacoes.filter((item) => item.status === 'aprovada').length,
        fechadasParaFopag: filteredAprovacoes.filter(
          (item) => item.status === 'fechada_para_fopag' || item.status === 'enviada_para_fopag',
        ).length,
        horasTotais: filteredAprovacoes.reduce((acc, item) => acc + item.quantidadeHoras, 0),
        valorTotal: filteredAprovacoes.reduce((acc, item) => acc + item.valorCalculado, 0),
      }
    : null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Aprovação de Horas Extras"
        subtitle="Fila de aprovação e rastreabilidade por competência, com conexão explícita entre RH, Obra e FOPAG."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/horas-extras"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Voltar ao painel
            </Link>
            <Link
              to="/horas-extras/fechamento"
              className="inline-flex items-center rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              Ir para fechamento
            </Link>
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

      {kpis && <HorasExtrasKpiBar kpis={kpis} />}

      <MainContent className="space-y-6">
        <HorasExtrasSectionHeader
          title="Aprovação e histórico operacional"
          description="Leitura real das pendências por competência, com trilha dos eventos que alimentam fechamento e FOPAG."
          actionLabel="Abrir FOPAG"
          actionHref="/fopag"
        />

        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando fila de aprovação...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar aprovação"
            description="Não foi possível carregar a fila de aprovação e o histórico operacional."
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

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-2">
              {data.resumoCards.map((card) => (
                <HorasExtrasAprovacaoResumoCard key={card.id} card={card} />
              ))}
            </section>

            {filteredAprovacoes.length === 0 ? (
              <EmptyState
                title="Nenhuma pendência encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhum lançamento corresponde aos filtros aplicados.'
                    : 'Não há lançamentos elegíveis para aprovação nesta leitura.'
                }
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Fila de aprovação</h2>
                  <p className="text-sm text-gray-500">
                    Lançamentos que precisam de análise ou já seguem em direção ao fechamento/FOPAG.
                  </p>
                </div>
                <HorasExtrasAprovacaoTable items={filteredAprovacoes} onApprove={(id) => void approveMutation.mutateAsync(id)} approvingId={approveMutation.variables ?? null} />
              </section>
            )}

            {filteredHistorico.length === 0 ? (
              <EmptyState
                title="Sem histórico operacional"
                description="Não há eventos históricos para a competência e filtros informados."
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Histórico por competência e lançamento
                  </h2>
                  <p className="text-sm text-gray-500">
                    Trilha de auditoria dos eventos que conectam Obra, RH, Horas Extras, FOPAG e Financeiro.
                  </p>
                </div>
                <HorasExtrasHistoricoTable items={filteredHistorico} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
