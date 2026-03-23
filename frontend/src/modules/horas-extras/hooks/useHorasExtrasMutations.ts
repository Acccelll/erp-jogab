import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveHoraExtra, fecharCompetenciaHorasExtras } from '../services/horasExtras.service';

function invalidateHorasExtrasQueries(queryClient: ReturnType<typeof useQueryClient>, competencia: string) {
  void queryClient.invalidateQueries({ queryKey: ['horas-extras'] });
  void queryClient.invalidateQueries({ queryKey: ['horas-extras', 'aprovacao'] });
  void queryClient.invalidateQueries({ queryKey: ['horas-extras-fechamentos'] });
  void queryClient.invalidateQueries({ queryKey: ['fopag-competencias'] });
  void queryClient.invalidateQueries({ queryKey: ['fopag-competencia-details', competencia] });
  void queryClient.invalidateQueries({ queryKey: ['obra'] });
  void queryClient.invalidateQueries({ queryKey: ['obras'] });
}

export function useApproveHoraExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveHoraExtra(id),
    onSuccess: (result) => {
      invalidateHorasExtrasQueries(queryClient, result.lancamento.competencia);
    },
  });
}

export function useFecharCompetenciaHorasExtras() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (competencia: string) => fecharCompetenciaHorasExtras(competencia),
    onSuccess: (result) => {
      invalidateHorasExtrasQueries(queryClient, result.fechamento.competencia);
    },
  });
}
