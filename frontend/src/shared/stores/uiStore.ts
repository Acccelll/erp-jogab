import { create } from 'zustand';

interface UIState {
  /** Whether sidebar is collapsed (icon-only mode on desktop, hidden on mobile) */
  sidebarCollapsed: boolean;
  /** Whether the user pinned the sidebar open (toggle button) */
  sidebarPinned: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: true,
  sidebarPinned: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setSidebarPinned: (pinned) => set({ sidebarPinned: pinned, sidebarCollapsed: !pinned }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
