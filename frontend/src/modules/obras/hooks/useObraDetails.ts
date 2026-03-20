/**
 * Hook para detalhes de uma obra específica.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchObraById, fetchObraVisaoGeralKpis, fetchObraResumoBlocos } from '../services/obras.service';

export function useObraDetails(obraId: string | undefined) {
  const obraQuery = useQuery({
    queryKey: ['obra', obraId],
    queryFn: () => fetchObraById(obraId!),
    enabled: !!obraId,
  });

  const kpisQuery = useQuery({
    queryKey: ['obra', obraId, 'kpis'],
    queryFn: () => fetchObraVisaoGeralKpis(obraId!),
    enabled: !!obraId,
  });

  const resumoQuery = useQuery({
    queryKey: ['obra', obraId, 'resumo'],
    queryFn: () => fetchObraResumoBlocos(obraId!),
    enabled: !!obraId,
  });

  return {
    obra: obraQuery.data ?? null,
    kpis: kpisQuery.data ?? null,
    resumoBlocos: resumoQuery.data ?? [],
    isLoading: obraQuery.isLoading || kpisQuery.isLoading || resumoQuery.isLoading,
    isError: obraQuery.isError || kpisQuery.isError || resumoQuery.isError,
    error: obraQuery.error ?? kpisQuery.error ?? resumoQuery.error,
  };
}
