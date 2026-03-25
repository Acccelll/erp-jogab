import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: true, sidebarPinned: false });
  });

  it('has correct initial state', () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    expect(useUIStore.getState().sidebarPinned).toBe(false);
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
});
