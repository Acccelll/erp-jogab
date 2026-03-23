import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAlocacao, encerrarAlocacao, updateAlocacao } from '../services/alocacoes.service';
import type { AlocacaoCreatePayload, AlocacaoUpdatePayload } from '@/shared/types';

function invalidateAllocationQueries(queryClient: ReturnType<typeof useQueryClient>, funcionarioId: string, obraId: string) {
  void queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
  void queryClient.invalidateQueries({ queryKey: ['funcionario', funcionarioId] });
  void queryClient.invalidateQueries({ queryKey: ['funcionario', funcionarioId, 'alocacoes'] });
  void queryClient.invalidateQueries({ queryKey: ['obras'] });
  void queryClient.invalidateQueries({ queryKey: ['obra', obraId] });
  void queryClient.invalidateQueries({ queryKey: ['obras', obraId, 'equipe'] });
}

export function useCreateAlocacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AlocacaoCreatePayload) => createAlocacao(payload),
    onSuccess: (result) => {
      invalidateAllocationQueries(queryClient, result.alocacao.funcionarioId, result.alocacao.obraId);
    },
  });
}

export function useUpdateAlocacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AlocacaoUpdatePayload) => updateAlocacao(payload),
    onSuccess: (result) => {
      invalidateAllocationQueries(queryClient, result.alocacao.funcionarioId, result.alocacao.obraId);
    },
  });
}

export function useEncerrarAlocacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alocacaoId: string) => encerrarAlocacao(alocacaoId),
    onSuccess: (result) => {
      invalidateAllocationQueries(queryClient, result.alocacao.funcionarioId, result.alocacao.obraId);
    },
  });
}
