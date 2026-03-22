import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioProvisoes } from '../services/funcionario-workspace.service';

export function useFuncionarioProvisoes(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'provisoes'],
    queryFn: () => fetchFuncionarioProvisoes(funcId as string),
    enabled: Boolean(funcId),
  });
}
