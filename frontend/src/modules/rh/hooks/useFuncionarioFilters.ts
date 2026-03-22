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
<<<<<<< codex/implement-first-functional-layer-for-obras-and-rh-h63j6z
  const { filialId: contextFilialId, obraId: contextObraId, centroCustoId: contextCentroCustoId } = useContextStore();
=======
  const { filialId: contextFilialId, obraId: contextObraId } = useContextStore();
>>>>>>> main
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FuncionarioFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFuncionarioFilters.search,
      status: (raw.status as FuncionarioStatus) ?? defaultFuncionarioFilters.status,
      tipoContrato: (raw.tipoContrato as TipoContrato) ?? defaultFuncionarioFilters.tipoContrato,
      filialId: (raw.filialId as string) ?? contextFilialId ?? defaultFuncionarioFilters.filialId,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFuncionarioFilters.obraId,
<<<<<<< codex/implement-first-functional-layer-for-obras-and-rh-h63j6z
      centroCustoId: (raw.centroCustoId as string) ?? contextCentroCustoId ?? defaultFuncionarioFilters.centroCustoId,
      departamento: (raw.departamento as string) ?? defaultFuncionarioFilters.departamento,
    }),
    [contextCentroCustoId, contextFilialId, contextObraId, raw],
=======
      departamento: (raw.departamento as string) ?? defaultFuncionarioFilters.departamento,
    }),
    [contextFilialId, contextObraId, raw],
>>>>>>> main
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
<<<<<<< codex/implement-first-functional-layer-for-obras-and-rh-h63j6z
    (filters.obraId && filters.obraId !== contextObraId) ||
    (filters.centroCustoId && filters.centroCustoId !== contextCentroCustoId)
=======
    (filters.obraId && filters.obraId !== contextObraId)
>>>>>>> main
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
