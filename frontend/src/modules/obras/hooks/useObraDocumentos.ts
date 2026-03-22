import { useQuery } from '@tanstack/react-query';
import { fetchObraDocumentos } from '../services/obra-workspace.service';

export function useObraDocumentos(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'documentos'],
    queryFn: () => fetchObraDocumentos(obraId as string),
    enabled: Boolean(obraId),
  });
}
