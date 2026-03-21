import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioContrato } from '../services/funcionario-workspace.service';

export function useFuncionarioContrato(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'contrato'],
    queryFn: () => fetchFuncionarioContrato(funcId as string),
    enabled: Boolean(funcId),
  });
}
