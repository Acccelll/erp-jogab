import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchFopagCompetencias,
  fetchFopagCompetenciaDetails,
  normalizeFopagCompetenciasResponse,
} from './fopag.service';
import { getFopagCompetenciasMock, getFopagCompetenciaDetalheMock } from '../data/fopag.mock';

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

describe('FopagService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchFopagCompetencias
  // ---------------------------------------------------------------------------
  describe('fetchFopagCompetencias', () => {
    it('should fetch competencies from API when successful', async () => {
      const mockData = { data: getFopagCompetenciasMock().slice(0, 1), kpis: { totalCompetencias: 1 } };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchFopagCompetencias();

      expect(mockApiGet).toHaveBeenCalledWith('/fopag/competencias', { params: undefined });
      expect(result.data).toHaveLength(1);
      expect(result.kpis.totalCompetencias).toBe(1);
    });

    it('should pass filters as query params', async () => {
      const mockData = { data: getFopagCompetenciasMock().slice(0, 2), kpis: { totalCompetencias: 2 } };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { status: 'aberta' as const, search: 'mar' };

      const result = await fetchFopagCompetencias(filters);

      expect(mockApiGet).toHaveBeenCalledWith('/fopag/competencias', { params: filters });
      expect(result.data).toHaveLength(2);
      expect(result.kpis.totalCompetencias).toBe(2);
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();

      expect(mockApiGet).toHaveBeenCalled();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.kpis.totalCompetencias).toBeGreaterThan(0);
    });

    it('should fallback to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();

      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should fallback to mock on timeout (ECONNABORTED)', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.kpis).toBeDefined();
    });

    it('should fallback to mock when API is unreachable (network error)', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchFopagCompetencias();

      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should normalize partial API payload missing kpis', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: { data: getFopagCompetenciasMock() } } });

      const result = await fetchFopagCompetencias();

      expect(result.kpis.totalCompetencias).toBe(0);
      expect(result.kpis.valorPrevistoTotal).toBe(0);
    });

    it('mock fallback includes valorHorasExtras from HE closed data', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();
      const comp2026_02 = result.data.find((c) => c.competencia === '2026-02');

      // competência 2026-02 is fechada_prevista — HE integradas devem alimentar valorHorasExtras
      expect(comp2026_02).toBeDefined();
      expect(comp2026_02!.valorHorasExtras).toBeGreaterThanOrEqual(0);
    });

    it('kpis reflect correct totals across all competencias', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();

      expect(result.kpis.valorPrevistoTotal).toBeGreaterThan(0);
      expect(result.kpis.valorRealizadoTotal).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchFopagCompetenciaDetails
  // ---------------------------------------------------------------------------
  describe('fetchFopagCompetenciaDetails', () => {
    it('should fetch competencia details from API when successful', async () => {
      const mockDetail = getFopagCompetenciaDetalheMock('2026-03');
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDetail } });

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(mockApiGet).toHaveBeenCalledWith('/fopag/competencias/2026-03');
      expect(result?.competencia.id).toBe('2026-03');
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(mockApiGet).toHaveBeenCalled();
      expect(result?.competencia.id).toBe('2026-03');
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('2026-02');

      expect(result?.competencia.id).toBe('2026-02');
    });

    it('should return null for unknown competencia in mock', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('9999-99');

      expect(result).toBeNull();
    });

    it('detail includes funcionarios array from HE snapshot', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(Array.isArray(result?.funcionarios)).toBe(true);
    });

    it('detail financeiro has valorHorasExtrasIntegradas >= 0', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(result?.financeiro.valorHorasExtrasIntegradas).toBeGreaterThanOrEqual(0);
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeFopagCompetenciasResponse
  // ---------------------------------------------------------------------------
  describe('normalizeFopagCompetenciasResponse', () => {
    it('should return default values when payload is null', () => {
      const result = normalizeFopagCompetenciasResponse(null);
      expect(result.data).toEqual([]);
      expect(result.kpis.totalCompetencias).toBe(0);
      expect(result.kpis.emConsolidacao).toBe(0);
      expect(result.kpis.prontasParaRateio).toBe(0);
      expect(result.kpis.valorPrevistoTotal).toBe(0);
      expect(result.kpis.valorRealizadoTotal).toBe(0);
    });

    it('should return default values when payload is undefined', () => {
      const result = normalizeFopagCompetenciasResponse(undefined);
      expect(result.data).toEqual([]);
      expect(result.kpis.totalCompetencias).toBe(0);
    });

    it('should return empty data when payload.data is not an array', () => {
      const result = normalizeFopagCompetenciasResponse({ data: null as never, kpis: undefined });
      expect(result.data).toEqual([]);
    });

    it('should preserve valid data', () => {
      const mockPayload = {
        data: [{ id: '1' } as never],
        kpis: {
          totalCompetencias: 1,
          emConsolidacao: 0,
          prontasParaRateio: 0,
          valorPrevistoTotal: 100,
          valorRealizadoTotal: 80,
        },
      };
      const result = normalizeFopagCompetenciasResponse(mockPayload);
      expect(result.data).toHaveLength(1);
      expect(result.kpis.totalCompetencias).toBe(1);
      expect(result.kpis.valorPrevistoTotal).toBe(100);
      expect(result.kpis.valorRealizadoTotal).toBe(80);
    });

    it('should fill missing kpi fields with zeros', () => {
      const partial = { data: [], kpis: { totalCompetencias: 5 } as never };
      const result = normalizeFopagCompetenciasResponse(partial);
      expect(result.kpis.totalCompetencias).toBe(5);
      expect(result.kpis.emConsolidacao).toBe(0);
      expect(result.kpis.valorPrevistoTotal).toBe(0);
    });
  });
});
