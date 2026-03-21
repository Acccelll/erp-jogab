import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultRelatoriosFilters } from '../types';
import type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida, RelatoriosFiltersData } from '../types';

const MODULE_KEY = 'relatorios';

export function useRelatoriosFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: RelatoriosFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultRelatoriosFilters.search,
      categoria: (raw.categoria as RelatorioCategoria) ?? defaultRelatoriosFilters.categoria,
      disponibilidade: (raw.disponibilidade as RelatorioDisponibilidade) ?? defaultRelatoriosFilters.disponibilidade,
      formato: (raw.formato as RelatorioSaida) ?? defaultRelatoriosFilters.formato,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultRelatoriosFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultRelatoriosFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setCategoria = useCallback((value: RelatorioCategoria | undefined) => setFilter(MODULE_KEY, 'categoria', value), [setFilter]);
  const setDisponibilidade = useCallback((value: RelatorioDisponibilidade | undefined) => setFilter(MODULE_KEY, 'disponibilidade', value), [setFilter]);
  const setFormato = useCallback((value: RelatorioSaida | undefined) => setFilter(MODULE_KEY, 'formato', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.categoria || filters.disponibilidade || filters.formato || filters.competencia || filters.obraId);

  return {
    filters,
    setSearch,
    setCategoria,
    setDisponibilidade,
    setFormato,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
