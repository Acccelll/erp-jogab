import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileCheck2, CalendarRange, Clock3, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState, MainContent, QuickFilterChips } from '@/shared/components';
import { useHorasExtras, useHorasExtrasFilters } from '../hooks';
import { HorasExtrasTable } from '../components';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

export function HorasExtrasDashboardPage() {
  const { filters, setSearch, setStatus, setTipo, clearFilters, hasActiveFilters } = useHorasExtrasFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError, refetch } = useHorasExtras(filters);

  const statusChips = useMemo<QuickFilterChip[]>(() => {
    if (!data?.kpis) return [];
    const kpis = data.kpis;
    return [
      { label: 'Todos', value: null, count: kpis.totalLancamentos },
      { label: 'Pendentes', value: 'pendente_aprovacao', count: kpis.pendentesAprovacao, variant: 'warning' },
      { label: 'Aprovadas', value: 'aprovada', count: kpis.aprovadas, variant: 'success' },
      { label: 'Fechadas', value: 'fechada_para_fopag', count: kpis.fechadasParaFopag, variant: 'info' },
    ];
  }, [data?.kpis]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter bar */}
      <div className="flex items-center justify-between border-b border-border-default/60 px-4 py-2.5">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-white px-2.5 py-1 text-sm">
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
            to="/horas-extras/lancamentos"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            Lançamentos
          </Link>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
          >
            <Plus size={14} />
            Novo lançamento
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-default/60 bg-surface-soft/30 px-4 py-2">
          <select
            value={filters.tipo ?? ''}
            onChange={(e) => setTipo((e.target.value || undefined) as typeof filters.tipo)}
            className="rounded-md border border-border-default bg-white px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Tipo</option>
            <option value="he_50">HE 50%</option>
            <option value="he_100">HE 100%</option>
            <option value="he_noturna">HE Noturna</option>
            <option value="domingo">Domingo</option>
            <option value="feriado">Feriado</option>
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
            title="Erro ao carregar lançamentos de horas extras"
            description="Não foi possível carregar os lançamentos e o resumo operacional desta competência."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            {data.fechamentoAtual && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-jogab-100 bg-jogab-50/70 px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <Clock3 size={14} className="shrink-0 text-jogab-700" />
                  <p className="text-xs text-text-muted">
                    Fechamento em andamento — {data.fechamentoAtual.pendentesAprovacao} pendência(s) antes do envio para
                    FOPAG.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/horas-extras/aprovacao"
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-text-body hover:bg-surface-soft"
                  >
                    <FileCheck2 size={12} />
                    Aprovação
                  </Link>
                  <Link
                    to="/horas-extras/fechamento"
                    className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-jogab-800"
                  >
                    <CalendarRange size={12} />
                    Fechamento
                  </Link>
                </div>
              </div>
            )}

            {data.data.length === 0 ? (
              <EmptyState
                title="Nenhum lançamento encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum lançamento corresponde aos filtros selecionados.'
                    : 'Cadastre o primeiro lançamento de horas extras para iniciar o processo operacional.'
                }
                action={
                  hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
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
                    <h2 className="text-sm font-medium text-text-strong">Lançamentos</h2>
                    <p className="text-xs text-text-muted">
                      Eventos operacionais que alimentarão aprovação, fechamento e FOPAG.
                    </p>
                  </div>
                  <Link
                    to="/horas-extras/aprovacao"
                    className="text-xs font-medium text-jogab-700 hover:text-jogab-700"
                  >
                    Abrir aprovação
                  </Link>
                </div>
                <HorasExtrasTable items={data.data} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
