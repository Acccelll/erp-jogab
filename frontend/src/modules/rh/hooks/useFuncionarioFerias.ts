import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioFerias } from '../services/funcionario-workspace.service';

export function useFuncionarioFerias(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'ferias'],
    queryFn: () => fetchFuncionarioFerias(funcId as string),
    enabled: Boolean(funcId),
  });
}
