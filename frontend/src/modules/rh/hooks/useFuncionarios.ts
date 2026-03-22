/**
 * Hook para listagem de funcionários com filtros e KPIs.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContextStore } from '@/shared/stores';
import { fetchFuncionarios } from '../services/funcionarios.service';
import type { FuncionarioFiltersData } from '../types';

export function useFuncionarios(filters?: FuncionarioFiltersData) {
  const filialId = useContextStore((state) => state.filialId);
  const obraId = useContextStore((state) => state.obraId);

  const resolvedFilters = useMemo(
    () => ({
      search: filters?.search ?? '',
      status: filters?.status,
      tipoContrato: filters?.tipoContrato,
      departamento: filters?.departamento,
      filialId: filters?.filialId ?? filialId ?? undefined,
      obraId: filters?.obraId ?? obraId ?? undefined,
    }),
    [filters, filialId, obraId],
  );

  return useQuery({
    queryKey: ['funcionarios', resolvedFilters],
    queryFn: () => fetchFuncionarios(resolvedFilters),
  });
}
