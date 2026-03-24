import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.getState().setSidebarCollapsed(false);
  });

  it('has correct initial state', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('setSidebarCollapsed sets to true', () => {
    useUIStore.getState().setSidebarCollapsed(true);
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it('setSidebarCollapsed sets to false', () => {
    useUIStore.getState().setSidebarCollapsed(true);
    useUIStore.getState().setSidebarCollapsed(false);
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('toggleSidebar toggles from false to true', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it('toggleSidebar toggles from true to false', () => {
    useUIStore.getState().setSidebarCollapsed(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('toggleSidebar multiple times alternates state', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });
});
