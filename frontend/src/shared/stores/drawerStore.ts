import { create } from 'zustand';
import type { ReactNode } from 'react';

interface DrawerState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
  width?: string;
  openDrawer: (config: { title: string; content: ReactNode; width?: string }) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>()((set) => ({
  isOpen: false,
  title: '',
  content: null,
  width: undefined,

  openDrawer: ({ title, content, width }) =>
    set({ isOpen: true, title, content, width }),

  closeDrawer: () =>
    set({ isOpen: false, title: '', content: null, width: undefined }),
}));
