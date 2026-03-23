import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createObra, updateObra } from '../services/obras.service';
import type { ObraCreatePayload, ObraUpdatePayload } from '../types';

export function useCreateObra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ObraCreatePayload) => createObra(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['obras'] });
      void queryClient.invalidateQueries({ queryKey: ['obra', result.obra.id] });
    },
  });
}

export function useUpdateObra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ObraUpdatePayload) => updateObra(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['obras'] });
      void queryClient.invalidateQueries({ queryKey: ['obra', result.obra.id] });
    },
  });
}
