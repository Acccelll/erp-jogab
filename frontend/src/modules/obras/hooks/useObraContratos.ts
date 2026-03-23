import { useQuery } from '@tanstack/react-query';
import { fetchObraContratos } from '../services/obra-workspace.service';

export function useObraContratos(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'contratos'],
    queryFn: () => fetchObraContratos(obraId as string),
    enabled: Boolean(obraId),
  });
}
