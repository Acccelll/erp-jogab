import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultCompraFilters } from '../types';
import type { CompraCategoria, CompraFiltersData, CompraPrioridade, CompraStatus } from '../types';

const MODULE_KEY = 'compras';

export function useCompraFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: CompraFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultCompraFilters.search,
      status: (raw.status as CompraStatus) ?? defaultCompraFilters.status,
      categoria: (raw.categoria as CompraCategoria) ?? defaultCompraFilters.categoria,
      prioridade: (raw.prioridade as CompraPrioridade) ?? defaultCompraFilters.prioridade,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultCompraFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultCompraFilters.obraId,
      fornecedorId: (raw.fornecedorId as string) ?? defaultCompraFilters.fornecedorId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: CompraStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setCategoria = useCallback((value: CompraCategoria | undefined) => setFilter(MODULE_KEY, 'categoria', value), [setFilter]);
  const setPrioridade = useCallback((value: CompraPrioridade | undefined) => setFilter(MODULE_KEY, 'prioridade', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.categoria || filters.prioridade || filters.competencia || filters.obraId || filters.fornecedorId,
  );

  return {
    filters,
    setSearch,
    setStatus,
    setCategoria,
    setPrioridade,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
