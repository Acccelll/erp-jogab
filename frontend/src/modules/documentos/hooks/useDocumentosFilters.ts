import { useCallback, useMemo } from 'react';
import { useContextStore, useFiltersStore } from '@/shared/stores';
import { defaultDocumentosFilters } from '../types';
import type {
  DocumentoAlerta,
  DocumentoEntidade,
  DocumentoStatus,
  DocumentoTipo,
  DocumentosFiltersData,
} from '../types';

const MODULE_KEY = 'documentos';

export function useDocumentosFilters() {
  const { getModuleFilters, setFilter, clearModuleFilters } = useFiltersStore();
  const { competencia: contextCompetencia, obraId: contextObraId } = useContextStore();
  const raw = getModuleFilters(MODULE_KEY);

  const filters: DocumentosFiltersData = useMemo(
    () => ({
      search: (raw.search as string) ?? defaultDocumentosFilters.search,
      status: (raw.status as DocumentoStatus) ?? defaultDocumentosFilters.status,
      tipo: (raw.tipo as DocumentoTipo) ?? defaultDocumentosFilters.tipo,
      entidade: (raw.entidade as DocumentoEntidade) ?? defaultDocumentosFilters.entidade,
      alerta: (raw.alerta as DocumentoAlerta) ?? defaultDocumentosFilters.alerta,
      competencia: (raw.competencia as string) ?? contextCompetencia ?? defaultDocumentosFilters.competencia,
      obraId: (raw.obraId as string) ?? contextObraId ?? defaultDocumentosFilters.obraId,
    }),
    [contextCompetencia, contextObraId, raw],
  );

  const setSearch = useCallback((value: string) => setFilter(MODULE_KEY, 'search', value || undefined), [setFilter]);
  const setStatus = useCallback((value: DocumentoStatus | undefined) => setFilter(MODULE_KEY, 'status', value), [setFilter]);
  const setTipo = useCallback((value: DocumentoTipo | undefined) => setFilter(MODULE_KEY, 'tipo', value), [setFilter]);
  const setEntidade = useCallback((value: DocumentoEntidade | undefined) => setFilter(MODULE_KEY, 'entidade', value), [setFilter]);
  const setAlerta = useCallback((value: DocumentoAlerta | undefined) => setFilter(MODULE_KEY, 'alerta', value), [setFilter]);
  const setCompetencia = useCallback((value: string | undefined) => setFilter(MODULE_KEY, 'competencia', value), [setFilter]);
  const clearFilters = useCallback(() => clearModuleFilters(MODULE_KEY), [clearModuleFilters]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.tipo || filters.entidade || filters.alerta || filters.competencia || filters.obraId);

  return {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setEntidade,
    setAlerta,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  };
}
