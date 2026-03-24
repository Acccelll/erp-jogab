import { describe, it, expect, beforeEach } from 'vitest';
import { useFiltersStore } from './filtersStore';

describe('filtersStore', () => {
  beforeEach(() => {
    useFiltersStore.getState().clearAllFilters();
  });

  it('has correct initial state', () => {
    const state = useFiltersStore.getState();
    expect(state.filters).toEqual({});
  });

  it('setFilter adds filter for a module', () => {
    useFiltersStore.getState().setFilter('obras', 'status', 'em_andamento');
    const filters = useFiltersStore.getState().getModuleFilters('obras');
    expect(filters.status).toBe('em_andamento');
  });

  it('setFilter can set multiple keys for the same module', () => {
    const store = useFiltersStore.getState();
    store.setFilter('rh', 'status', 'ativo');
    store.setFilter('rh', 'tipoContrato', 'clt');

    const filters = useFiltersStore.getState().getModuleFilters('rh');
    expect(filters.status).toBe('ativo');
    expect(filters.tipoContrato).toBe('clt');
  });

  it('setFilter for different modules keeps them isolated', () => {
    const store = useFiltersStore.getState();
    store.setFilter('obras', 'status', 'concluida');
    store.setFilter('rh', 'status', 'ativo');

    expect(useFiltersStore.getState().getModuleFilters('obras').status).toBe('concluida');
    expect(useFiltersStore.getState().getModuleFilters('rh').status).toBe('ativo');
  });

  it('clearModuleFilters removes only the specified module filters', () => {
    const store = useFiltersStore.getState();
    store.setFilter('obras', 'status', 'em_andamento');
    store.setFilter('rh', 'status', 'ativo');

    store.clearModuleFilters('obras');

    expect(useFiltersStore.getState().getModuleFilters('obras')).toEqual({});
    expect(useFiltersStore.getState().getModuleFilters('rh').status).toBe('ativo');
  });

  it('clearAllFilters removes all module filters', () => {
    const store = useFiltersStore.getState();
    store.setFilter('obras', 'status', 'em_andamento');
    store.setFilter('rh', 'status', 'ativo');
    store.setFilter('fopag', 'competencia', '2026-03');

    store.clearAllFilters();

    expect(useFiltersStore.getState().filters).toEqual({});
  });

  it('getModuleFilters returns empty object for unknown module', () => {
    expect(useFiltersStore.getState().getModuleFilters('nonexistent')).toEqual({});
  });

  it('setFilter overwrites existing value for same key', () => {
    const store = useFiltersStore.getState();
    store.setFilter('obras', 'status', 'planejamento');
    store.setFilter('obras', 'status', 'em_andamento');

    expect(useFiltersStore.getState().getModuleFilters('obras').status).toBe('em_andamento');
  });
});
