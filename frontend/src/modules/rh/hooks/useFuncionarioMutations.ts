import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFuncionario, updateFuncionario } from '../services/funcionarios.service';
import type { FuncionarioCreatePayload, FuncionarioUpdatePayload } from '../types';

export function useCreateFuncionario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FuncionarioCreatePayload) => createFuncionario(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      void queryClient.invalidateQueries({ queryKey: ['funcionario', result.funcionario.id] });
    },
  });
}

export function useUpdateFuncionario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FuncionarioUpdatePayload) => updateFuncionario(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      void queryClient.invalidateQueries({ queryKey: ['funcionario', result.funcionario.id] });
    },
  });
}
