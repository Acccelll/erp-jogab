import { useQuery } from '@tanstack/react-query';
import { fetchObraEquipe } from '../services/obra-workspace.service';

export function useObraEquipe(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'equipe'],
    queryFn: () => fetchObraEquipe(obraId as string),
    enabled: Boolean(obraId),
  });
}
