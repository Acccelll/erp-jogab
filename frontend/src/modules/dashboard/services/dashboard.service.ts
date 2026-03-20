import { dashboardSummaryMock } from '../data/dashboard.mock';
import type { DashboardContextFilters, DashboardSummary } from '../types';

const DASHBOARD_MOCK_DELAY_MS = 180;

function cloneSummary(): DashboardSummary {
  return JSON.parse(JSON.stringify(dashboardSummaryMock)) as DashboardSummary;
}

export async function getDashboardSummary(filters: DashboardContextFilters): Promise<DashboardSummary> {
  void filters;

  await new Promise((resolve) => window.setTimeout(resolve, DASHBOARD_MOCK_DELAY_MS));

  return cloneSummary();
}
