export type DashboardAlertSeverity = 'critical' | 'warning' | 'info';

export interface DashboardKpi {
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

export interface DashboardSummary {
  generatedAt: string;
  kpis: DashboardKpi[];
  obras: DashboardSectionCardData[];
  rh: DashboardSectionCardData[];
  financeiro: DashboardSectionCardData[];
  alertas: DashboardAlertItem[];
}

export interface DashboardContextFilters {
  empresaId: string | null;
  filialId: string | null;
  obraId: string | null;
  competencia: string | null;
}
