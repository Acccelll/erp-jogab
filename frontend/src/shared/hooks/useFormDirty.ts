import { useEffect } from 'react';
import { useDirtyStore } from '@/shared/stores';

/**
 * Hook to track a "dirty" form state in the global store.
 *
 * @param isDirty boolean indicating if the form currently has unsaved changes.
 * @param message optional message to show in the confirmation modal.
 */
export function useFormDirty(isDirty: boolean, message?: string) {
  const setDirty = useDirtyStore((state) => state.setDirty);
  const resetDirty = useDirtyStore((state) => state.resetDirty);

  useEffect(() => {
    if (isDirty) {
      setDirty(true, message);
    } else {
      setDirty(false);
    }

    // Cleanup when component unmounts
    return () => {
      resetDirty();
    };
  }, [isDirty, message, setDirty, resetDirty]);
}
