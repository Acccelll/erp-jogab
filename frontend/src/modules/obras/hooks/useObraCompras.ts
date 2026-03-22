import { useQuery } from '@tanstack/react-query';
import { fetchObraCompras } from '../services/obra-workspace.service';

export function useObraCompras(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'compras'],
    queryFn: () => fetchObraCompras(obraId as string),
    enabled: Boolean(obraId),
  });
}
