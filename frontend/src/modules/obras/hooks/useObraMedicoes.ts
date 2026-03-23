import { useQuery } from '@tanstack/react-query';
import { fetchObraMedicoes } from '../services/obra-workspace.service';

export function useObraMedicoes(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'medicoes'],
    queryFn: () => fetchObraMedicoes(obraId as string),
    enabled: Boolean(obraId),
  });
}
