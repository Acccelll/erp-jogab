import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioFopag } from '../services/funcionario-workspace.service';

export function useFuncionarioFopag(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'fopag'],
    queryFn: () => fetchFuncionarioFopag(funcId as string),
    enabled: Boolean(funcId),
  });
}
