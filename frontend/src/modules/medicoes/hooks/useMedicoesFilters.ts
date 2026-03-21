import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultMedicoesFilters } from '../types';
import type {
  MedicaoAprovacaoStatus,
  MedicaoFaturamentoStatus,
  MedicaoStatus,
  MedicoesFiltersData,
} from '../types';

const MODULE_KEY = 'medicoes';

export function useMedicoesFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: MedicoesFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultMedicoesFilters.search,
      status: (raw.status as MedicaoStatus) ?? defaultMedicoesFilters.status,
      aprovacaoStatus: (raw.aprovacaoStatus as MedicaoAprovacaoStatus) ?? defaultMedicoesFilters.aprovacaoStatus,
      faturamentoStatus: (raw.faturamentoStatus as MedicaoFaturamentoStatus) ?? defaultMedicoesFilters.faturamentoStatus,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultMedicoesFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultMedicoesFilters.obraId,
      contratoId: (raw.contratoId as string) ?? defaultMedicoesFilters.contratoId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: MedicaoStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setAprovacaoStatus = useCallback((value: MedicaoAprovacaoStatus | undefined) => setFilter(MODULE_KEY, 'aprovacaoStatus', value), [setFilter]);
  const setFaturamentoStatus = useCallback((value: MedicaoFaturamentoStatus | undefined) => setFilter(MODULE_KEY, 'faturamentoStatus', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.aprovacaoStatus || filters.faturamentoStatus || filters.competencia || filters.obraId || filters.contratoId,
  );

  return {
    filters,
    setSearch,
    setStatus,
    setAprovacaoStatus,
    setFaturamentoStatus,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
