import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchAdminDashboard,
  fetchUsuarios,
  fetchPerfis,
  fetchPermissoes,
  fetchParametros,
  fetchLogs,
  fetchIntegracoes,
  createUsuario,
  updateUsuario,
  createPerfil,
  updatePerfil,
  updatePermissao,
  normalizeAdminDashboardData,
  normalizeAdminUsuarios,
  normalizeAdminPerfis,
  normalizeAdminPermissoes,
  ADMIN_API_ENDPOINTS,
} from './admin.service';
import { getMockAdminDashboard, adminUsuarios, adminPerfis, adminPermissoes } from '../data/admin.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return { ...actual, api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } };
});

const mockApiGet = vi.mocked(api.get);
const mockApiPost = vi.mocked(api.post);
const mockApiPut = vi.mocked(api.put);

describe('AdminService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------------------------------------------------------------------------
  // fetchAdminDashboard
  // ---------------------------------------------------------------------------
  describe('fetchAdminDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockAdminDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchAdminDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.dashboard, { params: undefined });
      expect(result.resumo).toBeDefined();
      expect(Array.isArray(result.usuarios)).toBe(true);
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchAdminDashboard();

      expect(result.resumo).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchAdminDashboard();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await fetchAdminDashboard();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchUsuarios
  // ---------------------------------------------------------------------------
  describe('fetchUsuarios', () => {
    it('fetches usuarios from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: adminUsuarios } });

      const result = await fetchUsuarios();

      expect(mockApiGet).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.usuarios, { params: undefined });
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchUsuarios();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchPerfis
  // ---------------------------------------------------------------------------
  describe('fetchPerfis', () => {
    it('fetches perfis from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: adminPerfis } });

      const result = await fetchPerfis();

      expect(mockApiGet).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.perfis, { params: undefined });
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchPerfis();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchPermissoes
  // ---------------------------------------------------------------------------
  describe('fetchPermissoes', () => {
    it('fetches permissoes from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: adminPermissoes } });

      const result = await fetchPermissoes();

      expect(mockApiGet).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.permissoes, { params: undefined });
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchPermissoes();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchParametros, fetchLogs, fetchIntegracoes
  // ---------------------------------------------------------------------------
  describe('fetchParametros', () => {
    it('fetches parametros from API', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: [] } });
      const result = await fetchParametros();
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });
      const result = await fetchParametros();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('fetchLogs', () => {
    it('fetches logs from API', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: [] } });
      const result = await fetchLogs();
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });
      const result = await fetchLogs();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('fetchIntegracoes', () => {
    it('fetches integracoes from API', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: [] } });
      const result = await fetchIntegracoes();
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on HTTP 502', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });
      const result = await fetchIntegracoes();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // createUsuario
  // ---------------------------------------------------------------------------
  describe('createUsuario', () => {
    const payload = { nome: 'Maria Costa', email: 'maria@jogab.com.br', perfilNome: 'Gerente de Obra' };

    it('creates usuario via API when successful', async () => {
      const mockUser = { id: 'usr-new', ...payload, status: 'ativo', ultimoAcessoEm: new Date().toISOString() };
      mockApiPost.mockResolvedValueOnce({ data: { data: mockUser } });

      const result = await createUsuario(payload);

      expect(mockApiPost).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.usuarios, payload);
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await createUsuario(payload);

      expect(result.nome).toBe(payload.nome);
      expect(result.email).toBe(payload.email);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await createUsuario(payload);

      expect(result).toBeDefined();
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await createUsuario(payload);

      expect(result.status).toBe('ativo');
    });
  });

  // ---------------------------------------------------------------------------
  // updateUsuario
  // ---------------------------------------------------------------------------
  describe('updateUsuario', () => {
    const userId = adminUsuarios[0].id;

    it('updates usuario via API when successful', async () => {
      const mockUser = { ...adminUsuarios[0], nome: 'Novo Nome' };
      mockApiPut.mockResolvedValueOnce({ data: { data: mockUser } });

      const result = await updateUsuario(userId, { nome: 'Novo Nome' });

      expect(mockApiPut).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.usuarioDetail(userId), { nome: 'Novo Nome' });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await updateUsuario(userId, { status: 'inativo' });

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await updateUsuario(userId, { nome: 'Updated' });

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // createPerfil
  // ---------------------------------------------------------------------------
  describe('createPerfil', () => {
    const payload = { nome: 'Fiscal de Obra', descricao: 'Acesso somente leitura ao módulo fiscal' };

    it('creates perfil via API when successful', async () => {
      const mockPerfil = { id: 'perfil-new', ...payload, usuarios: 0, status: 'ativo' };
      mockApiPost.mockResolvedValueOnce({ data: { data: mockPerfil } });

      const result = await createPerfil(payload);

      expect(mockApiPost).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.perfis, payload);
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await createPerfil(payload);

      expect(result.nome).toBe(payload.nome);
      expect(result.status).toBe('ativo');
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await createPerfil(payload);

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // updatePerfil
  // ---------------------------------------------------------------------------
  describe('updatePerfil', () => {
    const perfilId = adminPerfis[0].id;

    it('updates perfil via API when successful', async () => {
      const mockPerfil = { ...adminPerfis[0], descricao: 'Nova descrição' };
      mockApiPut.mockResolvedValueOnce({ data: { data: mockPerfil } });

      const result = await updatePerfil(perfilId, { descricao: 'Nova descrição' });

      expect(mockApiPut).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.perfilDetail(perfilId), {
        descricao: 'Nova descrição',
      });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await updatePerfil(perfilId, { status: 'inativo' });

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // updatePermissao
  // ---------------------------------------------------------------------------
  describe('updatePermissao', () => {
    const permissaoId = adminPermissoes[0].id;

    it('updates permissao via API when successful', async () => {
      const mockPerm = { ...adminPermissoes[0], nivel: 'escrita' as const };
      mockApiPut.mockResolvedValueOnce({ data: { data: mockPerm } });

      const result = await updatePermissao(permissaoId, { nivel: 'escrita' });

      expect(mockApiPut).toHaveBeenCalledWith(ADMIN_API_ENDPOINTS.permissaoDetail(permissaoId), { nivel: 'escrita' });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await updatePermissao(permissaoId, { status: 'inativo' });

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await updatePermissao(permissaoId, { nivel: 'leitura' });

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Normalizers
  // ---------------------------------------------------------------------------
  describe('normalizeAdminDashboardData', () => {
    it('returns defaults for null', () => {
      const result = normalizeAdminDashboardData(null);

      expect(result.usuarios).toEqual([]);
      expect(result.perfis).toEqual([]);
      expect(result.resumo.totalUsuarios).toBe(0);
    });

    it('returns defaults for undefined', () => {
      const result = normalizeAdminDashboardData(undefined);

      expect(result.permissoes).toEqual([]);
      expect(result.resumo.integracoesAtivas).toBe(0);
    });

    it('merges partial resumo with defaults', () => {
      const result = normalizeAdminDashboardData({ resumo: { totalUsuarios: 10 } as never });

      expect(result.resumo.totalUsuarios).toBe(10);
      expect(result.resumo.totalPerfis).toBe(0);
    });

    it('normalizes non-array usuarios to empty array', () => {
      const result = normalizeAdminDashboardData({ usuarios: 'wrong' as never });

      expect(result.usuarios).toEqual([]);
    });

    it('preserves valid payload', () => {
      const payload = getMockAdminDashboard();
      const result = normalizeAdminDashboardData(payload);

      expect(result.resumo).toBeDefined();
    });
  });

  describe('normalizeAdminUsuarios', () => {
    it('returns empty array for null', () => {
      expect(normalizeAdminUsuarios(null)).toEqual([]);
    });

    it('returns empty array for non-array', () => {
      expect(normalizeAdminUsuarios('wrong')).toEqual([]);
    });

    it('returns array as-is', () => {
      expect(normalizeAdminUsuarios(adminUsuarios)).toBe(adminUsuarios);
    });
  });

  describe('normalizeAdminPerfis', () => {
    it('returns empty array for null', () => {
      expect(normalizeAdminPerfis(null)).toEqual([]);
    });

    it('returns array as-is', () => {
      expect(normalizeAdminPerfis(adminPerfis)).toBe(adminPerfis);
    });
  });

  describe('normalizeAdminPermissoes', () => {
    it('returns empty array for non-array', () => {
      expect(normalizeAdminPermissoes(42)).toEqual([]);
    });

    it('returns array as-is', () => {
      expect(normalizeAdminPermissoes(adminPermissoes)).toBe(adminPermissoes);
    });
  });
});
