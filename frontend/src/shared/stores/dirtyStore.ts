import { create } from 'zustand';

interface DirtyState {
  isDirty: boolean;
  message: string | null;
  setDirty: (isDirty: boolean, message?: string) => void;
  resetDirty: () => void;
}

export const useDirtyStore = create<DirtyState>()((set) => ({
  isDirty: false,
  message: null,

  setDirty: (isDirty, message = 'Você tem alterações não salvas. Deseja sair?') =>
    set({ isDirty, message: isDirty ? message : null }),

  resetDirty: () =>
    set({ isDirty: false, message: null }),
}));
