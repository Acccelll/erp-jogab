import { useQuery } from '@tanstack/react-query';
import type { FiscalFiltersData } from '../types';
import { fetchDocumentosFiscaisEntrada } from '../services/fiscal.service';

export function useDocumentosFiscaisEntrada(filters?: FiscalFiltersData) {
  return useQuery({
    queryKey: ['fiscal-entradas', filters],
    queryFn: () => fetchDocumentosFiscaisEntrada(filters),
  });
}
