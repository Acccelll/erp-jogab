import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFuncionarioFilters } from '../types';
import type { FuncionarioFiltersData, FuncionarioStatus, TipoContrato } from '../types';

const MODULE_KEY = 'rh';

interface ContextDefaults {
  filialId: string | null;
  obraId: string | null;
  centroCustoId: string | null;
}

function buildFuncionarioFilters(
  raw: Record<string, unknown>,
  contextDefaults: ContextDefaults,
): FuncionarioFiltersData {
  return {
    search: (raw.search as string) ?? defaultFuncionarioFilters.search,
    status: (raw.status as FuncionarioStatus) ?? defaultFuncionarioFilters.status,
    tipoContrato: (raw.tipoContrato as TipoContrato) ?? defaultFuncionarioFilters.tipoContrato,
    filialId: (raw.filialId as string) ?? contextDefaults.filialId ?? defaultFuncionarioFilters.filialId,
    obraId: (raw.obraId as string) ?? contextDefaults.obraId ?? defaultFuncionarioFilters.obraId,
    centroCustoId:
      (raw.centroCustoId as string) ?? contextDefaults.centroCustoId ?? defaultFuncionarioFilters.centroCustoId,
    departamento: (raw.departamento as string) ?? defaultFuncionarioFilters.departamento,
  };
}

function hasNonContextFilter(
  filters: FuncionarioFiltersData,
  contextDefaults: ContextDefaults,
): boolean {
  return Boolean(
    filters.search ||
      filters.status ||
      filters.tipoContrato ||
      filters.departamento ||
      (filters.filialId && filters.filialId !== contextDefaults.filialId) ||
      (filters.obraId && filters.obraId !== contextDefaults.obraId) ||
      (filters.centroCustoId && filters.centroCustoId !== contextDefaults.centroCustoId),
  );
}

export function useFuncionarioFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const contextDefaults = useContextStore(
    useCallback(
      ({ filialId, obraId, centroCustoId }) => ({ filialId, obraId, centroCustoId }),
      [],
    ),
  );
  const raw = getModuleFilters(MODULE_KEY);

  const filters = useMemo(
    () => buildFuncionarioFilters(raw, contextDefaults),
    [contextDefaults, raw],
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

  const setCentroCustoId = useCallback(
    (value: string | undefined) => setFilter(MODULE_KEY, 'centroCustoId', value),
    [setFilter],
  );

  const setDepartamento = useCallback(
    (value: string | undefined) => setFilter(MODULE_KEY, 'departamento', value),
    [setFilter],
  );

  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = useMemo(
    () => hasNonContextFilter(filters, contextDefaults),
    [contextDefaults, filters],
  );

  return {
    filters,
    setSearch,
    setStatus,
    setTipoContrato,
    setFilialId,
    setObraId,
    setCentroCustoId,
    setDepartamento,
    clearFilters,
    hasActiveFilters,
  };
}
