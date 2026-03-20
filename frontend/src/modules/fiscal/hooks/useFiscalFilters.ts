import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFiscalFilters } from '../types';
import type { FiscalDocumentoStatus, FiscalDocumentoTipo, FiscalFiltersData, FiscalFluxo } from '../types';

const MODULE_KEY = 'fiscal';

export function useFiscalFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FiscalFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFiscalFilters.search,
      status: (raw.status as FiscalDocumentoStatus) ?? defaultFiscalFilters.status,
      tipo: (raw.tipo as FiscalDocumentoTipo) ?? defaultFiscalFilters.tipo,
      fluxo: (raw.fluxo as FiscalFluxo) ?? defaultFiscalFilters.fluxo,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultFiscalFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFiscalFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: FiscalDocumentoStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setTipo = useCallback((value: FiscalDocumentoTipo | undefined) => setFilter(MODULE_KEY, 'tipo', value), [setFilter]);
  const setFluxo = useCallback((value: FiscalFluxo | undefined) => setFilter(MODULE_KEY, 'fluxo', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.tipo || filters.fluxo || filters.competencia || filters.obraId);

  return { filters, setSearch, setStatus, setTipo, setFluxo, setCompetencia, clearFilters, hasActiveFilters };
}
