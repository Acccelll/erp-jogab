import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchRelatoriosDashboard,
  fetchRelatorioCategoria,
  normalizeRelatoriosDashboardData,
  normalizeRelatorioCategoriaData,
  RELATORIOS_API_ENDPOINTS,
} from './relatorios.service';
import { getMockRelatoriosDashboard, getMockRelatorioCategoria } from '../data/relatorios.mock';
import type { RelatorioCategoria } from '../types';

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

describe('RelatoriosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchRelatoriosDashboard
  // ---------------------------------------------------------------------------
  describe('fetchRelatoriosDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockRelatoriosDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchRelatoriosDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(RELATORIOS_API_ENDPOINTS.dashboard, { params: undefined });
      expect(Array.isArray(result.itens)).toBe(true);
      expect(result.resumo).toBeDefined();
    });

    it('passes filters as query params', async () => {
      const mockData = getMockRelatoriosDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { categoria: 'obras' as RelatorioCategoria };

      await fetchRelatoriosDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith(RELATORIOS_API_ENDPOINTS.dashboard, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatoriosDashboard();

      expect(Array.isArray(result.itens)).toBe(true);
      expect(result.resumo).toBeDefined();
    });

    it('falls back to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatoriosDashboard();

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on HTTP 504', async () => {
      const axiosError = { isAxiosError: true, response: { status: 504, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatoriosDashboard();

      expect(result.resumo).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatoriosDashboard();

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchRelatoriosDashboard();

      expect(Array.isArray(result.itens)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchRelatorioCategoria
  // ---------------------------------------------------------------------------
  describe('fetchRelatorioCategoria', () => {
    const categoria: RelatorioCategoria = 'obras';

    it('fetches categoria from API when successful', async () => {
      const mockData = getMockRelatorioCategoria(categoria);
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchRelatorioCategoria(categoria);

      expect(mockApiGet).toHaveBeenCalledWith(RELATORIOS_API_ENDPOINTS.categoria(categoria), { params: undefined });
      expect(result.categoria).toBe(categoria);
      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('passes filters as query params', async () => {
      const mockData = getMockRelatorioCategoria(categoria);
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { search: 'pavimento' };

      await fetchRelatorioCategoria(categoria, filters);

      expect(mockApiGet).toHaveBeenCalledWith(RELATORIOS_API_ENDPOINTS.categoria(categoria), { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatorioCategoria(categoria);

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatorioCategoria(categoria);

      expect(result.categoria).toBe(categoria);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchRelatorioCategoria(categoria);

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchRelatorioCategoria(categoria);

      expect(Array.isArray(result.itens)).toBe(true);
    });

    it('works for rh categoria', async () => {
      const cat: RelatorioCategoria = 'rh';
      const mockData = getMockRelatorioCategoria(cat);
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchRelatorioCategoria(cat);

      expect(result.categoria).toBe(cat);
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeRelatoriosDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeRelatoriosDashboardData', () => {
    it('returns defaults for null input', () => {
      const result = normalizeRelatoriosDashboardData(null);

      expect(result.itens).toEqual([]);
      expect(result.categorias).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.saidasOperacionais).toEqual([]);
      expect(result.coberturaModulos).toEqual([]);
      expect(result.resumo.totalRelatorios).toBe(0);
      expect(result.resumo.categoriasAtivas).toBe(0);
    });

    it('returns defaults for undefined input', () => {
      const result = normalizeRelatoriosDashboardData(undefined);

      expect(result.itens).toEqual([]);
      expect(result.resumo.disponiveis).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeRelatoriosDashboardData({
        resumo: { totalRelatorios: 12, categoriasAtivas: 5, disponiveis: 8, planejados: 4, exportaveis: 6 },
      });

      expect(result.itens).toEqual([]);
      expect(result.categorias).toEqual([]);
      expect(result.resumo.totalRelatorios).toBe(12);
      expect(result.resumo.categoriasAtivas).toBe(5);
    });

    it('normalizes partial payload — resumo missing', () => {
      const mockData = getMockRelatoriosDashboard();
      const result = normalizeRelatoriosDashboardData({ itens: mockData.itens });

      expect(result.itens.length).toBeGreaterThan(0);
      expect(result.resumo.totalRelatorios).toBe(0);
      expect(result.resumo.exportaveis).toBe(0);
    });

    it('merges partial resumo with defaults', () => {
      const result = normalizeRelatoriosDashboardData({
        resumo: { totalRelatorios: 15 } as never,
      });

      expect(result.resumo.totalRelatorios).toBe(15);
      expect(result.resumo.categoriasAtivas).toBe(0);
      expect(result.resumo.exportaveis).toBe(0);
    });

    it('normalizes non-array itens to empty array', () => {
      const result = normalizeRelatoriosDashboardData({
        itens: 'not-an-array' as never,
      });

      expect(result.itens).toEqual([]);
    });

    it('preserves valid complete payload', () => {
      const payload = getMockRelatoriosDashboard();
      const result = normalizeRelatoriosDashboardData(payload);

      expect(result.itens.length).toBeGreaterThan(0);
      expect(result.resumo).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeRelatorioCategoriaData
  // ---------------------------------------------------------------------------
  describe('normalizeRelatorioCategoriaData', () => {
    const categoria: RelatorioCategoria = 'compras';

    it('returns defaults for null input, using fallback categoria', () => {
      const result = normalizeRelatorioCategoriaData(null, categoria);

      expect(result.categoria).toBe(categoria);
      expect(result.itens).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.saidasOperacionais).toEqual([]);
      expect(result.coberturaModulos).toEqual([]);
    });

    it('returns defaults for undefined input', () => {
      const result = normalizeRelatorioCategoriaData(undefined, categoria);

      expect(result.categoria).toBe(categoria);
      expect(result.itens).toEqual([]);
    });

    it('uses payload categoria when present', () => {
      const mockData = getMockRelatorioCategoria(categoria);
      const result = normalizeRelatorioCategoriaData(mockData, categoria);

      expect(result.categoria).toBe(categoria);
    });

    it('falls back to argument categoria when payload.categoria is missing', () => {
      const result = normalizeRelatorioCategoriaData({ itens: [] }, categoria);

      expect(result.categoria).toBe(categoria);
    });

    it('normalizes non-array itens to empty array', () => {
      const result = normalizeRelatorioCategoriaData({ itens: 'wrong' as never }, categoria);

      expect(result.itens).toEqual([]);
    });

    it('preserves valid payload', () => {
      const mockData = getMockRelatorioCategoria(categoria);
      const result = normalizeRelatorioCategoriaData(mockData, categoria);

      expect(result.itens.length).toBeGreaterThan(0);
    });
  });
});
