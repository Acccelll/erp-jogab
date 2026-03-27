/**
 * Hook para detalhes de uma obra específica.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchObraDetail } from '../services/obras.service';

export function useObraDetails(obraId: string | undefined) {
  const detailQuery = useQuery({
    queryKey: ['obra', obraId],
    queryFn: () => fetchObraDetail(obraId!),
    enabled: !!obraId,
  });

  return {
    obra: detailQuery.data?.obra ?? null,
    kpis: detailQuery.data?.kpis ?? null,
    resumoBlocos: detailQuery.data?.resumoBlocos ?? [],
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
  };
}
