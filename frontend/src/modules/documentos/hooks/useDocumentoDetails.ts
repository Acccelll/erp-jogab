import { useQuery } from '@tanstack/react-query';
import { fetchDocumentoById } from '../services/documentos.service';

export function useDocumentoDetails(documentoId?: string) {
  return useQuery({
    queryKey: ['documento-details', documentoId],
    queryFn: () => fetchDocumentoById(documentoId ?? ''),
    enabled: Boolean(documentoId),
  });
}
