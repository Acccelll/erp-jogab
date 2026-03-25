import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  loginWithMock,
  fetchMockSession,
  logoutWithMock,
  DEFAULT_LOGIN_CREDENTIALS,
  AUTH_API_ENDPOINTS,
} from '@/shared/lib/auth.service';

// ---------------------------------------------------------------------------
// AUTH_API_ENDPOINTS
// ---------------------------------------------------------------------------
describe('AUTH_API_ENDPOINTS', () => {
  it('defines login, me, and logout paths', () => {
    expect(AUTH_API_ENDPOINTS.login).toBe('/auth/login');
    expect(AUTH_API_ENDPOINTS.me).toBe('/auth/me');
    expect(AUTH_API_ENDPOINTS.logout).toBe('/auth/logout');
  });
});

// ---------------------------------------------------------------------------
// DEFAULT_LOGIN_CREDENTIALS
// ---------------------------------------------------------------------------
describe('DEFAULT_LOGIN_CREDENTIALS', () => {
  it('has valid email and password', () => {
    expect(DEFAULT_LOGIN_CREDENTIALS.email).toContain('@');
    expect(DEFAULT_LOGIN_CREDENTIALS.password.length).toBeGreaterThanOrEqual(6);
  });
});

// ---------------------------------------------------------------------------
// loginWithMock
// ---------------------------------------------------------------------------
describe('loginWithMock', () => {
  it('returns a valid session for admin credentials', async () => {
    const session = await loginWithMock(DEFAULT_LOGIN_CREDENTIALS);
    expect(session.token).toBeTruthy();
    expect(session.usuario).toBeDefined();
    expect(session.usuario.email).toBe(DEFAULT_LOGIN_CREDENTIALS.email);
    expect(session.usuario.id).toBeTruthy();
    expect(session.usuario.nome).toBeTruthy();
    expect(Array.isArray(session.usuario.permissoes)).toBe(true);
    expect(session.usuario.permissoes.length).toBeGreaterThan(0);
  });

  it('returns a valid session for gestor credentials', async () => {
    const session = await loginWithMock({ email: 'gestor.obras@jogab.com.br', password: 'jogab123' });
    expect(session.token).toBeTruthy();
    expect(session.usuario.papel).toBe('gestor');
  });

  it('throws for invalid credentials', async () => {
    await expect(loginWithMock({ email: 'bad@example.com', password: 'wrong' })).rejects.toThrow();
  });

  it('throws for invalid email format', async () => {
    await expect(loginWithMock({ email: 'not-an-email', password: 'jogab123' })).rejects.toThrow();
  });

  it('throws for short password', async () => {
    await expect(loginWithMock({ email: 'admin@jogab.com.br', password: '123' })).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// fetchMockSession
// ---------------------------------------------------------------------------
describe('fetchMockSession', () => {
  it('restores session from valid mock token', async () => {
    const loginResult = await loginWithMock(DEFAULT_LOGIN_CREDENTIALS);
    const session = await fetchMockSession(loginResult.token);
    expect(session).toBeTruthy();
    expect(session?.token).toBe(loginResult.token);
    expect(session?.usuario.email).toBe(DEFAULT_LOGIN_CREDENTIALS.email);
  });

  it('returns null for null token', async () => {
    const session = await fetchMockSession(null);
    expect(session).toBeNull();
  });

  it('returns null for non-mock token', async () => {
    const session = await fetchMockSession('real-token-from-api');
    expect(session).toBeNull();
  });

  it('returns null for mock token with unknown user ID', async () => {
    const session = await fetchMockSession('mock-session-unknown-user');
    expect(session).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// logoutWithMock
// ---------------------------------------------------------------------------
describe('logoutWithMock', () => {
  it('completes without error', async () => {
    await expect(logoutWithMock()).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Integration scenarios (401, timeout, error handling patterns)
// ---------------------------------------------------------------------------
describe('auth integration error patterns', () => {
  it('401 error should be classified as http by classifyError', async () => {
    const { classifyError } = await import('@/shared/lib/api');
    const axiosErr = new AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      data: { message: 'Token inválido' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(classifyError(axiosErr)).toBe('http');
  });

  it('401 should NOT trigger mock fallback (client error)', async () => {
    const { shouldFallbackToMock } = await import('@/shared/lib/api');
    const axiosErr = new AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      data: { message: 'Token inválido' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    expect(shouldFallbackToMock(axiosErr)).toBe(false);
  });

  it('timeout should trigger mock fallback', async () => {
    const { shouldFallbackToMock } = await import('@/shared/lib/api');
    const axiosErr = new AxiosError('timeout of 15000ms exceeded', 'ECONNABORTED');
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });

  it('network error should trigger mock fallback', async () => {
    const { shouldFallbackToMock } = await import('@/shared/lib/api');
    const axiosErr = new AxiosError('Network Error', 'ERR_NETWORK');
    expect(shouldFallbackToMock(axiosErr)).toBe(true);
  });
});
