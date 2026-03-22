import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioHistoricoSalarial } from '../services/funcionario-workspace.service';

export function useFuncionarioHistoricoSalarial(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'historico-salarial'],
    queryFn: () => fetchFuncionarioHistoricoSalarial(funcId as string),
    enabled: Boolean(funcId),
  });
}
