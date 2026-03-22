import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultFiscalFilters } from '../types';
import type {
  FiscalDocumentoTipo,
  FiscalFiltersData,
  FiscalIntegracaoStatus,
  FiscalStatus,
  FiscalTipoOperacao,
} from '../types';

const MODULE_KEY = 'fiscal';

export function useFiscalFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: FiscalFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultFiscalFilters.search,
      tipoOperacao: (raw.tipoOperacao as FiscalTipoOperacao) ?? defaultFiscalFilters.tipoOperacao,
      documentoTipo: (raw.documentoTipo as FiscalDocumentoTipo) ?? defaultFiscalFilters.documentoTipo,
      status: (raw.status as FiscalStatus) ?? defaultFiscalFilters.status,
      estoqueStatus: (raw.estoqueStatus as FiscalIntegracaoStatus) ?? defaultFiscalFilters.estoqueStatus,
      financeiroStatus: (raw.financeiroStatus as FiscalIntegracaoStatus) ?? defaultFiscalFilters.financeiroStatus,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultFiscalFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultFiscalFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setTipoOperacao = useCallback((value: FiscalTipoOperacao | undefined) => setFilter(MODULE_KEY, 'tipoOperacao', value), [setFilter]);
  const setDocumentoTipo = useCallback((value: FiscalDocumentoTipo | undefined) => setFilter(MODULE_KEY, 'documentoTipo', value), [setFilter]);
  const setStatus = useCallback((value: FiscalStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setEstoqueStatus = useCallback((value: FiscalIntegracaoStatus | undefined) => setFilter(MODULE_KEY, 'estoqueStatus', value), [setFilter]);
  const setFinanceiroStatus = useCallback((value: FiscalIntegracaoStatus | undefined) => setFilter(MODULE_KEY, 'financeiroStatus', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.tipoOperacao ||
      filters.documentoTipo ||
      filters.status ||
      filters.estoqueStatus ||
      filters.financeiroStatus ||
      filters.competencia ||
      filters.obraId,
  );

  return {
    filters,
    setSearch,
    setTipoOperacao,
    setDocumentoTipo,
    setStatus,
    setEstoqueStatus,
    setFinanceiroStatus,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
