import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle, ArrowRight, Settings2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainContent, PageHeader, Skeleton, CardSkeleton, ErrorStateView } from '@/shared/components';
import { BarChart, LineChart, PieChart } from '@/shared/components/charts';
import { formatCurrency, formatCompetencia } from '@/shared/lib/utils';
import { type ApiError } from '@/shared/lib/api';
import { useContextStore, useUIStore, usePreferencesStore } from '@/shared/stores';
import { DashboardSectionCard, DashboardSectionGroup, KpiCustomizationDrawer } from '../components';
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

/** Default open states for each dashboard section (used when no persisted value exists) */
const SECTION_DEFAULTS: Record<string, boolean> = {
  obras: true,
  rh: false,
  financeiro: false,
};

export function DashboardPage() {
  const { competencia } = useContextStore();
  const { dashboardSectionsOpen, setDashboardSectionOpen } = useUIStore();
  const { visibleKpiIds } = usePreferencesStore();
  const [isKpiDrawerOpen, setIsKpiDrawerOpen] = useState(false);
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

  /** Resolve the open state for a section, falling back to the default if not yet stored */
  const sectionIsOpen = useCallback(
    (id: string): boolean => (id in dashboardSectionsOpen ? dashboardSectionsOpen[id] : (SECTION_DEFAULTS[id] ?? true)),
    [dashboardSectionsOpen],
  );

  const competenciaLabel = competencia ? formatCompetencia(competencia) : 'competência atual';

  const visibleKpis = useMemo(() => {
    if (!Array.isArray(safe.kpis)) return [];
    return safe.kpis.filter((kpi) => visibleKpiIds.includes(kpi.id));
  }, [safe.kpis, visibleKpiIds]);

  const mainKpi = visibleKpis[0];
  const secondaryKpis = visibleKpis.slice(1, 5);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        subtitle={competenciaLabel}
        variant="analytical"
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsKpiDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-xs font-semibold text-text-body shadow-sm transition-all hover:bg-surface-soft hover:shadow-md"
            >
              <Settings2 size={14} />
              Editar KPIs
            </button>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-4 py-2 text-xs font-semibold text-text-body shadow-sm transition-all hover:bg-surface-soft hover:shadow-md"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              Atualizar indicadores
            </button>
          </div>
        }
      />

      {isLoading && (
        <MainContent className="space-y-8 px-8 py-8">
          {/* KPI skeleton */}
          <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
            <div className="space-y-2">
              <Skeleton width={120} height={10} />
              <Skeleton width={200} height={40} />
            </div>
            <div className="flex gap-10">
              <div className="space-y-2"><Skeleton width={100} height={10} /><Skeleton width={120} height={20} /></div>
              <div className="space-y-2"><Skeleton width={100} height={10} /><Skeleton width={120} height={20} /></div>
            </div>
          </div>
          {/* Section skeleton */}
          <div className="space-y-4">
            <Skeleton width={80} height={12} />
            <div className="grid gap-6 xl:grid-cols-2">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </div>
          </div>
        </MainContent>
      )}

      {isError && (
        <MainContent>
          <ErrorStateView
            type={(safe as unknown as ApiError)?.type ?? 'unknown'}
            status={(safe as unknown as ApiError)?.status}
            onRetry={() => void refetch()}
          />
        </MainContent>
      )}

      {!isLoading && !isError && data && (
        <MainContent className="space-y-8 px-8 py-8">
          {/* ZONA 1 — KPI principal + secundários inline */}
          <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
            {mainKpi && (
              <div className="group transition-all duration-300">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/40">
                  {mainKpi.label}
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-5xl font-black tabular-nums tracking-tighter text-text-strong">
                    {formatKpiValue(mainKpi)}
                  </span>
                  {mainKpi.subtitle && (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                      mainKpi.trend === 'down' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                    }`}>
                      {mainKpi.trend === 'down' ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                      {mainKpi.subtitle}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="h-12 w-px bg-border-default/30" />
            <div className="flex flex-wrap items-end gap-x-12">
              {secondaryKpis.map((kpi) => (
                <div key={kpi.label} className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/50">{kpi.label}</div>
                    {kpi.trend && kpi.trend !== 'neutral' && (
                      <span className={kpi.trend === 'up' ? 'text-success' : 'text-error'}>
                        {kpi.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xl font-bold tabular-nums text-text-strong/90">{formatKpiValue(kpi)}</div>
                </div>
              ))}
            </div>
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
                        className="shrink-0 flex items-center gap-1 rounded-full bg-accent-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-600 hover:bg-accent-100 transition-colors"
                      >
                        Ação <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ZONA 2.5 — Insights de Gestão (Gráficos) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-brand-primary rounded-full" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60">Insights de Gestão</h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-accent-50 p-2 text-accent-600">
                      <BarChart3 size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-strong">Horas Extras</h4>
                      <p className="text-[10px] text-text-muted">Distribuição por departamento</p>
                    </div>
                  </div>
                </div>
                {safe.overtimeByDepartment && <BarChart data={safe.overtimeByDepartment} height={200} />}
              </div>

              <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-success-soft p-2 text-success">
                      <LineChartIcon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-strong">Evolução Financeira</h4>
                      <p className="text-[10px] text-text-muted">Previsto vs Realizado (6 meses)</p>
                    </div>
                  </div>
                </div>
                {safe.financialEvolution && <LineChart data={safe.financialEvolution} height={200} format="currency" />}
              </div>

              <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-info-soft p-2 text-info-600">
                      <PieChartIcon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-strong">Status das Obras</h4>
                      <p className="text-[10px] text-text-muted">Distribuição atual do portfólio</p>
                    </div>
                  </div>
                </div>
                {safe.obraStatusDistribution && <PieChart data={safe.obraStatusDistribution} height={200} />}
              </div>
            </div>
          </div>

          {/* ZONA 3 — Section groups (collapsible, state persisted in uiStore) */}
          <DashboardSectionGroup
            title="Obras"
            isOpen={sectionIsOpen('obras')}
            onToggle={(open) => setDashboardSectionOpen('obras', open)}
          >
            {safe.obras.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup
            title="RH"
            isOpen={sectionIsOpen('rh')}
            onToggle={(open) => setDashboardSectionOpen('rh', open)}
          >
            {safe.rh.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>

          <DashboardSectionGroup
            title="Financeiro"
            isOpen={sectionIsOpen('financeiro')}
            onToggle={(open) => setDashboardSectionOpen('financeiro', open)}
          >
            {safe.financeiro.map((section) => (
              <DashboardSectionCard key={section.id} section={section} />
            ))}
          </DashboardSectionGroup>
        </MainContent>
      )}

      <KpiCustomizationDrawer
        isOpen={isKpiDrawerOpen}
        onClose={() => setIsKpiDrawerOpen(false)}
        availableKpis={safe.kpis}
      />
    </div>
  );
}
