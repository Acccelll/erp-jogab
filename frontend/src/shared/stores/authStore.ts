import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchMockSession, loginWithMock, logoutWithMock } from '@/shared/lib/auth.service';
import { useContextStore } from '@/shared/stores/contextStore';
import type { AuthCredentials, Usuario } from '@/shared/types';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (usuario: Usuario, token: string) => void;
  login: (credentials: AuthCredentials) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      error: null,

      setAuth: (usuario, token) => {
        set({ usuario, token, isAuthenticated: true, error: null });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await loginWithMock(credentials);
          set({
            usuario: session.usuario,
            token: session.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            usuario: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Não foi possível autenticar.',
          });
          throw error;
        }
      },

      restoreSession: async () => {
        set({ isLoading: true });
        try {
          const token = useAuthStore.getState().token;
          const session = await fetchMockSession(token);
          set({
            usuario: session?.usuario ?? null,
            token: session?.token ?? null,
            isAuthenticated: !!session,
            isLoading: false,
            isHydrated: true,
            error: null,
          });
        } catch {
          set({
            usuario: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isHydrated: true,
            error: 'Falha ao restaurar a sessão.',
          });
        }
      },

      logout: async () => {
        await logoutWithMock();
        useContextStore.getState().resetContext();
        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
          isHydrated: true,
          error: null,
        });
      },
    }),
    {
      name: 'erp-jogab-auth',
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
      }),
      // Derive isAuthenticated from rehydrated data to avoid stale flag
      merge: (persisted, current) => {
        const p = persisted as Partial<AuthState> | undefined;
        const hasAuth = p?.usuario != null && p?.token != null;
        return {
          ...current,
          ...p,
          isAuthenticated: hasAuth,
          isHydrated: false,
          isLoading: false,
          error: null,
        };
      },
    },
  ),
);
