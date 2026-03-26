import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  /** Whether sidebar is collapsed (icon-only mode on desktop, hidden on mobile) */
  sidebarCollapsed: boolean;
  /** Whether the user pinned the sidebar open (toggle button) */
  sidebarPinned: boolean;
  /** Persisted open/close state for each dashboard section (keyed by section id) */
  dashboardSectionsOpen: Record<string, boolean>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  toggleSidebar: () => void;
  setDashboardSectionOpen: (sectionId: string, isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: true,
      sidebarPinned: false,
      dashboardSectionsOpen: {},

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setSidebarPinned: (pinned) => set({ sidebarPinned: pinned, sidebarCollapsed: !pinned }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setDashboardSectionOpen: (sectionId, isOpen) =>
        set((state) => ({
          dashboardSectionsOpen: { ...state.dashboardSectionsOpen, [sectionId]: isOpen },
        })),
    }),
    {
      name: 'erp-jogab-ui',
      partialize: (state) => ({
        sidebarPinned: state.sidebarPinned,
        sidebarCollapsed: state.sidebarCollapsed,
        dashboardSectionsOpen: state.dashboardSectionsOpen,
      }),
    },
  ),
);
