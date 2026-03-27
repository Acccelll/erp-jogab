export type DashboardAlertSeverity = 'critical' | 'warning' | 'info';

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  format?: 'currency' | 'number' | 'percent';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DashboardSectionMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface DashboardSectionAction {
  label: string;
  to: string;
}

export interface DashboardSectionCardData {
  id: string;
  title: string;
  description: string;
  metrics: DashboardSectionMetric[];
  action: DashboardSectionAction;
}

export interface DashboardAlertItem {
  id: string;
  title: string;
  description: string;
  severity: DashboardAlertSeverity;
  module: string;
  obraNome?: string;
  actionLabel?: string;
  actionTo?: string;
}

export interface DashboardChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface DashboardSummary {
  generatedAt: string;
  kpis: DashboardKpi[];
  obras: DashboardSectionCardData[];
  rh: DashboardSectionCardData[];
  financeiro: DashboardSectionCardData[];
  alertas: DashboardAlertItem[];
  // Insights de Gestão (Gráficos)
  overtimeByDepartment?: DashboardChartDataPoint[];
  financialEvolution?: DashboardChartDataPoint[];
  obraStatusDistribution?: DashboardChartDataPoint[];
}

export interface DashboardContextFilters {
  empresaId: string | null;
  filialId: string | null;
  obraId: string | null;
  competencia: string | null;
}
