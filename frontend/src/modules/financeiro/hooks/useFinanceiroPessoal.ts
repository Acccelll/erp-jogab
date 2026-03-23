import { useQuery } from '@tanstack/react-query';
import type { FinanceiroFiltersData } from '../types';
import { fetchFinanceiroPessoal } from '../services/financeiro.service';

export function useFinanceiroPessoal(filters?: FinanceiroFiltersData) {
  return useQuery({
    queryKey: ['financeiro-pessoal', filters],
    queryFn: () => fetchFinanceiroPessoal(filters),
  });
}
