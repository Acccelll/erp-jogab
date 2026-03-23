import { useQuery } from '@tanstack/react-query';
import { fetchObraRiscos } from '../services/obra-workspace.service';

export function useObraRiscos(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'riscos'],
    queryFn: () => fetchObraRiscos(obraId as string),
    enabled: Boolean(obraId),
  });
}
