import { useCallback, useMemo } from 'react';
import { useFiltersStore, useContextStore } from '@/shared/stores';
import { defaultHorasExtrasFilters } from '../types';
import type { HoraExtraStatus, HoraExtraTipo, HorasExtrasFiltersData } from '../types';

const MODULE_KEY = 'horas-extras';

export function useHorasExtrasFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { obraId: contextObraId, filialId: contextFilialId, competencia: contextCompetencia } = useContextStore();

  const raw = getModuleFilters(MODULE_KEY);

  const filters: HorasExtrasFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultHorasExtrasFilters.search,
      status: (raw.status as HoraExtraStatus) ?? defaultHorasExtrasFilters.status,
      tipo: (raw.tipo as HoraExtraTipo) ?? defaultHorasExtrasFilters.tipo,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultHorasExtrasFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultHorasExtrasFilters.obraId,
      filialId: (raw.filialId as string) ?? contextFilialId ?? defaultHorasExtrasFilters.filialId,
    }),
    [contextCompetencia, contextFilialId, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: HoraExtraStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setTipo = useCallback((value: HoraExtraTipo | undefined) => setFilter(MODULE_KEY, 'tipo', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const setObraId = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'obraId', value), [setFilter]);
  const setFilialId = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'filialId', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.tipo || filters.competencia || filters.obraId || filters.filialId);

  return {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setCompetencia,
    setObraId,
    setFilialId,
    clearFilters,
    hasActiveFilters,
  };
}
