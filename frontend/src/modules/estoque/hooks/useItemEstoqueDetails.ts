import { useQuery } from '@tanstack/react-query';
import { fetchItemEstoqueById } from '../services/estoque.service';

export function useItemEstoqueDetails(itemId?: string) {
  return useQuery({
    queryKey: ['estoque-item-details', itemId],
    queryFn: () => fetchItemEstoqueById(itemId ?? ''),
    enabled: Boolean(itemId),
  });
}
