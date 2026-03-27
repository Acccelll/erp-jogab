import { describe, it, expect, beforeEach } from 'vitest';
import { usePreferencesStore } from './preferencesStore';
import type { ColumnPreference, ModuleId, SavedFilter } from './preferencesStore';

describe('preferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.setState({
      columns: {} as Record<ModuleId, ColumnPreference[]>,
      savedFilters: {} as Record<ModuleId, SavedFilter[]>,
    });
  });

  it('should set and update columns for a module', () => {
    const cols = [
      { id: 'col1', label: 'Col 1', visible: true },
      { id: 'col2', label: 'Col 2', visible: false },
    ];

    usePreferencesStore.getState().setColumns('obras', cols);
    expect(usePreferencesStore.getState().columns.obras).toEqual(cols);
  });

  it('should save and delete filters', () => {
    const filter = { name: 'Meus filtros', filters: { status: 'ativo' } };

    usePreferencesStore.getState().saveFilter('obras', filter);
    const saved = usePreferencesStore.getState().savedFilters.obras;
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Meus filtros');
    expect(saved[0].filters).toEqual({ status: 'ativo' });
    expect(saved[0].id).toBeDefined();

    const id = saved[0].id;
    usePreferencesStore.getState().deleteFilter('obras', id);
    expect(usePreferencesStore.getState().savedFilters.obras).toHaveLength(0);
  });

  it('should reset columns', () => {
    usePreferencesStore.getState().setColumns('obras', [{ id: '1', label: 'L', visible: true }]);
    usePreferencesStore.getState().resetColumns('obras');
    expect(usePreferencesStore.getState().columns.obras).toBeUndefined();
  });
});
