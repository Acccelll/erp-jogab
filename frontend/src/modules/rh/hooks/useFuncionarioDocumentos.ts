import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioDocumentos } from '../services/funcionario-workspace.service';

export function useFuncionarioDocumentos(funcId?: string) {
  return useQuery({
    queryKey: ['funcionario', funcId, 'documentos'],
    queryFn: () => fetchFuncionarioDocumentos(funcId as string),
    enabled: Boolean(funcId),
  });
}
