import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: true, sidebarPinned: false, dashboardSectionsOpen: {} });
  });

  it('has correct initial state', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    expect(useUIStore.getState().sidebarPinned).toBe(false);
    expect(useUIStore.getState().dashboardSectionsOpen).toEqual({});
  });

  it('setSidebarCollapsed sets to false', () => {
    useUIStore.getState().setSidebarCollapsed(false);
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('setSidebarCollapsed sets to true', () => {
    useUIStore.getState().setSidebarCollapsed(false);
    useUIStore.getState().setSidebarCollapsed(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it('toggleSidebar toggles from true to false', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('toggleSidebar toggles from false to true', () => {
    useUIStore.getState().setSidebarCollapsed(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it('toggleSidebar multiple times alternates state', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('setSidebarPinned pins and expands sidebar', () => {
    useUIStore.getState().setSidebarPinned(true);
    expect(useUIStore.getState().sidebarPinned).toBe(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('setSidebarPinned unpins and collapses sidebar', () => {
    useUIStore.getState().setSidebarPinned(true);
    useUIStore.getState().setSidebarPinned(false);
    expect(useUIStore.getState().sidebarPinned).toBe(false);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  describe('dashboardSectionsOpen', () => {
    it('setDashboardSectionOpen stores open state for a section', () => {
      useUIStore.getState().setDashboardSectionOpen('obras', false);
      expect(useUIStore.getState().dashboardSectionsOpen).toEqual({ obras: false });
    });

    it('setDashboardSectionOpen stores open state for multiple sections independently', () => {
      useUIStore.getState().setDashboardSectionOpen('obras', true);
      useUIStore.getState().setDashboardSectionOpen('rh', false);
      useUIStore.getState().setDashboardSectionOpen('financeiro', true);
      expect(useUIStore.getState().dashboardSectionsOpen).toEqual({
        obras: true,
        rh: false,
        financeiro: true,
      });
    });

    it('setDashboardSectionOpen updates an existing section without affecting others', () => {
      useUIStore.getState().setDashboardSectionOpen('obras', true);
      useUIStore.getState().setDashboardSectionOpen('rh', false);
      useUIStore.getState().setDashboardSectionOpen('obras', false);
      expect(useUIStore.getState().dashboardSectionsOpen.obras).toBe(false);
      expect(useUIStore.getState().dashboardSectionsOpen.rh).toBe(false);
    });
  });
});
