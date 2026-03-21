import { useQuery } from '@tanstack/react-query';
import { fetchObraCronograma } from '../services/obra-workspace.service';

export function useObraCronograma(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'cronograma'],
    queryFn: () => fetchObraCronograma(obraId as string),
    enabled: Boolean(obraId),
  });
}
