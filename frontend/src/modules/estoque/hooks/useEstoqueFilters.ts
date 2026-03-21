import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultEstoqueFilters } from '../types';
import type { EstoqueFiltersData, EstoqueMovimentacaoTipo, EstoqueStatus, EstoqueTipoItem } from '../types';

const MODULE_KEY = 'estoque';

export function useEstoqueFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: EstoqueFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultEstoqueFilters.search,
      status: (raw.status as EstoqueStatus) ?? defaultEstoqueFilters.status,
      tipo: (raw.tipo as EstoqueTipoItem) ?? defaultEstoqueFilters.tipo,
      localId: (raw.localId as string) ?? defaultEstoqueFilters.localId,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultEstoqueFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultEstoqueFilters.obraId,
      movimentacaoTipo: (raw.movimentacaoTipo as EstoqueMovimentacaoTipo) ?? defaultEstoqueFilters.movimentacaoTipo,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: EstoqueStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setTipo = useCallback((value: EstoqueTipoItem | undefined) => setFilter(MODULE_KEY, 'tipo', value), [setFilter]);
  const setLocalId = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'localId', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const setMovimentacaoTipo = useCallback((value: EstoqueMovimentacaoTipo | undefined) => setFilter(MODULE_KEY, 'movimentacaoTipo', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.tipo || filters.localId || filters.competencia || filters.obraId || filters.movimentacaoTipo);

  return {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setLocalId,
    setCompetencia,
    setMovimentacaoTipo,
    clearFilters,
    hasActiveFilters,
  };
}
