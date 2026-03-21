import { useQuery } from '@tanstack/react-query';
import type { EstoqueFiltersData } from '../types';
import { fetchEstoqueDashboard } from '../services/estoque.service';

export function useEstoque(filters?: EstoqueFiltersData) {
  return useQuery({
    queryKey: ['estoque-dashboard', filters],
    queryFn: () => fetchEstoqueDashboard(filters),
  });
}
