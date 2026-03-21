import { useQuery } from '@tanstack/react-query';
import type { DocumentosFiltersData } from '../types';
import { fetchDocumentosDashboard } from '../services/documentos.service';

export function useDocumentos(filters?: DocumentosFiltersData) {
  return useQuery({
    queryKey: ['documentos-dashboard', filters],
    queryFn: () => fetchDocumentosDashboard(filters),
  });
}
