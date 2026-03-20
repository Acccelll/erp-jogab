import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFinanceiroFilters } from '../types';
import type { FinanceiroFiltersData, FinanceiroOrigem, FinanceiroStatus, FinanceiroTipo } from '../types';

const MODULE_KEY = 'financeiro';

export function useFinanceiroFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FinanceiroFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFinanceiroFilters.search,
      status: (raw.status as FinanceiroStatus) ?? defaultFinanceiroFilters.status,
      tipo: (raw.tipo as FinanceiroTipo) ?? defaultFinanceiroFilters.tipo,
      origem: (raw.origem as FinanceiroOrigem) ?? defaultFinanceiroFilters.origem,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultFinanceiroFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFinanceiroFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: FinanceiroStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setTipo = useCallback((value: FinanceiroTipo | undefined) => setFilter(MODULE_KEY, 'tipo', value), [setFilter]);
  const setOrigem = useCallback((value: FinanceiroOrigem | undefined) => setFilter(MODULE_KEY, 'origem', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.tipo || filters.origem || filters.competencia || filters.obraId);

  return {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setOrigem,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
