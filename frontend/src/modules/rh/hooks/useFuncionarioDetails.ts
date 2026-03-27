/**
 * Hook para detalhes de um funcionário específico.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarioDetail } from '../services/funcionarios.service';

export function useFuncionarioDetails(funcId: string | undefined) {
  const detailQuery = useQuery({
    queryKey: ['funcionario', funcId],
    queryFn: () => fetchFuncionarioDetail(funcId!),
    enabled: !!funcId,
  });

  return {
    funcionario: detailQuery.data?.funcionario ?? null,
    resumoBlocos: detailQuery.data?.resumoBlocos ?? [],
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
  };
}
