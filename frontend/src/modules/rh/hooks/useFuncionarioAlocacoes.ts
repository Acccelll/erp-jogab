import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioAlocacoes } from '../services/funcionario-workspace.service';

export function useFuncionarioAlocacoes(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'alocacoes'],
    queryFn: () => fetchFuncionarioAlocacoes(funcId as string),
    enabled: Boolean(funcId),
  });
}
