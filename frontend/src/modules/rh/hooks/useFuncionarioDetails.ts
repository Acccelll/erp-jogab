/**
 * Hook para detalhes de um funcionário específico.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioById, fetchFuncionarioResumoBlocos } from '../services/funcionarios.service';

export function useFuncionarioDetails(funcId: string | undefined) {
  const funcionarioQuery = useQuery({
    queryKey: ['funcionario', funcId],
    queryFn: () => fetchFuncionarioById(funcId!),
    enabled: !!funcId,
  });

  const resumoQuery = useQuery({
    queryKey: ['funcionario', funcId, 'resumo'],
    queryFn: () => fetchFuncionarioResumoBlocos(funcId!),
    enabled: !!funcId,
  });

  return {
    funcionario: funcionarioQuery.data ?? null,
    resumoBlocos: resumoQuery.data ?? [],
    isLoading: funcionarioQuery.isLoading || resumoQuery.isLoading,
    isError: funcionarioQuery.isError || resumoQuery.isError,
    error: funcionarioQuery.error ?? resumoQuery.error,
  };
}
