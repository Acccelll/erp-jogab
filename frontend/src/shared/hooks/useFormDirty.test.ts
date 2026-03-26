import { renderHook, act } from '@testing-library/react';
import { useFormDirty } from './useFormDirty';
import { useDirtyStore } from '@/shared/stores';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useFormDirty', () => {
  beforeEach(() => {
    act(() => {
      useDirtyStore.getState().resetDirty();
    });
  });

  it('should set global dirty state to true when isDirty is true', () => {
    renderHook(() => useFormDirty(true, 'Test message'));
    expect(useDirtyStore.getState().isDirty).toBe(true);
    expect(useDirtyStore.getState().message).toBe('Test message');
  });

  it('should set global dirty state to false when isDirty is false', () => {
    renderHook(() => useFormDirty(false));
    expect(useDirtyStore.getState().isDirty).toBe(false);
  });

  it('should reset dirty state on unmount', () => {
    const { unmount } = renderHook(() => useFormDirty(true));
    expect(useDirtyStore.getState().isDirty).toBe(true);
    unmount();
    expect(useDirtyStore.getState().isDirty).toBe(false);
  });
});
