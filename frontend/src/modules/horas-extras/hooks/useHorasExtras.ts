import { useQuery } from '@tanstack/react-query';
import type { HorasExtrasFiltersData } from '../types';
import { fetchHorasExtras } from '../services/horasExtras.service';

export function useHorasExtras(filters?: HorasExtrasFiltersData) {
  return useQuery({
    queryKey: ['horas-extras', filters],
    queryFn: () => fetchHorasExtras(filters),
  });
}
