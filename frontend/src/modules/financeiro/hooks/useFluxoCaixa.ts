import { useQuery } from '@tanstack/react-query';
import type { FinanceiroFiltersData } from '../types';
import { fetchFluxoCaixa } from '../services/financeiro.service';

export function useFluxoCaixa(filters?: FinanceiroFiltersData) {
  return useQuery({
    queryKey: ['financeiro-fluxo-caixa', filters],
    queryFn: () => fetchFluxoCaixa(filters),
  });
}
