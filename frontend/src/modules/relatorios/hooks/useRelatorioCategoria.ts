import { useQuery } from '@tanstack/react-query';
import type { RelatorioCategoria, RelatoriosFiltersData } from '../types';
import { fetchRelatorioCategoria } from '../services/relatorios.service';

export function useRelatorioCategoria(categoria?: RelatorioCategoria, filters?: RelatoriosFiltersData) {
  return useQuery({
    queryKey: ['relatorio-categoria', categoria, filters],
    queryFn: () => fetchRelatorioCategoria(categoria as RelatorioCategoria, filters),
    enabled: Boolean(categoria),
  });
}
