import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultAdminFilters } from '../types';
import type { AdminCategoria, AdminFiltersData, AdminStatus } from '../types';

const MODULE_KEY = 'admin';

export function useAdminFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: AdminFiltersData = useMemo(() => ({
    search: (raw.search as string) ?? defaultAdminFilters.search,
    categoria: (raw.categoria as AdminCategoria) ?? defaultAdminFilters.categoria,
    status: (raw.status as AdminStatus) ?? defaultAdminFilters.status,
    competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultAdminFilters.competencia,
    obraId: (raw.obraId as string) ?? contextObraId ?? defaultAdminFilters.obraId,
  }), [contextCompetencia, contextObraId, raw]);

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setCategoria = useCallback((value: AdminCategoria | undefined) => setFilter(MODULE_KEY, 'categoria', value), [setFilter]);
  const setStatus = useCallback((value: AdminStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.categoria || filters.status || filters.competencia || filters.obraId);

  return { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters };
}
