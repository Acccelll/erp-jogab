import { useQuery } from '@tanstack/react-query';
import type { CompraFiltersData } from '../types';
import { fetchSolicitacoesCompra } from '../services/compras.service';

export function useSolicitacoesCompra(filters?: CompraFiltersData) {
  return useQuery({
    queryKey: ['compras-solicitacoes', filters],
    queryFn: () => fetchSolicitacoesCompra(filters),
  });
}
