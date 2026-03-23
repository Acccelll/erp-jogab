import { useQuery } from '@tanstack/react-query';
import { fetchObraEstoque } from '../services/obra-workspace.service';

export function useObraEstoque(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'estoque'],
    queryFn: () => fetchObraEstoque(obraId as string),
    enabled: Boolean(obraId),
  });
}
