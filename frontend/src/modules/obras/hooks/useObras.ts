/**
 * Hook para listagem de obras com filtros e KPIs.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchObras } from '../services/obras.service';
import type { ObraFiltersData } from '../types';

export function useObras(filters?: ObraFiltersData) {
  return useQuery({
    queryKey: ['obras', filters],
    queryFn: () => fetchObras(filters),
  });
}
