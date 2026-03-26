import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchEstoqueDashboard,
  fetchMovimentacoesEstoque,
  fetchItemEstoqueById,
  normalizeEstoqueDashboardData,
  ESTOQUE_API_ENDPOINTS,
} from './estoque.service';
import { getMockEstoqueDashboard, getMockMovimentacoesEstoque } from '../data/estoque.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return { ...actual, api: { get: vi.fn() } };
});

const mockApiGet = vi.mocked(api.get);

describe('EstoqueService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------------------------------------------------------------------------
  // fetchEstoqueDashboard
  // ---------------------------------------------------------------------------
  describe('fetchEstoqueDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockEstoqueDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchEstoqueDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(ESTOQUE_API_ENDPOINTS.dashboard, { params: undefined });
      expect(Array.isArray(result.itens)).toBe(true);
      expect(result.kpis).toBeDefined();
    });

    it('passes filters as query params', async () => {
      const mockData = getMockEstoqueDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { search: 'cimento' };

      await fetchEstoqueDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith(ESTOQUE_API_ENDPOINTS.dashboard, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchEstoqueDashboard();

      expect(result.kpis).toBeDefined();
      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on HTTP 502', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await fetchEstoqueDashboard();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchEstoqueDashboard();

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await fetchEstoqueDashboard();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchMovimentacoesEstoque
  // ---------------------------------------------------------------------------
  describe('fetchMovimentacoesEstoque', () => {
    it('fetches movimentacoes from API when successful', async () => {
      const mockData = getMockMovimentacoesEstoque();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchMovimentacoesEstoque();

      expect(mockApiGet).toHaveBeenCalledWith(ESTOQUE_API_ENDPOINTS.movimentacoes, { params: undefined });
      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchMovimentacoesEstoque();

      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchMovimentacoesEstoque();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchItemEstoqueById
  // ---------------------------------------------------------------------------
  describe('fetchItemEstoqueById', () => {
    const realItemId = 'item-001';

    it('fetches item by id from API when successful', async () => {
      const mockItem = { id: realItemId, codigo: 'MAT-CIM-001' };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockItem } });

      const result = await fetchItemEstoqueById(realItemId);

      expect(mockApiGet).toHaveBeenCalledWith(ESTOQUE_API_ENDPOINTS.itemDetail(realItemId));
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 502', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await fetchItemEstoqueById(realItemId);

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchItemEstoqueById(realItemId);

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeEstoqueDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeEstoqueDashboardData', () => {
    it('returns defaults for null', () => {
      const result = normalizeEstoqueDashboardData(null);

      expect(result.itens).toEqual([]);
      expect(result.movimentacoes).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.kpis.totalItens).toBe(0);
      expect(result.kpis.valorEstocado).toBe(0);
    });

    it('returns defaults for undefined', () => {
      const result = normalizeEstoqueDashboardData(undefined);

      expect(result.itens).toEqual([]);
      expect(result.kpis.itensCriticos).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeEstoqueDashboardData({
        kpis: {
          totalItens: 50,
          itensCriticos: 3,
          locaisAtivos: 2,
          valorEstocado: 500000,
          valorReservado: 10000,
          consumoMensal: 20000,
          entradasPendentes: 1,
        },
      });

      expect(result.itens).toEqual([]);
      expect(result.kpis.totalItens).toBe(50);
      expect(result.kpis.valorEstocado).toBe(500000);
    });

    it('normalizes partial payload — kpis missing', () => {
      const mockData = getMockEstoqueDashboard();
      const result = normalizeEstoqueDashboardData({ itens: mockData.itens });

      expect(result.itens.length).toBeGreaterThan(0);
      expect(result.kpis.totalItens).toBe(0);
    });

    it('merges partial kpis with defaults', () => {
      const result = normalizeEstoqueDashboardData({ kpis: { totalItens: 10 } as never });

      expect(result.kpis.totalItens).toBe(10);
      expect(result.kpis.itensCriticos).toBe(0);
    });

    it('normalizes non-array itens to empty array', () => {
      const result = normalizeEstoqueDashboardData({ itens: 'wrong' as never });

      expect(result.itens).toEqual([]);
    });

    it('preserves valid complete payload', () => {
      const payload = getMockEstoqueDashboard();
      const result = normalizeEstoqueDashboardData(payload);

      expect(result.itens.length).toBeGreaterThan(0);
      expect(result.kpis).toBeDefined();
    });
  });
});
