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
            to="/horas-extras/lancamentos"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Lançamentos
          </Link>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
          >
            <Plus size={14} />
            Novo lançamento
          </button>
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
            <option value="he_50">HE 50%</option>
            <option value="he_100">HE 100%</option>
            <option value="he_noturna">HE Noturna</option>
            <option value="domingo">Domingo</option>
            <option value="feriado">Feriado</option>
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
            {data.fechamentoAtual && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-jogab-100 bg-jogab-50/70 px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <Clock3 size={14} className="shrink-0 text-jogab-600" />
                  <p className="text-xs text-gray-600">
                    Fechamento em andamento — {data.fechamentoAtual.pendentesAprovacao} pendência(s) antes do envio para
                    FOPAG.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/horas-extras/aprovacao"
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FileCheck2 size={12} />
                    Aprovação
                  </Link>
                  <Link
                    to="/horas-extras/fechamento"
                    className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-jogab-600"
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
                    <h2 className="text-sm font-medium text-gray-900">Lançamentos</h2>
                    <p className="text-xs text-gray-500">
                      Eventos operacionais que alimentarão aprovação, fechamento e FOPAG.
                    </p>
                  </div>
                  <Link
                    to="/horas-extras/aprovacao"
                    className="text-xs font-medium text-jogab-600 hover:text-jogab-700"
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
