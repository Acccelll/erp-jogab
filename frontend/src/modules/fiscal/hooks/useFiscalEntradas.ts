import { useQuery } from '@tanstack/react-query';
import type { FiscalFiltersData } from '../types';
import { fetchFiscalEntradas } from '../services/fiscal.service';

export function useFiscalEntradas(filters?: FiscalFiltersData) {
  return useQuery({
    queryKey: ['fiscal-entradas', filters],
    queryFn: () => fetchFiscalEntradas(filters),
  });
}
