import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFopagFilters } from '../types';
import type { FopagCompetenciaStatus, FopagFiltersData } from '../types';

const MODULE_KEY = 'fopag';

export function useFopagFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FopagFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFopagFilters.search,
      status: (raw.status as FopagCompetenciaStatus) ?? defaultFopagFilters.status,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultFopagFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFopagFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: FopagCompetenciaStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.competencia || filters.obraId);

  return { filters, setSearch, setStatus, setCompetencia, clearFilters, hasActiveFilters };
}
