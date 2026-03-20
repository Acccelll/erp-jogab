import { create } from 'zustand';

interface FiltersState {
  filters: Record<string, Record<string, unknown>>;
  setFilter: (module: string, key: string, value: unknown) => void;
  clearModuleFilters: (module: string) => void;
  clearAllFilters: () => void;
  getModuleFilters: (module: string) => Record<string, unknown>;
}

export const useFiltersStore = create<FiltersState>()((set, get) => ({
  filters: {},

  setFilter: (module, key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [module]: {
          ...state.filters[module],
          [key]: value,
        },
      },
    })),

  clearModuleFilters: (module) =>
    set((state) => {
      const { [module]: _, ...rest } = state.filters;
      void _;
      return { filters: rest };
    }),

  clearAllFilters: () => set({ filters: {} }),

  getModuleFilters: (module) => get().filters[module] ?? {},
}));
