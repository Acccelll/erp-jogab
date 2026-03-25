import { useState, useMemo } from 'react';
import { Landmark, TrendingDown, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, StatusBadge, QuickFilterChips } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FinanceiroResumoCard, FinanceiroVisaoStatusTipo, TitulosFinanceirosTable } from '../components';
import { useFinanceiro, useFinanceiroFilters, useFinanceiroPessoal } from '../hooks';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

const FECHAMENTO_VARIANTS = {
  aberta: 'warning',
  parcial: 'info',
  fechada: 'success',
} as const;

export function FinanceiroListPage() {
  const { filters, setSearch, setStatus, setTipo, setOrigem, clearFilters, hasActiveFilters } = useFinanceiroFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError, refetch } = useFinanceiro(filters);
  const { data: pessoal } = useFinanceiroPessoal(filters);

  const statusChips = useMemo<QuickFilterChip[]>(() => {
    return [
      { label: 'Todos', value: null },
      { label: 'A vencer', value: 'a_vencer', variant: 'warning' },
      { label: 'Vencidos', value: 'vencido', variant: 'danger' },
      { label: 'Pagos', value: 'pago', variant: 'success' },
    ];
  }, []);

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
            to="/financeiro/fluxo"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Landmark size={14} />
            Fluxo de caixa
          </Link>
          <Link
            to="/financeiro/contas-pagar"
            className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
          >
            <TrendingDown size={14} />
            Contas a pagar
          </Link>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-gray-200/60 bg-gray-50/30 px-4 py-2">
          <select
            value={filters.tipo ?? ''}
            onChange={(e) => setTipo((e.target.value || undefined) as typeof filters.tipo)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700"
          >
            <option value="">Tipo</option>
            <option value="pagar">A pagar</option>
            <option value="receber">A receber</option>
          </select>
          <select
            value={filters.origem ?? ''}
            onChange={(e) => setOrigem((e.target.value || undefined) as typeof filters.origem)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700"
          >
            <option value="">Origem</option>
            <option value="compras">Compras</option>
            <option value="fopag">FOPAG</option>
            <option value="medicoes">Medições</option>
            <option value="manual">Manual</option>
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
                  <article className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-sm font-medium text-gray-900">Custo de pessoal por competência e obra</h2>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Reflexo consolidado do fluxo Horas Extras → FOPAG → Financeiro.
                        </p>
                      </div>
                      <StatusBadge
                        label={pessoal.competencia.statusFechamento}
                        variant={FECHAMENTO_VARIANTS[pessoal.competencia.statusFechamento]}
                      />
                    </div>

                    <div className="mt-3 grid gap-2 md:grid-cols-4">
                      <div className="rounded-md bg-gray-50 px-3 py-1.5">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Competência</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {formatCompetencia(pessoal.competencia.competencia)}
                        </p>
                      </div>
                      <div className="rounded-md bg-gray-50 px-3 py-1.5">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Funcionários</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {pessoal.competencia.totalFuncionarios}
                        </p>
                      </div>
                      <div className="rounded-md bg-gray-50 px-3 py-1.5">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Obras</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">{pessoal.competencia.totalObras}</p>
                      </div>
                      <div className="rounded-md bg-gray-50 px-3 py-1.5">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Centros de custo</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {pessoal.competencia.totalCentrosCusto}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200/60">
                            <th className="px-4 py-1.5 text-left text-xs font-medium text-gray-500">Obra</th>
                            <th className="px-4 py-1.5 text-right text-xs font-medium text-gray-500">HE previsto</th>
                            <th className="px-4 py-1.5 text-right text-xs font-medium text-gray-500">FOPAG prevista</th>
                            <th className="px-4 py-1.5 text-right text-xs font-medium text-gray-500">Previsto</th>
                            <th className="px-4 py-1.5 text-right text-xs font-medium text-gray-500">Realizado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/60">
                          {pessoal.porObra.map((item) => (
                            <tr key={item.obraId} className="hover:bg-gray-50/50">
                              <td className="px-4 py-1.5 align-top">
                                <div className="font-medium text-gray-900 text-sm">{item.obraNome}</div>
                                <div className="text-xs text-gray-500">
                                  {item.totalFuncionarios} func. · {item.totalCentrosCusto} CC
                                </div>
                              </td>
                              <td className="px-4 py-1.5 text-right text-gray-700">
                                {formatCurrency(item.valorHorasExtrasPrevisto)}
                              </td>
                              <td className="px-4 py-1.5 text-right text-gray-700">
                                {formatCurrency(item.valorFopagPrevisto)}
                              </td>
                              <td className="px-4 py-1.5 text-right font-medium text-gray-900">
                                {formatCurrency(item.valorPrevisto)}
                              </td>
                              <td className="px-4 py-1.5 text-right text-gray-700">
                                {formatCurrency(item.valorRealizado)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  <article className="rounded-lg border border-gray-200 bg-white p-4">
                    <h2 className="text-sm font-medium text-gray-900">Previsto x realizado de pessoal</h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Leitura gerencial mínima para apoiar relatórios e comparativos financeiros futuros.
                    </p>
                    <div className="mt-3 space-y-2">
                      {pessoal.previstoRealizado.map((item) => (
                        <div key={item.id} className="rounded-md bg-gray-50 p-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <span className="text-xs text-gray-500">Δ {formatCurrency(item.variacao)}</span>
                          </div>
                          <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-gray-400">Previsto</p>
                              <p className="mt-0.5 text-sm font-medium text-gray-900">
                                {formatCurrency(item.valorPrevisto)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-gray-400">Realizado</p>
                              <p className="mt-0.5 text-sm font-medium text-gray-900">
                                {formatCurrency(item.valorRealizado)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200/60">
                            <th className="px-4 py-1.5 text-left text-xs font-medium text-gray-500">Centro de custo</th>
                            <th className="px-4 py-1.5 text-left text-xs font-medium text-gray-500">Obra</th>
                            <th className="px-4 py-1.5 text-right text-xs font-medium text-gray-500">Previsto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/60">
                          {pessoal.porCentroCusto.slice(0, 5).map((item) => (
                            <tr key={item.centroCustoId} className="hover:bg-gray-50/50">
                              <td className="px-4 py-1.5 font-medium text-gray-900">{item.centroCustoNome}</td>
                              <td className="px-4 py-1.5 text-gray-700">{item.obraNome}</td>
                              <td className="px-4 py-1.5 text-right text-gray-700">
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
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">Títulos financeiros</h2>
                    <p className="text-xs text-gray-500">
                      Leitura consolidada dos títulos com vínculo de obra, competência, origem e status.
                    </p>
                  </div>
                  <Link to="/financeiro/fluxo" className="text-xs font-medium text-jogab-600 hover:text-jogab-700">
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
