import { useQuery } from '@tanstack/react-query';
import type { RelatoriosFiltersData } from '../types';
import { fetchRelatoriosDashboard } from '../services/relatorios.service';

export function useRelatorios(filters?: RelatoriosFiltersData) {
  return useQuery({
    queryKey: ['relatorios-dashboard', filters],
    queryFn: () => fetchRelatoriosDashboard(filters),
  });
}
