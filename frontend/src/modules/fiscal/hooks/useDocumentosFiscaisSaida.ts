import { useQuery } from '@tanstack/react-query';
import type { FiscalFiltersData } from '../types';
import { fetchDocumentosFiscaisSaida } from '../services/fiscal.service';

export function useDocumentosFiscaisSaida(filters?: FiscalFiltersData) {
  return useQuery({
    queryKey: ['fiscal-saidas', filters],
    queryFn: () => fetchDocumentosFiscaisSaida(filters),
  });
}
