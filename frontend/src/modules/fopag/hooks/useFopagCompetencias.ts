import { useQuery } from '@tanstack/react-query';
import type { FopagFiltersData } from '../types';
import { fetchFopagCompetencias } from '../services/fopag.service';

export function useFopagCompetencias(filters?: FopagFiltersData) {
  return useQuery({
    queryKey: ['fopag-competencias', filters],
    queryFn: () => fetchFopagCompetencias(filters),
  });
}
