import { Activity, Building2, BriefcaseBusiness, RefreshCw, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { KPISection, KPICard, MainContent, PageHeader, EmptyState } from '@/shared/components';
import { formatCurrency, formatCompetencia } from '@/shared/lib/utils';
import { useContextStore } from '@/shared/stores';
import { DashboardAlertsPanel, DashboardSectionCard, DashboardSectionGroup } from '../components';
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

function safeDateString(value: string | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('pt-BR');
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
  const { competencia, obraId } = useContextStore();
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
  const subtitle = obraId
    ? `Visão consolidada da obra ativa e seus impactos operacionais na ${competenciaLabel}.`
    : `Visão executiva consolidada por obra, RH e financeiro na ${competenciaLabel}.`;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Dashboard"
        subtitle={subtitle}
        actions={
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Atualizar visão
          </button>
        }
      />

      {isLoading && (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
            <p className="text-sm text-gray-500">Carregando dashboard...</p>
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
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Tentar novamente
              </button>
            }
          />
        </MainContent>
      )}

      {!isLoading && !isError && data && (
        <>
          <KPISection>
            {safe.kpis.map((kpi) => (
              <KPICard
                key={kpi.label}
                label={kpi.label}
                value={formatKpiValue(kpi)}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
              />
            ))}
          </KPISection>

          <MainContent className="space-y-6">
            <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
              <article className="rounded-xl border border-gray-200 bg-gradient-to-br from-jogab-700 via-jogab-600 to-jogab-500 p-6 text-white shadow-sm shadow-jogab-900/10">
                <div className="flex items-center gap-2 text-white/80">
                  <Activity size={18} />
                  <span className="text-sm font-medium uppercase tracking-wide">Resumo executivo</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold">A Obra segue como núcleo da operação do ERP.</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/85">
                  O dashboard executivo consolida custo de pessoal, Horas Extras, FOPAG, previsto x realizado e leitura por obra/centro de custo para apoiar decisões rápidas sem romper a arquitetura por domínio.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-white/70">Frente prioritária</p>
                    <p className="mt-1 text-sm font-semibold">Obras em execução</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-white/70">Integração chave</p>
                    <p className="mt-1 text-sm font-semibold">RH + Financeiro + Obra</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-white/70">Atualização</p>
                    <p className="mt-1 text-sm font-semibold">{safeDateString(safe.generatedAt)}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-jogab-50 text-jogab-600">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Leitura do ciclo atual</h2>
                    <p className="text-sm text-gray-500">Pontos de atenção que impactam custo, equipe e caixa.</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="rounded-lg bg-gray-50 p-3">
                    A competência ativa agora destaca custo de pessoal por obra e o centro de custo com maior exposição financeira.
                  </li>
                  <li className="rounded-lg bg-gray-50 p-3">
                    RH e Horas Extras passam a alimentar uma leitura executiva única para equipe, provisões e fechamento da competência.
                  </li>
                  <li className="rounded-lg bg-gray-50 p-3">
                    Financeiro e FOPAG refletem previsto x realizado de pessoal com rastreabilidade suficiente para visão gerencial.
                  </li>
                </ul>
              </article>
            </section>

            <DashboardSectionGroup
              title="Resumo de Obras"
              description="Consolidação inicial com foco em avanço, custo e leitura do workspace central da operação."
            >
              {safe.obras.map((section) => (
                <DashboardSectionCard key={section.id} section={section} />
              ))}
            </DashboardSectionGroup>

            <DashboardSectionGroup
              title="Resumo de RH"
              description="Sinais iniciais de alocação, provisões e pendências trabalhistas que impactam as obras."
            >
              {safe.rh.map((section) => (
                <DashboardSectionCard key={section.id} section={section} />
              ))}
            </DashboardSectionGroup>

            <DashboardSectionGroup
              title="Resumo Financeiro e Pessoal"
              description="Indicadores executivos de desembolso, FOPAG, Horas Extras e previsto x realizado por obra."
            >
              {safe.financeiro.map((section) => (
                <DashboardSectionCard key={section.id} section={section} />
              ))}
            </DashboardSectionGroup>

            <DashboardAlertsPanel alerts={safe.alertas} />

            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-3 flex items-center gap-2 text-jogab-600">
                  <Building2 size={18} />
                  <h3 className="text-base font-semibold text-gray-900">Obras</h3>
                </div>
                <p className="text-sm text-gray-500">
                  A visão executiva já destaca a obra com maior peso operacional e reforça a navegação para o workspace central.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-3 flex items-center gap-2 text-jogab-600">
                  <BriefcaseBusiness size={18} />
                  <h3 className="text-base font-semibold text-gray-900">RH</h3>
                </div>
                <p className="text-sm text-gray-500">
                  O dashboard passa a refletir alocação, provisões e documentação, conectando RH ao custo e à operação das obras.
                </p>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-3 flex items-center gap-2 text-jogab-600">
                  <Wallet size={18} />
                  <h3 className="text-base font-semibold text-gray-900">Financeiro</h3>
                </div>
                <p className="text-sm text-gray-500">
                  A leitura inicial de caixa e medições prepara a transição para as fases de Financeiro, Estoque e Medições.
                </p>
              </article>
            </section>
          </MainContent>
        </>
      )}
    </div>
  );
}
