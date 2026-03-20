import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@/shared/types';

/** Usuário mock para desenvolvimento — removido quando a API de login estiver pronta */
const DEV_USUARIO: Usuario = {
  id: 'dev-1',
  nome: 'Admin Dev',
  email: 'admin@jogab.com.br',
  papel: 'admin',
  permissoes: [
    'dashboard:read',
    'obras:read', 'obras:write',
    'rh:read', 'rh:write',
    'horas-extras:read', 'horas-extras:write', 'horas-extras:approve',
    'fopag:read', 'fopag:write', 'fopag:approve',
    'compras:read', 'compras:write', 'compras:approve',
    'fiscal:read', 'fiscal:write',
    'financeiro:read', 'financeiro:write', 'financeiro:approve',
    'estoque:read', 'estoque:write',
    'medicoes:read', 'medicoes:write', 'medicoes:approve',
    'documentos:read', 'documentos:write',
    'relatorios:read',
    'admin:read', 'admin:write',
  ],
  empresaId: 'emp-1',
  filialId: 'fil-1',
};

const isDev = import.meta.env.DEV;

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
      usuario: isDev ? DEV_USUARIO : null,
      token: isDev ? 'dev-token' : null,
      isAuthenticated: isDev,

      setAuth: (usuario, token) => {
        set({ usuario, token, isAuthenticated: true });
      },

      logout: () => {
        set({ usuario: null, token: null, isAuthenticated: false });
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
        };
      },
    },
  ),
);
