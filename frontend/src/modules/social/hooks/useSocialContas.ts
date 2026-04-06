import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSocialConta, deleteSocialConta, fetchSocialContas, syncSocialConta } from '../services/social.service';
import type { SocialContaPayload } from '../types';

export function useSocialContas() {
  return useQuery({
    queryKey: ['social-contas'],
    queryFn: fetchSocialContas,
  });
}

export function useCreateSocialConta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SocialContaPayload) => createSocialConta(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['social-contas'] });
    },
  });
}

export function useDeleteSocialConta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSocialConta(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['social-contas'] });
    },
  });
}

export function useSyncSocialConta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => syncSocialConta(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['social-contas'] }),
        queryClient.invalidateQueries({ queryKey: ['social-dashboard'] }),
      ]);
    },
  });
}
