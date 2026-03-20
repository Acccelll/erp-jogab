import { useQuery } from '@tanstack/react-query';
import type { CompraFiltersData } from '../types';
import { fetchComprasDashboard } from '../services/compras.service';

export function useCompras(filters?: CompraFiltersData) {
  return useQuery({
    queryKey: ['compras-dashboard', filters],
    queryFn: () => fetchComprasDashboard(filters),
  });
}
