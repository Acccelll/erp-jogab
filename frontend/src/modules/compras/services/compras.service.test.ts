import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchSolicitacoesCompra,
  fetchCotacoesCompra,
  fetchPedidosCompra,
  fetchPedidoCompraById,
  fetchComprasDashboard,
  normalizeComprasDashboardData,
} from './compras.service';
import { mockSolicitacoesCompra, mockCotacoesCompra, mockPedidosCompra } from '../data/compras.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return {
    ...actual,
    api: {
      get: vi.fn(),
    },
  };
});

const mockApiGet = vi.mocked(api.get);

describe('ComprasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchSolicitacoesCompra
  // ---------------------------------------------------------------------------
  describe('fetchSolicitacoesCompra', () => {
    it('should fetch solicitações from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockSolicitacoesCompra } });

      const result = await fetchSolicitacoesCompra();

      expect(mockApiGet).toHaveBeenCalledWith('/compras/solicitacoes', { params: undefined });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass filters as query params', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockSolicitacoesCompra.slice(0, 1) } });
      const filters = { search: 'concreto', status: 'em_cotacao' as const };

      const result = await fetchSolicitacoesCompra(filters);

      expect(mockApiGet).toHaveBeenCalledWith('/compras/solicitacoes', { params: filters });
      expect(result.length).toBe(1);
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchSolicitacoesCompra();

      expect(mockApiGet).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchSolicitacoesCompra();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on timeout (ECONNABORTED)', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchSolicitacoesCompra();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on network error (ERR_NETWORK)', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchSolicitacoesCompra();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('fallback result items have required fields', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchSolicitacoesCompra();

      const first = result[0];
      expect(first.id).toBeDefined();
      expect(first.codigo).toBeDefined();
      expect(first.status).toBeDefined();
      expect(first.obraId).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchCotacoesCompra
  // ---------------------------------------------------------------------------
  describe('fetchCotacoesCompra', () => {
    it('should fetch cotações from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockCotacoesCompra } });

      const result = await fetchCotacoesCompra();

      expect(mockApiGet).toHaveBeenCalledWith('/compras/cotacoes', { params: undefined });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass filters as query params', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockCotacoesCompra.slice(0, 1) } });
      const filters = { categoria: 'material_obra' as const };

      await fetchCotacoesCompra(filters);

      expect(mockApiGet).toHaveBeenCalledWith('/compras/cotacoes', { params: filters });
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchCotacoesCompra();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchCotacoesCompra();

      expect(Array.isArray(result)).toBe(true);
    });

    it('fallback cotação items have required fields', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchCotacoesCompra();

      const first = result[0];
      expect(first.id).toBeDefined();
      expect(first.solicitacaoId).toBeDefined();
      expect(first.status).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchPedidosCompra
  // ---------------------------------------------------------------------------
  describe('fetchPedidosCompra', () => {
    it('should fetch pedidos from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockPedidosCompra } });

      const result = await fetchPedidosCompra();

      expect(mockApiGet).toHaveBeenCalledWith('/compras/pedidos', { params: undefined });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass filters as query params', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: mockPedidosCompra.slice(0, 2) } });
      const filters = { prioridade: 'alta' as const };

      await fetchPedidosCompra(filters);

      expect(mockApiGet).toHaveBeenCalledWith('/compras/pedidos', { params: filters });
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidosCompra();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on HTTP 504', async () => {
      const axiosError = { isAxiosError: true, response: { status: 504, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidosCompra();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidosCompra();

      expect(Array.isArray(result)).toBe(true);
    });

    it('fallback pedido items have required fields', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchPedidosCompra();

      const first = result[0];
      expect(first.id).toBeDefined();
      expect(first.fornecedorNome).toBeDefined();
      expect(first.valorPedido).toBeDefined();
      expect(first.status).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchPedidoCompraById
  // ---------------------------------------------------------------------------
  describe('fetchPedidoCompraById', () => {
    it('should fetch pedido detail from API when successful', async () => {
      const mockDetalhe = {
        pedido: mockPedidosCompra[0],
        solicitacao: mockSolicitacoesCompra[0],
        cotacao: mockCotacoesCompra[0],
        itens: [],
        timeline: [],
        observacoes: [],
      };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDetalhe } });

      const result = await fetchPedidoCompraById('ped-001');

      expect(mockApiGet).toHaveBeenCalledWith('/compras/pedidos/ped-001');
      expect(result).not.toBeNull();
      expect(result?.pedido.id).toBe(mockPedidosCompra[0].id);
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidoCompraById('ped-001');

      expect(result).not.toBeNull();
      expect(result?.pedido).toBeDefined();
      expect(result?.itens).toBeDefined();
      expect(result?.timeline).toBeDefined();
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidoCompraById('ped-001');

      expect(result).not.toBeNull();
    });

    it('fallback returns null for unknown pedido id', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidoCompraById('NONEXISTENT_ID');

      expect(result).toBeNull();
    });

    it('fallback detail has solicitacao and cotacao linkage', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchPedidoCompraById('ped-001');

      expect(result?.solicitacao?.id).toBeDefined();
      expect(result?.cotacao?.solicitacaoId).toBe(result?.solicitacao?.id);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchComprasDashboard
  // ---------------------------------------------------------------------------
  describe('fetchComprasDashboard', () => {
    it('should fetch dashboard from API when successful', async () => {
      const mockDash = {
        solicitacoes: mockSolicitacoesCompra,
        cotacoes: mockCotacoesCompra,
        pedidos: mockPedidosCompra,
        kpis: {
          totalSolicitacoes: 4,
          solicitacoesPendentes: 1,
          cotacoesEmAberto: 2,
          pedidosEmitidos: 2,
          valorComprometido: 250000,
          valorAguardandoFiscal: 100000,
        },
        resumoCards: [],
        statusResumo: [],
      };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDash } });

      const result = await fetchComprasDashboard();

      expect(mockApiGet).toHaveBeenCalledWith('/compras/dashboard', { params: undefined });
      expect(result.kpis).toBeDefined();
      expect(result.kpis.totalSolicitacoes).toBe(4);
    });

    it('should pass filters as query params', async () => {
      const mockDash = {
        solicitacoes: [],
        cotacoes: [],
        pedidos: [],
        kpis: {
          totalSolicitacoes: 0,
          solicitacoesPendentes: 0,
          cotacoesEmAberto: 0,
          pedidosEmitidos: 0,
          valorComprometido: 0,
          valorAguardandoFiscal: 0,
        },
        resumoCards: [],
        statusResumo: [],
      };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDash } });
      const filters = { competencia: '2026-03' };

      await fetchComprasDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith('/compras/dashboard', { params: filters });
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchComprasDashboard();

      expect(mockApiGet).toHaveBeenCalled();
      expect(result.solicitacoes).toBeDefined();
      expect(result.cotacoes).toBeDefined();
      expect(result.pedidos).toBeDefined();
      expect(result.kpis).toBeDefined();
    });

    it('should fallback to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchComprasDashboard();

      expect(result.kpis.totalSolicitacoes).toBeGreaterThanOrEqual(0);
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchComprasDashboard();

      expect(result.kpis).toBeDefined();
      expect(result.resumoCards).toBeDefined();
    });

    it('fallback dashboard kpis reflect solicitações data coherence', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchComprasDashboard();

      // kpis should be consistent with the lists
      expect(result.kpis.totalSolicitacoes).toBeGreaterThanOrEqual(result.kpis.solicitacoesPendentes);
      expect(result.kpis.valorComprometido).toBeGreaterThanOrEqual(0);
      expect(result.kpis.valorAguardandoFiscal).toBeGreaterThanOrEqual(0);
    });

    it('fallback dashboard has all three flow stages populated', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchComprasDashboard();

      expect(result.solicitacoes.length).toBeGreaterThan(0);
      expect(result.cotacoes.length).toBeGreaterThan(0);
      expect(result.pedidos.length).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeComprasDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeComprasDashboardData', () => {
    it('returns safe defaults for null payload', () => {
      const result = normalizeComprasDashboardData(null);

      expect(result.solicitacoes).toEqual([]);
      expect(result.cotacoes).toEqual([]);
      expect(result.pedidos).toEqual([]);
      expect(result.kpis.totalSolicitacoes).toBe(0);
      expect(result.kpis.valorComprometido).toBe(0);
      expect(result.resumoCards).toEqual([]);
      expect(result.statusResumo).toEqual([]);
    });

    it('returns safe defaults for undefined payload', () => {
      const result = normalizeComprasDashboardData(undefined);

      expect(result.solicitacoes).toEqual([]);
      expect(result.kpis.pedidosEmitidos).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeComprasDashboardData({
        kpis: {
          totalSolicitacoes: 5,
          solicitacoesPendentes: 2,
          cotacoesEmAberto: 1,
          pedidosEmitidos: 3,
          valorComprometido: 50000,
          valorAguardandoFiscal: 20000,
        },
      });

      expect(result.solicitacoes).toEqual([]);
      expect(result.cotacoes).toEqual([]);
      expect(result.pedidos).toEqual([]);
      expect(result.kpis.totalSolicitacoes).toBe(5);
      expect(result.kpis.valorComprometido).toBe(50000);
    });

    it('normalizes partial payload — kpis missing', () => {
      const result = normalizeComprasDashboardData({
        solicitacoes: mockSolicitacoesCompra,
        cotacoes: mockCotacoesCompra,
        pedidos: mockPedidosCompra,
      });

      expect(result.solicitacoes.length).toBeGreaterThan(0);
      expect(result.kpis.totalSolicitacoes).toBe(0);
      expect(result.kpis.valorComprometido).toBe(0);
    });

    it('normalizes valid complete payload', () => {
      const payload = {
        solicitacoes: mockSolicitacoesCompra,
        cotacoes: mockCotacoesCompra,
        pedidos: mockPedidosCompra,
        kpis: {
          totalSolicitacoes: 4,
          solicitacoesPendentes: 1,
          cotacoesEmAberto: 2,
          pedidosEmitidos: 2,
          valorComprometido: 250000,
          valorAguardandoFiscal: 100000,
        },
        resumoCards: [{ id: 'rc-1', titulo: 'Resumo', descricao: 'Desc', itens: [] }],
        statusResumo: [],
      };

      const result = normalizeComprasDashboardData(payload);

      expect(result.solicitacoes).toHaveLength(mockSolicitacoesCompra.length);
      expect(result.kpis.totalSolicitacoes).toBe(4);
      expect(result.resumoCards).toHaveLength(1);
    });

    it('normalizes non-array lists to empty arrays', () => {
      const result = normalizeComprasDashboardData({
        solicitacoes: 'not-an-array' as never,
        cotacoes: null as never,
        pedidos: undefined as never,
      });

      expect(result.solicitacoes).toEqual([]);
      expect(result.cotacoes).toEqual([]);
      expect(result.pedidos).toEqual([]);
    });

    it('merges partial kpis with defaults', () => {
      const result = normalizeComprasDashboardData({
        kpis: { totalSolicitacoes: 10 } as never,
      });

      expect(result.kpis.totalSolicitacoes).toBe(10);
      expect(result.kpis.solicitacoesPendentes).toBe(0);
      expect(result.kpis.valorAguardandoFiscal).toBe(0);
    });
  });
});
