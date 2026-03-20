/**
 * Hook para gerenciamento de filtros de obras.
 * Integra com o filtersStore global.
 */
import { useCallback, useMemo } from 'react';
import { useFiltersStore } from '@/shared/stores';
import { defaultObraFilters } from '../types';
import type { ObraFiltersData, ObraStatus, ObraTipo } from '../types';

const MODULE_KEY = 'obras';

export function useObraFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();

  const raw = getModuleFilters(MODULE_KEY);

  const filters: ObraFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultObraFilters.search,
      status: (raw.status as ObraStatus) ?? defaultObraFilters.status,
      tipo: (raw.tipo as ObraTipo) ?? defaultObraFilters.tipo,
      filialId: (raw.filialId as string) ?? defaultObraFilters.filialId,
      responsavelId: (raw.responsavelId as string) ?? defaultObraFilters.responsavelId,
    }),
    [raw],
  );

  const setSearch = useCallback(
    (value: string) => setFilter(MODULE_KEY, 'search', value || undefined),
    [setFilter],
  );

  const setStatus = useCallback(
    (value: ObraStatus | undefined) => setFilter(MODULE_KEY, 'status', value),
    [setFilter],
  );

  const setTipo = useCallback(
    (value: ObraTipo | undefined) => setFilter(MODULE_KEY, 'tipo', value),
    [setFilter],
  );

  const setFilialId = useCallback(
    (value: string | undefined) => setFilter(MODULE_KEY, 'filialId', value),
    [setFilter],
  );

  const clearFilters = useCallback(
    () => clearModuleFilters(MODULE_KEY),
    [clearModuleFilters],
  );

  const hasActiveFilters = !!(filters.search || filters.status || filters.tipo || filters.filialId);

  return {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setFilialId,
    clearFilters,
    hasActiveFilters,
  };
}
