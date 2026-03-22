import { useQuery } from '@tanstack/react-query';
import { fetchDocumentoFiscalById } from '../services/fiscal.service';

export function useDocumentoFiscalDetails(documentoId?: string) {
  return useQuery({
    queryKey: ['fiscal-documento-detail', documentoId],
    queryFn: () => fetchDocumentoFiscalById(documentoId as string),
    enabled: Boolean(documentoId),
  });
}
