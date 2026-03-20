import { useQuery } from '@tanstack/react-query';
import { fetchFopagCompetenciaDetails } from '../services/fopag.service';

export function useFopagCompetenciaDetails(competenciaId: string | undefined) {
  const query = useQuery({
    queryKey: ['fopag-competencia-details', competenciaId],
    queryFn: () => fetchFopagCompetenciaDetails(competenciaId ?? ''),
    enabled: Boolean(competenciaId),
  });

  return {
    ...query,
    detalhe: query.data ?? null,
  };
}
