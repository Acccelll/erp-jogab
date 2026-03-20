import { useQuery } from '@tanstack/react-query';
import type { FinanceiroFiltersData } from '../types';
import { fetchContasPagar } from '../services/financeiro.service';

export function useContasPagar(filters?: FinanceiroFiltersData) {
  return useQuery({
    queryKey: ['financeiro-contas-pagar', filters],
    queryFn: () => fetchContasPagar(filters),
  });
}
