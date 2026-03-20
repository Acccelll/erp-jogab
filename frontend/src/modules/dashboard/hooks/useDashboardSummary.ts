import { useQuery } from '@tanstack/react-query';
import { useContextStore } from '@/shared/stores';
import { getDashboardSummary } from '../services/dashboard.service';

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
  });
}
