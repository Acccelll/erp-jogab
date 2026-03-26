import { useQuery } from '@tanstack/react-query';
import { useContextStore } from '@/shared/stores';
import { getDashboardSummary } from '../services/dashboard.service';

/** Cache dashboard data for 5 minutes — reduces unnecessary refetches on navigation */
const STALE_TIME = 5 * 60 * 1000;

export function useDashboardSummary() {
  const { empresaId, filialId, obraId, competencia } = useContextStore();

  return useQuery({
    queryKey: ['dashboard-summary', empresaId, filialId, obraId, competencia],
    queryFn: () =>
      getDashboardSummary({
        empresaId,
        filialId,
        obraId,
        competencia,
      }),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
