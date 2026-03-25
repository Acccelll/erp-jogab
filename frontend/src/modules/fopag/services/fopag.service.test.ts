import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import { fetchFopagCompetencias, fetchFopagCompetenciaDetails, normalizeFopagCompetenciasResponse } from './fopag.service';
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

describe('FopagService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchFopagCompetencias', () => {
    it('should fetch competencies from API when successful', async () => {
      const mockData = { data: getFopagCompetenciasMock().slice(0, 1), kpis: { totalCompetencias: 1 } };
      (api.get as any).mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchFopagCompetencias();

      expect(api.get).toHaveBeenCalledWith('/fopag/competencias', { params: undefined });
      expect(result.data).toHaveLength(1);
      expect(result.kpis.totalCompetencias).toBe(1);
    });

    it('should fallback to mock when API fails', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      (api.get as any).mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetencias();

      expect(api.get).toHaveBeenCalled();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.kpis.totalCompetencias).toBeGreaterThan(0);
    });
  });

  describe('fetchFopagCompetenciaDetails', () => {
    it('should fetch competencia details from API when successful', async () => {
      const mockDetail = getFopagCompetenciaDetalheMock('2026-03');
      (api.get as any).mockResolvedValueOnce({ data: { data: mockDetail } });

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(api.get).toHaveBeenCalledWith('/fopag/competencias/2026-03');
      expect(result?.competencia.id).toBe('2026-03');
    });

    it('should fallback to mock when API fails', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      (api.get as any).mockRejectedValueOnce(axiosError);

      const result = await fetchFopagCompetenciaDetails('2026-03');

      expect(api.get).toHaveBeenCalled();
      expect(result?.competencia.id).toBe('2026-03');
    });
  });

  describe('normalizeFopagCompetenciasResponse', () => {
    it('should return default values when payload is empty', () => {
      const result = normalizeFopagCompetenciasResponse(null);
      expect(result.data).toEqual([]);
      expect(result.kpis.totalCompetencias).toBe(0);
    });

    it('should preserve valid data', () => {
      const mockPayload = {
        data: [{ id: '1' } as any],
        kpis: { totalCompetencias: 1, emConsolidacao: 0, prontasParaRateio: 0, valorPrevistoTotal: 100, valorRealizadoTotal: 80 }
      };
      const result = normalizeFopagCompetenciasResponse(mockPayload);
      expect(result.data).toHaveLength(1);
      expect(result.kpis.totalCompetencias).toBe(1);
      expect(result.kpis.valorPrevistoTotal).toBe(100);
    });
  });
});
