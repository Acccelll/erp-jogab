import { buildDashboardSummaryMock } from '../data/dashboard.mock';
import type { DashboardContextFilters, DashboardSummary } from '../types';

const DASHBOARD_MOCK_DELAY_MS = 180;

export async function getDashboardSummary(filters: DashboardContextFilters): Promise<DashboardSummary> {
  await new Promise((resolve) => window.setTimeout(resolve, DASHBOARD_MOCK_DELAY_MS));
  return buildDashboardSummaryMock(filters.competencia ?? '2026-03');
}
