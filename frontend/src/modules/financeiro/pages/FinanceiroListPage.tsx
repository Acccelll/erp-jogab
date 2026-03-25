import { useState, useMemo } from 'react';
import { Landmark, TrendingDown, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, StatusBadge, QuickFilterChips } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { TitulosFinanceirosTable } from '../components';
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
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2.5">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm">
            <Search size={14} className="text-text-subtle" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search ?? ''}
              onChange={(e) => setSearch(e.target.value)}
              className="w-36 border-0 bg-transparent text-sm outline-none placeholder:text-text-subtle"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="rounded-md p-1.5 text-text-subtle hover:bg-surface-soft hover:text-text-muted"
          >
            <SlidersHorizontal size={16} />
          </button>
          <Link
            to="/financeiro/fluxo"
            className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <Landmark size={14} />
            Fluxo de caixa
          </Link>
          <Link
            to="/financeiro/contas-pagar"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-primary-hover"
          >
            <TrendingDown size={14} />
            Contas a pagar
          </Link>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-light bg-surface-muted px-4 py-2">
          <select
            value={filters.tipo ?? ''}
            onChange={(e) => setTipo((e.target.value || undefined) as typeof filters.tipo)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Tipo</option>
            <option value="pagar">A pagar</option>
            <option value="receber">A receber</option>
          </select>
          <select
            value={filters.origem ?? ''}
            onChange={(e) => setOrigem((e.target.value || undefined) as typeof filters.origem)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Origem</option>
            <option value="compras">Compras</option>
            <option value="fopag">FOPAG</option>
            <option value="medicoes">Medições</option>
            <option value="manual">Manual</option>
          </select>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-sm text-text-muted hover:text-text-body">
              Limpar
            </button>
          )}
        </div>
      )}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-border-light px-4 py-3">
                <div className="h-4 w-2/5 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
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
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            {pessoal && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-medium text-text-strong">Custo de pessoal por obra</h2>
                    <p className="text-xs text-text-muted">
                      Reflexo consolidado do fluxo Horas Extras → FOPAG → Financeiro.
                    </p>
                  </div>
                  <StatusBadge
                    label={pessoal.competencia.statusFechamento}
                    variant={FECHAMENTO_VARIANTS[pessoal.competencia.statusFechamento]}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{formatCompetencia(pessoal.competencia.competencia)}</span>
                  <span>{pessoal.competencia.totalFuncionarios} func.</span>
                  <span>{pessoal.competencia.totalObras} obras</span>
                  <span>{pessoal.competencia.totalCentrosCusto} CC</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-default bg-surface-muted">
                        <th className="px-3 py-1.5 text-left text-xs font-medium text-text-muted">Obra</th>
                        <th className="px-3 py-1.5 text-right text-xs font-medium text-text-muted">HE previsto</th>
                        <th className="px-3 py-1.5 text-right text-xs font-medium text-text-muted">FOPAG prevista</th>
                        <th className="px-3 py-1.5 text-right text-xs font-medium text-text-muted">Previsto</th>
                        <th className="px-3 py-1.5 text-right text-xs font-medium text-text-muted">Realizado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {pessoal.porObra.map((item) => (
                        <tr key={item.obraId} className="hover:bg-surface-soft">
                          <td className="px-3 py-1.5 align-top">
                            <div className="text-sm font-medium text-text-strong">{item.obraNome}</div>
                            <div className="text-xs text-text-muted">
                              {item.totalFuncionarios} func. · {item.totalCentrosCusto} CC
                            </div>
                          </td>
                          <td className="px-3 py-1.5 text-right text-text-body">
                            {formatCurrency(item.valorHorasExtrasPrevisto)}
                          </td>
                          <td className="px-3 py-1.5 text-right text-text-body">
                            {formatCurrency(item.valorFopagPrevisto)}
                          </td>
                          <td className="px-3 py-1.5 text-right font-medium text-text-strong">
                            {formatCurrency(item.valorPrevisto)}
                          </td>
                          <td className="px-3 py-1.5 text-right text-text-body">
                            {formatCurrency(item.valorRealizado)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

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
                      className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
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
                    <h2 className="text-sm font-medium text-text-strong">Títulos financeiros</h2>
                    <p className="text-xs text-text-muted">
                      Leitura consolidada dos títulos com vínculo de obra, competência, origem e status.
                    </p>
                  </div>
                  <Link to="/financeiro/fluxo" className="text-xs font-medium text-accent-600 hover:text-accent-700">
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
