import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { buildDashboardSummaryMock } from '../data/dashboard.mock';
import type { DashboardContextFilters, DashboardSummary } from '../types';

export const DASHBOARD_API_ENDPOINTS = {
  summary: '/dashboard/summary',
} as const;

const DASHBOARD_MOCK_DELAY_MS = 180;

async function getDashboardSummaryMock(filters: DashboardContextFilters): Promise<DashboardSummary> {
  await new Promise((resolve) => window.setTimeout(resolve, DASHBOARD_MOCK_DELAY_MS));
  return buildDashboardSummaryMock(filters.competencia ?? '2026-03');
}

export async function getDashboardSummary(filters: DashboardContextFilters): Promise<DashboardSummary> {
  return withApiFallback(
    async () => {
      const response = await api.get(DASHBOARD_API_ENDPOINTS.summary, { params: filters });
      return unwrapApiResponse<DashboardSummary>(response.data);
    },
    () => getDashboardSummaryMock(filters),
  );
}
