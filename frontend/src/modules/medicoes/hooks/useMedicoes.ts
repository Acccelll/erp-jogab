import { useQuery } from '@tanstack/react-query';
import type { MedicoesFiltersData } from '../types';
import { fetchMedicoesDashboard } from '../services/medicoes.service';

export function useMedicoes(filters?: MedicoesFiltersData) {
  return useQuery({
    queryKey: ['medicoes-dashboard', filters],
    queryFn: () => fetchMedicoesDashboard(filters),
  });
}
