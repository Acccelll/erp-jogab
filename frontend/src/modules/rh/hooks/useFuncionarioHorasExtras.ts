import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioHorasExtras } from '../services/funcionario-workspace.service';

export function useFuncionarioHorasExtras(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'horas-extras'],
    queryFn: () => fetchFuncionarioHorasExtras(funcId as string),
    enabled: Boolean(funcId),
  });
}
