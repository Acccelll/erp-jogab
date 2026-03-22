/**
 * Hook para gerenciamento de filtros de funcionários.
 * Integra com o filtersStore global.
 */
import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFuncionarioFilters } from '../types';
import type { FuncionarioFiltersData, FuncionarioStatus, TipoContrato } from '../types';

const MODULE_KEY = 'rh';

export function useFuncionarioFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { filialId: contextFilialId, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FuncionarioFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFuncionarioFilters.search,
      status: (raw.status as FuncionarioStatus) ?? defaultFuncionarioFilters.status,
      tipoContrato: (raw.tipoContrato as TipoContrato) ?? defaultFuncionarioFilters.tipoContrato,
      filialId: (raw.filialId as string) ?? contextFilialId ?? defaultFuncionarioFilters.filialId,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFuncionarioFilters.obraId,
      departamento: (raw.departamento as string) ?? defaultFuncionarioFilters.departamento,
    }),
    [contextFilialId, contextObraId, raw],
  );

  const setSearch = useCallback(
    (value: string) => setFilter(MODULE_KEY, 'search', value || undefined),
    [setFilter],
  );

  const setStatus = useCallback(
    (value: FuncionarioStatus | undefined) => setFilter(MODULE_KEY, 'status', value),
    [setFilter],
  );

  const setTipoContrato = useCallback(
    (value: TipoContrato | undefined) => setFilter(MODULE_KEY, 'tipoContrato', value),
    [setFilter],
  );

  const setFilialId = useCallback(
    (value: string | undefined) => setFilter(MODULE_KEY, 'filialId', value),
    [setFilter],
  );

  const setObraId = useCallback(
    (value: string | undefined) => setFilter(MODULE_KEY, 'obraId', value),
    [setFilter],
  );

  const clearFilters = useCallback(
    () => clearModuleFilters(MODULE_KEY),
    [clearModuleFilters],
  );

  const hasActiveFilters = !!(
    filters.search ||
    filters.status ||
    filters.tipoContrato ||
    (filters.filialId && filters.filialId !== contextFilialId) ||
    (filters.obraId && filters.obraId !== contextObraId)
  );

  return {
    filters,
    setSearch,
    setStatus,
    setTipoContrato,
    setFilialId,
    setObraId,
    clearFilters,
    hasActiveFilters,
  };
}
