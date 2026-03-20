import { useQuery } from '@tanstack/react-query';
import type { FiscalFiltersData } from '../types';
import { fetchFiscal } from '../services/fiscal.service';

export function useFiscal(filters?: FiscalFiltersData) {
  return useQuery({
    queryKey: ['fiscal-dashboard', filters],
    queryFn: () => fetchFiscal(filters),
  });
}
