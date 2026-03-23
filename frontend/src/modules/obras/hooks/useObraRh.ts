import { useQuery } from '@tanstack/react-query';
import { fetchObraRh } from '../services/obra-workspace.service';

export function useObraRh(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'rh'],
    queryFn: () => fetchObraRh(obraId as string),
    enabled: Boolean(obraId),
  });
}
