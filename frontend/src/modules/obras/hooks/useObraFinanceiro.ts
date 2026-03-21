import { useQuery } from '@tanstack/react-query';
import { fetchObraFinanceiro } from '../services/obra-workspace.service';

export function useObraFinanceiro(obraId?: string) {
  return useQuery({
    queryKey: ['obras', obraId, 'financeiro'],
    queryFn: () => fetchObraFinanceiro(obraId as string),
    enabled: Boolean(obraId),
  });
}
