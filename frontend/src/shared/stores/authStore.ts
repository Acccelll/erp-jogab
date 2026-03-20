import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@/shared/types';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,

      setAuth: (usuario, token) => {
        localStorage.setItem('token', token);
        set({ usuario, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ usuario: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'erp-jogab-auth',
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
