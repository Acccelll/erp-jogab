import { buildExecutiveManagementSnapshot } from '@/shared/lib/executiveInsights';
import { formatCurrency } from '@/shared/lib/utils';
import type { DashboardSummary } from '../types';

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)} mi`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)} mil`;
  }
  return formatCurrency(value);
}

export function buildDashboardSummaryMock(competencia = '2026-03'): DashboardSummary {
  const snapshot = buildExecutiveManagementSnapshot(competencia);
  const principalObra = snapshot.obras[0];
  const principalCentro = snapshot.pessoal.porCentroCusto[0];
  const fechamentoLabel = snapshot.pessoal.statusFechamento === 'fechada' ? 'Fechamento consistente' : snapshot.pessoal.statusFechamento === 'parcial' ? 'Fechamento parcial' : 'Fechamento em aberto';

  return {
    generatedAt: new Date().toISOString(),
    kpis: [
      { label: 'Custo pessoal previsto', value: snapshot.pessoal.valorPrevisto, format: 'currency', subtitle: `Competência ${competencia}`, trend: 'up' },
      { label: 'Custo pessoal realizado', value: snapshot.pessoal.valorRealizado, format: 'currency', subtitle: fechamentoLabel, trend: 'neutral' },
      { label: 'Horas extras', value: Number(snapshot.horasExtras.totalHoras.toFixed(1)), format: 'number', subtitle: `${snapshot.horasExtras.totalLancamentos} lançamento(s)`, trend: snapshot.horasExtras.pendentesAprovacao > 0 ? 'up' : 'neutral' },
      { label: 'FOPAG consolidada', value: snapshot.fopag.competencia.valorPrevisto, format: 'currency', subtitle: `${snapshot.fopag.competencia.totalFuncionarios} funcionários`, trend: 'up' },
      { label: 'Obras impactadas', value: snapshot.pessoal.totalObras, format: 'number', subtitle: `${snapshot.pessoal.totalCentrosCusto} centros de custo`, trend: 'neutral' },
    ],
    obras: [
      {
        id: 'obra-destaque',
        title: `Obra com maior custo de pessoal — ${principalObra?.nome ?? '—'}`,
        description: 'Leitura executiva do impacto financeiro e operacional por obra, mantendo Obras como eixo central do ERP.',
        metrics: [
          { label: 'Custo pessoal previsto', value: formatCompactCurrency(principalObra?.custoPessoalPrevisto ?? 0), highlight: true },
          { label: 'Custo realizado', value: formatCompactCurrency(principalObra?.custoRealizado ?? 0) },
          { label: 'Avanço físico', value: `${principalObra?.percentualConcluido ?? 0}%` },
          { label: 'Desvio financeiro', value: `${principalObra?.desvioFinanceiro ?? 0}%` },
        ],
        action: { label: 'Abrir obra', to: principalObra ? `/obras/${principalObra.id}` : '/obras' },
      },
      {
        id: 'obras-rateio',
        title: 'Rateio por obra e centro de custo',
        description: 'Resumo do custo de pessoal distribuído por obra e preparado para leitura gerencial futura.',
        metrics: [
          { label: 'Obras impactadas', value: String(snapshot.pessoal.totalObras), highlight: true },
          { label: 'Maior centro', value: principalCentro?.centroCustoNome ?? '—' },
          { label: 'Previsto total', value: formatCompactCurrency(snapshot.pessoal.valorPrevisto) },
          { label: 'Realizado total', value: formatCompactCurrency(snapshot.pessoal.valorRealizado) },
        ],
        action: { label: 'Abrir Financeiro', to: '/financeiro' },
      },
    ],
    rh: [
      {
        id: 'rh-alocacoes',
        title: 'RH e alocações por obra',
        description: 'Consolidação de equipe ativa, férias, afastamentos e vínculo com custo de pessoal.',
        metrics: [
          { label: 'Ativos', value: String(snapshot.rh.ativos), highlight: true },
          { label: 'Alocados em obra', value: String(snapshot.rh.alocadosEmObra) },
          { label: 'Férias', value: String(snapshot.rh.emFerias) },
          { label: 'Maior obra', value: snapshot.rh.maiorObra ?? '—' },
        ],
        action: { label: 'Ir para RH', to: '/rh/funcionarios' },
      },
      {
        id: 'rh-he-fopag',
        title: 'Horas Extras e FOPAG',
        description: 'Sinalização executiva do funil operacional que forma o custo de pessoal.',
        metrics: [
          { label: 'Pendentes de aprovação', value: String(snapshot.horasExtras.pendentesAprovacao) },
          { label: 'Fechadas p/ FOPAG', value: String(snapshot.horasExtras.fechadasParaFopag), highlight: true },
          { label: 'HE valor total', value: formatCompactCurrency(snapshot.horasExtras.valorTotal) },
          { label: 'FOPAG prevista', value: formatCompactCurrency(snapshot.fopag.competencia.valorPrevisto) },
        ],
        action: { label: 'Abrir FOPAG', to: `/fopag/${competencia}` },
      },
    ],
    financeiro: [
      {
        id: 'fin-previsto-realizado',
        title: 'Previsto x realizado do pessoal',
        description: 'Leitura consolidada do reflexo financeiro do custo de pessoal na competência ativa.',
        metrics: [
          { label: 'Previsto', value: formatCompactCurrency(snapshot.pessoal.valorPrevisto), highlight: true },
          { label: 'Realizado', value: formatCompactCurrency(snapshot.pessoal.valorRealizado) },
          { label: 'Variação', value: formatCompactCurrency(snapshot.pessoal.variacao) },
          { label: 'Status', value: fechamentoLabel },
        ],
        action: { label: 'Ver Financeiro', to: '/financeiro' },
      },
      {
        id: 'fin-centro-custo',
        title: 'Centro de custo com maior exposição',
        description: 'Visão mínima por centro de custo para preparar relatórios comparativos e filtros avançados.',
        metrics: [
          { label: 'Centro', value: principalCentro?.centroCustoNome ?? '—', highlight: true },
          { label: 'Obra', value: principalCentro?.obraNome ?? '—' },
          { label: 'Previsto', value: formatCompactCurrency(principalCentro?.valorPrevisto ?? 0) },
          { label: 'Realizado', value: formatCompactCurrency(principalCentro?.valorRealizado ?? 0) },
        ],
        action: { label: 'Abrir Relatórios', to: '/relatorios/categorias/financeiro' },
      },
    ],
    alertas: [
      {
        id: 'alerta-he',
        title: 'Horas extras pendentes de aprovação',
        description: `Existem ${snapshot.horasExtras.pendentesAprovacao} lançamento(s) ainda pendentes na competência ${competencia}.`,
        severity: snapshot.horasExtras.pendentesAprovacao > 0 ? 'warning' : 'info',
        module: 'Horas Extras',
        actionLabel: 'Abrir horas extras',
        actionTo: '/horas-extras/aprovacao',
      },
      {
        id: 'alerta-fin',
        title: 'Variação de custo de pessoal monitorada',
        description: `A diferença entre previsto e realizado está em ${formatCompactCurrency(snapshot.pessoal.variacao)}.`,
        severity: snapshot.pessoal.variacao > 50000 ? 'critical' : 'info',
        module: 'Financeiro',
        obraNome: principalObra?.nome,
        actionLabel: 'Abrir financeiro',
        actionTo: '/financeiro',
      },
      {
        id: 'alerta-obra',
        title: 'Obra com maior impacto financeiro de pessoal',
        description: `${principalObra?.nome ?? 'Obra principal'} concentra o maior custo de pessoal previsto na competência ativa.`,
        severity: 'info',
        module: 'Obras',
        obraNome: principalObra?.nome,
        actionLabel: 'Abrir obra',
        actionTo: principalObra ? `/obras/${principalObra.id}/financeiro` : '/obras',
      },
    ],
  };
}
