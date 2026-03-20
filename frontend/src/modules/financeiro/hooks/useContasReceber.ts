import { useQuery } from '@tanstack/react-query';
import type { FinanceiroFiltersData } from '../types';
import { fetchContasReceber } from '../services/financeiro.service';

export function useContasReceber(filters?: FinanceiroFiltersData) {
  return useQuery({
    queryKey: ['financeiro-contas-receber', filters],
    queryFn: () => fetchContasReceber(filters),
  });
}
