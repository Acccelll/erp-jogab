import { z } from 'zod';
import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type { AuthCredentials, AuthSession, PapelUsuario, Permissao, Usuario } from '@/shared/types';

const authCredentialsSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

const rolePermissions: Record<PapelUsuario, Permissao[]> = {
  admin: [
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
  gestor: [
    'dashboard:read',
    'obras:read', 'obras:write',
    'rh:read',
    'horas-extras:read', 'horas-extras:approve',
    'fopag:read',
    'compras:read', 'compras:approve',
    'fiscal:read',
    'financeiro:read', 'financeiro:approve',
    'estoque:read',
    'medicoes:read', 'medicoes:approve',
    'documentos:read',
    'relatorios:read',
  ],
  operador: [
    'dashboard:read',
    'obras:read',
    'rh:read',
    'horas-extras:read', 'horas-extras:write',
    'fopag:read',
    'compras:read', 'compras:write',
    'fiscal:read', 'fiscal:write',
    'financeiro:read',
    'estoque:read', 'estoque:write',
    'medicoes:read', 'medicoes:write',
    'documentos:read', 'documentos:write',
    'relatorios:read',
  ],
  visualizador: [
    'dashboard:read',
    'obras:read',
    'rh:read',
    'horas-extras:read',
    'fopag:read',
    'compras:read',
    'fiscal:read',
    'financeiro:read',
    'estoque:read',
    'medicoes:read',
    'documentos:read',
    'relatorios:read',
  ],
};

interface MockAuthUser {
  email: string;
  password: string;
  usuario: Omit<Usuario, 'permissoes'> & { papel: PapelUsuario };
}

const mockUsers: MockAuthUser[] = [
  {
    email: 'admin@jogab.com.br',
    password: 'jogab123',
    usuario: {
      id: 'usr-admin-1',
      nome: 'Administrador JOGAB',
      email: 'admin@jogab.com.br',
      papel: 'admin',
      empresaId: 'emp-1',
      filialId: 'fil-1',
    },
  },
  {
    email: 'gestor.obras@jogab.com.br',
    password: 'jogab123',
    usuario: {
      id: 'usr-gestor-1',
      nome: 'Gestor de Obras',
      email: 'gestor.obras@jogab.com.br',
      papel: 'gestor',
      empresaId: 'emp-1',
      filialId: 'fil-2',
    },
  },
];

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSessionToken(userId: string) {
  return `mock-session-${userId}`;
}

function buildUsuario(mock: MockAuthUser): Usuario {
  return {
    ...mock.usuario,
    permissoes: rolePermissions[mock.usuario.papel],
  };
}

export const AUTH_API_ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
  logout: '/auth/logout',
} as const;

export const DEFAULT_LOGIN_CREDENTIALS = {
  email: 'admin@jogab.com.br',
  password: 'jogab123',
} satisfies AuthCredentials;

export async function loginWithMock(credentials: AuthCredentials): Promise<AuthSession> {
  const parsed = authCredentialsSchema.parse(credentials);
  await delay();

  const found = mockUsers.find(
    (user) =>
      user.email.toLowerCase() === parsed.email.toLowerCase().trim() &&
      user.password === parsed.password,
  );

  if (!found) {
    throw new Error('Credenciais inválidas. Use as credenciais de demonstração ou um usuário mock cadastrado.');
  }

  return {
    token: buildSessionToken(found.usuario.id),
    usuario: buildUsuario(found),
  };
}

export async function fetchMockSession(token: string | null): Promise<AuthSession | null> {
  await delay(150);
  if (!token?.startsWith('mock-session-')) return null;

  const userId = token.replace('mock-session-', '');
  const found = mockUsers.find((user) => user.usuario.id === userId);
  if (!found) return null;

  return {
    token,
    usuario: buildUsuario(found),
  };
}

export async function logoutWithMock(): Promise<void> {
  await delay(120);
}

// ---------------------------------------------------------------------------
// Funções públicas com fallback (usadas pelo authStore)
// ---------------------------------------------------------------------------

/**
 * Realiza login via API com fallback para mock.
 * Quando a API real estiver disponível, a chamada api.post será atendida;
 * caso contrário, o fallback mock será utilizado automaticamente.
 */
export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  return withApiFallback(
    async () => {
      const response = await api.post(AUTH_API_ENDPOINTS.login, credentials);
      return unwrapApiResponse<AuthSession>(response.data);
    },
    () => loginWithMock(credentials),
  );
}

/**
 * Restaura sessão via API (GET /auth/me) com fallback para mock.
 */
export async function fetchSession(token: string | null): Promise<AuthSession | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(AUTH_API_ENDPOINTS.me);
      return unwrapApiResponse<AuthSession>(response.data);
    },
    () => fetchMockSession(token),
  );
}

/**
 * Realiza logout via API com fallback para mock.
 */
export async function logout(): Promise<void> {
  return withApiFallback(
    async () => {
      await api.post(AUTH_API_ENDPOINTS.logout);
    },
    () => logoutWithMock(),
  );
}
