import { useQuery } from '@tanstack/react-query';
import type { EstoqueFiltersData } from '../types';
import { fetchMovimentacoesEstoque } from '../services/estoque.service';

export function useMovimentacoesEstoque(filters?: EstoqueFiltersData) {
  return useQuery({
    queryKey: ['estoque-movimentacoes', filters],
    queryFn: () => fetchMovimentacoesEstoque(filters),
  });
}
