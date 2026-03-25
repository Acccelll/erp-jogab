import { TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';
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

  const mainKpi = safe.kpis[0];
  const secondaryKpis = safe.kpis.slice(1, 5);

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold text-text-strong">Dashboard</h1>
          <span className="text-xs text-text-muted">{competenciaLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-muted hover:bg-surface-soft hover:text-text-body"
        >
          <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {isLoading && (
        <div className="space-y-3 p-4">
          {/* KPI skeleton */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <div>
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="mt-1 h-8 w-32 animate-pulse rounded bg-neutral-200" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-2.5 w-16 animate-pulse rounded bg-neutral-200" />
                <div className="mt-1 h-5 w-20 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
          {/* Section skeleton */}
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="grid gap-3 xl:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-100" />
            ))}
          </div>
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
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
          />
        </MainContent>
      )}

      {!isLoading && !isError && data && (
        <MainContent className="space-y-4">
          {/* ZONA 1 — KPI principal + secundários inline */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            {mainKpi && (
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-subtle">
                  {mainKpi.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium tabular-nums text-text-strong">{formatKpiValue(mainKpi)}</span>
                  {mainKpi.subtitle && (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" />
                      {mainKpi.subtitle}
                    </span>
                  )}
                </div>
              </div>
            )}
            {secondaryKpis.map((kpi) => (
              <div key={kpi.label} className="min-w-0">
                <div className="text-[11px] text-text-subtle">{kpi.label}</div>
                <div className="text-lg font-medium tabular-nums text-text-strong">{formatKpiValue(kpi)}</div>
              </div>
            ))}
          </div>

          {/* ZONA 2 — Alertas (ações urgentes primeiro) */}
          {safe.alertas.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning-soft/30 px-3 py-2">
              <div className="mb-1 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-warning" />
                <span className="text-xs font-medium text-text-body">
                  {safe.alertas.length} alerta{safe.alertas.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-warning/10">
                {safe.alertas.slice(0, 4).map((alerta) => (
                  <div key={alerta.id} className="flex items-center gap-2 py-1.5">
                    <p className="min-w-0 flex-1 text-sm text-text-body">{alerta.title}</p>
                    {alerta.actionTo && (
                      <Link
                        to={alerta.actionTo}
                        className="shrink-0 text-xs font-medium text-accent-600 hover:text-accent-700"
                      >
                        Resolver →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ZONA 3 — Section groups (collapsible) */}
          <DashboardSectionGroup title="Obras" defaultOpen>
            {safe.obras.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup title="RH" defaultOpen={false}>
            {safe.rh.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup title="Financeiro" defaultOpen={false}>
            {safe.financeiro.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>
        </MainContent>
      )}
    </div>
  );
}
