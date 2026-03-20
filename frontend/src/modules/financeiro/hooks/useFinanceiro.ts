import { useQuery } from '@tanstack/react-query';
import type { FinanceiroFiltersData } from '../types';
import { fetchFinanceiroDashboard } from '../services/financeiro.service';

export function useFinanceiro(filters?: FinanceiroFiltersData) {
  return useQuery({
    queryKey: ['financeiro-dashboard', filters],
    queryFn: () => fetchFinanceiroDashboard(filters),
  });
}
