import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import { fetchFinanceiroDashboard, fetchFinanceiroPessoal, normalizeFinanceiroDashboardData } from './financeiro.service';
import { getMockFinanceiroDashboard, getMockFinanceiroPessoal } from '../data/financeiro.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return {
    ...actual,
    api: {
      get: vi.fn(),
    },
  };
});

describe('FinanceiroService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchFinanceiroDashboard', () => {
    it('should fetch dashboard from API when successful', async () => {
      const mockDashboard = getMockFinanceiroDashboard({});
      (api.get as any).mockResolvedValueOnce({ data: { data: mockDashboard } });

      const result = await fetchFinanceiroDashboard();

      expect(api.get).toHaveBeenCalledWith('/financeiro/dashboard', { params: undefined });
      expect(result.kpis).toBeDefined();
    });

    it('should fallback to mock when API fails with server error', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      (api.get as any).mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroDashboard();

      expect(api.get).toHaveBeenCalled();
      expect(result.kpis).toBeDefined();
    });
  });

  describe('fetchFinanceiroPessoal', () => {
    it('should fetch personnel costs from API when successful', async () => {
      const mockPessoal = getMockFinanceiroPessoal({});
      (api.get as any).mockResolvedValueOnce({ data: { data: mockPessoal } });

      const result = await fetchFinanceiroPessoal();

      expect(api.get).toHaveBeenCalledWith('/financeiro/pessoal', { params: undefined });
      expect(result.competencia).toBeDefined();
    });

    it('should fallback to mock when API fails with timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      (api.get as any).mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroPessoal();

      expect(api.get).toHaveBeenCalled();
      expect(result.competencia).toBeDefined();
    });
  });

  describe('normalizeFinanceiroDashboardData', () => {
    it('should return empty structure when payload is null', () => {
      const result = normalizeFinanceiroDashboardData(null);
      expect(result.titulos).toEqual([]);
      expect(result.pessoal.competencia.competencia).toBe('');
    });

    it('should normalize partial personnel data', () => {
      const partial = {
        pessoal: {
          competencia: { competencia: '2026-03' }
        }
      };
      const result = normalizeFinanceiroDashboardData(partial as any);
      expect(result.pessoal.competencia.competencia).toBe('2026-03');
      expect(result.pessoal.porObra).toEqual([]);
    });
  });
});
