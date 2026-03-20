/**
 * Hook para listagem de funcionários com filtros e KPIs.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchFuncionarios } from '../services/funcionarios.service';
import type { FuncionarioFiltersData } from '../types';

export function useFuncionarios(filters?: FuncionarioFiltersData) {
  return useQuery({
    queryKey: ['funcionarios', filters],
    queryFn: () => fetchFuncionarios(filters),
  });
}
