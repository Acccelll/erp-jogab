import { useQuery } from '@tanstack/react-query';
import type { FiscalFiltersData } from '../types';
import { fetchFiscalSaidas } from '../services/fiscal.service';

export function useFiscalSaidas(filters?: FiscalFiltersData) {
  return useQuery({
    queryKey: ['fiscal-saidas', filters],
    queryFn: () => fetchFiscalSaidas(filters),
  });
}
