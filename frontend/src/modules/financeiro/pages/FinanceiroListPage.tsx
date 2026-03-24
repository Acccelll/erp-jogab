import { Landmark, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader, StatusBadge } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import {
  FinanceiroFilters,
  FinanceiroKpiBar,
  FinanceiroResumoCard,
  FinanceiroVisaoStatusTipo,
  TitulosFinanceirosTable,
} from '../components';
import { useFinanceiro, useFinanceiroFilters, useFinanceiroPessoal } from '../hooks';

const FECHAMENTO_VARIANTS = {
  aberta: 'warning',
  parcial: 'info',
  fechada: 'success',
} as const;

export function FinanceiroListPage() {
  const { filters, setSearch, setStatus, setTipo, setOrigem, setCompetencia, clearFilters, hasActiveFilters } =
    useFinanceiroFilters();

  const { data, isLoading, isError, refetch } = useFinanceiro(filters);
  const { data: pessoal } = useFinanceiroPessoal(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro"
        subtitle="Programação financeira com integração conceitual entre Obra, FOPAG, Horas Extras, Compras, Fiscal e Medições."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/financeiro/fluxo"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Landmark size={16} />
              Fluxo de caixa
            </Link>
            <Link
              to="/financeiro/contas-pagar"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <TrendingDown size={16} />
              Contas a pagar
            </Link>
            <Link
              to="/financeiro/contas-receber"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <TrendingUp size={16} />
              Contas a receber
            </Link>
          </div>
        }
      />

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

            {pessoal && (
              <>
                <section className="grid gap-4 xl:grid-cols-3">
                  {pessoal.destaques.map((card) => (
                    <FinanceiroResumoCard key={card.id} card={card} />
                  ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
                  <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">
                          Custo de pessoal por competência e obra
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Reflexo consolidado do fluxo Horas Extras → FOPAG → Financeiro, preservando Obra e centro de
                          custo.
                        </p>
                      </div>
                      <StatusBadge
                        label={pessoal.competencia.statusFechamento}
                        variant={FECHAMENTO_VARIANTS[pessoal.competencia.statusFechamento]}
                      />
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Competência</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatCompetencia(pessoal.competencia.competencia)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Funcionários</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {pessoal.competencia.totalFuncionarios}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Obras</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{pessoal.competencia.totalObras}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Centros de custo</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {pessoal.competencia.totalCentrosCusto}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">HE previsto</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">FOPAG prevista</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {pessoal.porObra.map((item) => (
                            <tr key={item.obraId} className="hover:bg-gray-50/70">
                              <td className="px-4 py-3 align-top">
                                <div className="font-medium text-gray-900">{item.obraNome}</div>
                                <div className="text-xs text-gray-500">
                                  {item.totalFuncionarios} funcionário(s) · {item.totalCentrosCusto} centro(s)
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatCurrency(item.valorHorasExtrasPrevisto)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatCurrency(item.valorFopagPrevisto)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {formatCurrency(item.valorPrevisto)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatCurrency(item.valorRealizado)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                    <h2 className="text-base font-semibold text-gray-900">Previsto x realizado de pessoal</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Leitura gerencial mínima para apoiar relatórios e comparativos financeiros futuros.
                    </p>
                    <div className="mt-4 space-y-3">
                      {pessoal.previstoRealizado.map((item) => (
                        <div key={item.id} className="rounded-lg bg-gray-50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                            <span className="text-xs text-gray-500">Δ {formatCurrency(item.variacao)}</span>
                          </div>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-400">Previsto</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatCurrency(item.valorPrevisto)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-400">Realizado</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {formatCurrency(item.valorRealizado)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Centro de custo</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {pessoal.porCentroCusto.slice(0, 5).map((item) => (
                            <tr key={item.centroCustoId} className="hover:bg-gray-50/70">
                              <td className="px-4 py-3 font-medium text-gray-900">{item.centroCustoNome}</td>
                              <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                              <td className="px-4 py-3 text-right text-gray-700">
                                {formatCurrency(item.valorPrevisto)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                </section>
              </>
            )}

            <FinanceiroVisaoStatusTipo statusItems={data.statusResumo} tipoItems={data.tipoResumo} />

            {(data.titulos?.length ?? 0) === 0 ? (
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
                    <p className="text-sm text-gray-500">
                      Leitura consolidada dos títulos com vínculo de obra, competência, origem e status.
                    </p>
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
