import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Módulos suportados para personalização
 */
export type ModuleId = 'obras' | 'funcionarios' | 'horas-extras' | 'compras' | 'financeiro';

/**
 * Estrutura de preferências de colunas
 */
export interface ColumnPreference {
  id: string;
  label: string;
  visible: boolean;
}

/**
 * Filtro salvo
 */
export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, unknown>; // O formato depende do módulo
}

interface PreferencesState {
  /** Configuração de colunas por módulo */
  columns: Record<ModuleId, ColumnPreference[]>;
  /** Filtros salvos por módulo */
  savedFilters: Record<ModuleId, SavedFilter[]>;
  /** Estado de colapso dos grupos do menu lateral */
  sidebarGroupsCollapsed: Record<string, boolean>;
  /** IDs dos KPIs visíveis no dashboard */
  visibleKpiIds: string[];

  /** Atualiza a visibilidade/ordem das colunas de um módulo */
  setColumns: (moduleId: ModuleId, columns: ColumnPreference[]) => void;

  /** Adiciona um novo filtro salvo */
  saveFilter: (moduleId: ModuleId, filter: Omit<SavedFilter, 'id'>) => void;

  /** Remove um filtro salvo */
  deleteFilter: (moduleId: ModuleId, filterId: string) => void;

  /** Reseta as colunas para o padrão (vazio, forçando o componente a prover o default) */
  resetColumns: (moduleId: ModuleId) => void;
  /** Alterna o estado de colapso de um grupo do menu */
  toggleSidebarGroup: (groupId: string) => void;
  /** Atualiza os KPIs visíveis */
  setVisibleKpiIds: (ids: string[]) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      columns: {} as Record<ModuleId, ColumnPreference[]>,
      savedFilters: {} as Record<ModuleId, SavedFilter[]>,
      sidebarGroupsCollapsed: {},
      visibleKpiIds: ['kpi-previsto', 'kpi-realizado', 'kpi-he', 'kpi-fopag', 'kpi-obras'],

      setColumns: (moduleId, cols) =>
        set((state) => ({
          columns: { ...state.columns, [moduleId]: cols },
        })),

      saveFilter: (moduleId, filter) =>
        set((state) => {
          const id = crypto.randomUUID();
          const moduleFilters = state.savedFilters[moduleId] || [];
          return {
            savedFilters: {
              ...state.savedFilters,
              [moduleId]: [...moduleFilters, { ...filter, id }],
            },
          };
        }),

      deleteFilter: (moduleId, filterId) =>
        set((state) => ({
          savedFilters: {
            ...state.savedFilters,
            [moduleId]: (state.savedFilters[moduleId] || []).filter((f) => f.id !== filterId),
          },
        })),

      resetColumns: (moduleId) =>
        set((state) => {
          const newColumns = { ...state.columns };
          delete newColumns[moduleId];
          return { columns: newColumns };
        }),

      toggleSidebarGroup: (groupId) =>
        set((state) => ({
          sidebarGroupsCollapsed: {
            ...state.sidebarGroupsCollapsed,
            [groupId]: !state.sidebarGroupsCollapsed[groupId],
          },
        })),
      setVisibleKpiIds: (ids: string[]) => set({ visibleKpiIds: ids }),
    }),
    {
      name: 'jogab-preferences',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
