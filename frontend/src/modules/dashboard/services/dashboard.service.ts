import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { buildDashboardSummaryMock } from '../data/dashboard.mock';
import type { DashboardContextFilters, DashboardSummary } from '../types';

export const DASHBOARD_API_ENDPOINTS = {
  summary: '/dashboard/summary',
} as const;

const DASHBOARD_MOCK_DELAY_MS = 180;

/** Ensures the API payload always conforms to a complete DashboardSummary. */
export function normalizeDashboardSummary(payload: Partial<DashboardSummary> | null | undefined): DashboardSummary {
  return {
    generatedAt: payload?.generatedAt || new Date().toISOString(),
    kpis: Array.isArray(payload?.kpis) ? payload.kpis : [],
    obras: Array.isArray(payload?.obras) ? payload.obras : [],
    rh: Array.isArray(payload?.rh) ? payload.rh : [],
    financeiro: Array.isArray(payload?.financeiro) ? payload.financeiro : [],
    alertas: Array.isArray(payload?.alertas) ? payload.alertas : [],
  };
}

async function getDashboardSummaryMock(filters: DashboardContextFilters): Promise<DashboardSummary> {
  await new Promise((resolve) => window.setTimeout(resolve, DASHBOARD_MOCK_DELAY_MS));
  return buildDashboardSummaryMock(filters.competencia ?? '2026-03');
}

export async function getDashboardSummary(filters: DashboardContextFilters): Promise<DashboardSummary> {
  return withApiFallback(
    async () => {
      const response = await api.get(DASHBOARD_API_ENDPOINTS.summary, { params: filters });
      const raw = unwrapApiResponse<DashboardSummary>(response.data);
      return normalizeDashboardSummary(raw);
    },
    () => getDashboardSummaryMock(filters),
  );
}
