import { TrendingUp, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainContent, EmptyState } from '@/shared/components';
import { formatCurrency, formatCompetencia } from '@/shared/lib/utils';
import { useContextStore } from '@/shared/stores';
import { DashboardSectionCard, DashboardSectionGroup } from '../components';
import { useDashboardSummary } from '../hooks';
import type { DashboardKpi, DashboardSummary } from '../types';

function formatKpiValue(kpi: DashboardKpi): string | number {
  switch (kpi.format) {
    case 'currency':
      return formatCurrency(kpi.value);
    case 'percent':
      return `${kpi.value}%`;
    case 'number':
    default:
      return kpi.value;
  }
}

const EMPTY_SUMMARY: DashboardSummary = {
  generatedAt: '',
  kpis: [],
  obras: [],
  rh: [],
  financeiro: [],
  alertas: [],
};

export function DashboardPage() {
  const { competencia } = useContextStore();
  const { data, isLoading, isError, refetch, isFetching } = useDashboardSummary();

  const safe = useMemo<DashboardSummary>(() => {
    if (!data) return EMPTY_SUMMARY;
    return {
      generatedAt: data.generatedAt ?? '',
      kpis: Array.isArray(data.kpis) ? data.kpis : [],
      obras: Array.isArray(data.obras) ? data.obras : [],
      rh: Array.isArray(data.rh) ? data.rh : [],
      financeiro: Array.isArray(data.financeiro) ? data.financeiro : [],
      alertas: Array.isArray(data.alertas) ? data.alertas : [],
    };
  }, [data]);

  const competenciaLabel = competencia ? formatCompetencia(competencia) : 'competência atual';

  // Main KPI (first one) and secondary KPIs
  const mainKpi = safe.kpis[0];
  const secondaryKpis = safe.kpis.slice(1, 5);

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 px-4 py-2.5">
        <div>
          <h1 className="text-sm font-medium text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">{competenciaLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {isLoading && (
        <div className="space-y-0 p-4">
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
        <MainContent>
          <EmptyState
            title="Erro ao carregar dashboard"
            description="Não foi possível carregar a visão executiva inicial. Tente atualizar novamente."
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
        </MainContent>
      )}

      {!isLoading && !isError && data && (
        <MainContent className="space-y-4">
          {/* ZONA 1 — Métrica principal */}
          {mainKpi && (
            <div className="px-1 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{mainKpi.label}</span>
              <div className="mt-1 text-4xl font-medium tabular-nums text-gray-900">{formatKpiValue(mainKpi)}</div>
              {mainKpi.subtitle && (
                <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {mainKpi.subtitle}
                </div>
              )}
            </div>
          )}

          {/* ZONA 2 — KPIs secundários + Alertas */}
          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            {/* KPIs grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {secondaryKpis.map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-gray-200/60 bg-white p-3">
                  <div className="text-xs text-gray-400">{kpi.label}</div>
                  <div className="mt-0.5 text-xl font-medium tabular-nums text-gray-900">{formatKpiValue(kpi)}</div>
                  {kpi.subtitle && <div className="mt-0.5 text-xs text-gray-500">{kpi.subtitle}</div>}
                </div>
              ))}
            </div>

            {/* Alertas panel */}
            {safe.alertas.length > 0 && (
              <div className="rounded-lg border border-gray-200/60 bg-white p-3">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Alertas</h3>
                <div className="space-y-0">
                  {safe.alertas.slice(0, 6).map((alerta) => (
                    <div
                      key={alerta.id}
                      className="flex items-start gap-2 border-b border-gray-100/40 py-2 last:border-0"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-tight text-gray-900">{alerta.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{alerta.description}</p>
                      </div>
                      {alerta.actionTo && (
                        <Link to={alerta.actionTo} className="shrink-0 text-xs text-gray-400 hover:text-gray-600">
                          Ver →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ZONA 3 — Section groups */}
          <DashboardSectionGroup
            title="Resumo de Obras"
            description="Consolidação com foco em avanço, custo e leitura do workspace central."
          >
            {safe.obras.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup
            title="Resumo de RH"
            description="Alocação, provisões e pendências trabalhistas que impactam as obras."
          >
            {safe.rh.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup
            title="Resumo Financeiro"
            description="Indicadores executivos de desembolso, FOPAG e previsto x realizado."
          >
            {safe.financeiro.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>
        </MainContent>
      )}
    </div>
  );
}
