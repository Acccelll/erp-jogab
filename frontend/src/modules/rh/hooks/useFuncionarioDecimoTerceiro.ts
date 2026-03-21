import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioDecimoTerceiro } from '../services/funcionario-workspace.service';

export function useFuncionarioDecimoTerceiro(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'decimo-terceiro'],
    queryFn: () => fetchFuncionarioDecimoTerceiro(funcId as string),
    enabled: Boolean(funcId),
  });
}
