import { create } from 'zustand';

interface UIState {
  /** Whether sidebar is collapsed (icon-only mode on desktop, hidden on mobile) */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
