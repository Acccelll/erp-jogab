/**
 * Hook para listagem de obras com filtros e KPIs.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContextStore } from '@/shared/stores';
import { fetchObras } from '../services/obras.service';
import type { ObraFiltersData } from '../types';

export function useObras(filters?: ObraFiltersData) {
  const filialId = useContextStore((state) => state.filialId);

  const resolvedFilters = useMemo(
    () => ({
      search: filters?.search ?? '',
      status: filters?.status,
      tipo: filters?.tipo,
      responsavelId: filters?.responsavelId,
      filialId: filters?.filialId ?? filialId ?? undefined,
    }),
    [filters, filialId],
  );

  return useQuery({
    queryKey: ['obras', resolvedFilters],
    queryFn: () => fetchObras(resolvedFilters),
  });
}
