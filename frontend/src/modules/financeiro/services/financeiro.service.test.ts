import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchFinanceiroDashboard,
  fetchFinanceiroPessoal,
  fetchFluxoCaixa,
  fetchContasPagar,
  fetchContasReceber,
  fetchTituloFinanceiroById,
  normalizeFinanceiroDashboardData,
} from './financeiro.service';
import {
  getMockFinanceiroDashboard,
  getMockFinanceiroPessoal,
  getMockFluxoCaixa,
  getMockTitulosFinanceiros,
} from '../data/financeiro.mock';

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

describe('FinanceiroService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchFinanceiroDashboard
  // ---------------------------------------------------------------------------
  describe('fetchFinanceiroDashboard', () => {
    it('should fetch dashboard from API when successful', async () => {
      const mockDashboard = getMockFinanceiroDashboard({});
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDashboard } });

      const result = await fetchFinanceiroDashboard();

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/dashboard', { params: undefined });
      expect(result.kpis).toBeDefined();
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroDashboard();

      expect(mockApiGet).toHaveBeenCalled();
      expect(result.kpis).toBeDefined();
    });

    it('should fallback to mock on HTTP 504', async () => {
      const axiosError = { isAxiosError: true, response: { status: 504, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroDashboard();

      expect(result.titulos).toBeDefined();
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroDashboard();

      expect(result.kpis).toBeDefined();
    });

    it('mock dashboard pessoal has FOPAG-related fields', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroDashboard();

      expect(result.pessoal).toBeDefined();
      expect(result.pessoal.competencia).toBeDefined();
      expect(typeof result.pessoal.competencia.valorFopagPrevisto).toBe('number');
      expect(typeof result.pessoal.competencia.valorFopagRealizado).toBe('number');
    });
  });

  // ---------------------------------------------------------------------------
  // fetchFinanceiroPessoal
  // ---------------------------------------------------------------------------
  describe('fetchFinanceiroPessoal', () => {
    it('should fetch personnel costs from API when successful', async () => {
      const mockPessoal = getMockFinanceiroPessoal({});
      mockApiGet.mockResolvedValueOnce({ data: { data: mockPessoal } });

      const result = await fetchFinanceiroPessoal();

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/pessoal', { params: undefined });
      expect(result.competencia).toBeDefined();
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroPessoal();

      expect(mockApiGet).toHaveBeenCalled();
      expect(result.competencia).toBeDefined();
    });

    it('mock pessoal reflects HE integradas via FOPAG chain', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroPessoal();

      expect(result.competencia.valorHorasExtrasPrevisto).toBeGreaterThanOrEqual(0);
      expect(result.competencia.valorHorasExtrasRealizado).toBeGreaterThanOrEqual(0);
      expect(result.porObra).toBeDefined();
      expect(Array.isArray(result.porObra)).toBe(true);
    });

    it('pessoal valorFopagPrevisto >= 0 for active competencia', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFinanceiroPessoal();

      expect(result.competencia.valorFopagPrevisto).toBeGreaterThanOrEqual(0);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchFluxoCaixa
  // ---------------------------------------------------------------------------
  describe('fetchFluxoCaixa', () => {
    it('should fetch fluxo de caixa from API when successful', async () => {
      const mockFluxo = getMockFluxoCaixa({});
      mockApiGet.mockResolvedValueOnce({ data: { data: mockFluxo } });

      const result = await fetchFluxoCaixa();

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/fluxo-caixa', { params: undefined });
      expect(result).toBeDefined();
    });

    it('should fallback to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFluxoCaixa();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchContasPagar
  // ---------------------------------------------------------------------------
  describe('fetchContasPagar', () => {
    it('should fetch contas a pagar from API when successful', async () => {
      const mockTitulos = getMockTitulosFinanceiros({ tipo: 'pagar' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockTitulos } });

      const result = await fetchContasPagar();

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/contas-pagar', { params: undefined });
      expect(result).toBeDefined();
    });

    it('should fallback to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchContasPagar();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchContasReceber
  // ---------------------------------------------------------------------------
  describe('fetchContasReceber', () => {
    it('should fetch contas a receber from API when successful', async () => {
      const mockTitulos = getMockTitulosFinanceiros({ tipo: 'receber' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockTitulos } });

      const result = await fetchContasReceber();

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/contas-receber', { params: undefined });
      expect(result).toBeDefined();
    });

    it('should fallback to mock on timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchContasReceber();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchTituloFinanceiroById
  // ---------------------------------------------------------------------------
  describe('fetchTituloFinanceiroById', () => {
    it('should fetch titulo by id from API when successful', async () => {
      mockApiGet.mockResolvedValueOnce({ data: { data: { id: 'tit-001' } } });

      const result = await fetchTituloFinanceiroById('tit-001');

      expect(mockApiGet).toHaveBeenCalledWith('/financeiro/titulos/tit-001');
      expect(result).toBeDefined();
    });

    it('should fallback to mock on HTTP 503 with valid id', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      // Use a valid mock ID so fallback resolves with actual data
      const result = await fetchTituloFinanceiroById('tit-001');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('titulo');
      expect((result as { titulo: { id: string } }).titulo.id).toBe('tit-001');
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeFinanceiroDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeFinanceiroDashboardData', () => {
    it('should return empty structure when payload is null', () => {
      const result = normalizeFinanceiroDashboardData(null);
      expect(result.titulos).toEqual([]);
      expect(result.pessoal.competencia.competencia).toBe('');
      expect(result.kpis.totalTitulos).toBe(0);
    });

    it('should return empty structure when payload is undefined', () => {
      const result = normalizeFinanceiroDashboardData(undefined);
      expect(result.titulos).toEqual([]);
      expect(result.resumoCards).toEqual([]);
    });

    it('should normalize partial personnel data', () => {
      const partial = {
        pessoal: {
          competencia: { competencia: '2026-03' },
        },
      };
      const result = normalizeFinanceiroDashboardData(partial as never);
      expect(result.pessoal.competencia.competencia).toBe('2026-03');
      expect(result.pessoal.porObra).toEqual([]);
      expect(result.pessoal.porCentroCusto).toEqual([]);
      expect(result.pessoal.previstoRealizado).toEqual([]);
      expect(result.pessoal.destaques).toEqual([]);
    });

    it('should fill missing kpi fields with zeros', () => {
      const partial = { kpis: { totalTitulos: 10 } as never };
      const result = normalizeFinanceiroDashboardData(partial);
      expect(result.kpis.totalTitulos).toBe(10);
      expect(result.kpis.valorPagar).toBe(0);
      expect(result.kpis.saldoProjetado).toBe(0);
    });

    it('should handle non-array titulos gracefully', () => {
      const partial = { titulos: null as never };
      const result = normalizeFinanceiroDashboardData(partial);
      expect(result.titulos).toEqual([]);
    });

    it('pessoal competencia should reflect FOPAG values when provided', () => {
      const payload = {
        pessoal: {
          competencia: {
            competencia: '2026-03',
            valorFopagPrevisto: 1568200,
            valorFopagRealizado: 1494300,
            valorHorasExtrasPrevisto: 120000,
            valorHorasExtrasRealizado: 117935,
          },
        },
      };
      const result = normalizeFinanceiroDashboardData(payload as never);
      expect(result.pessoal.competencia.valorFopagPrevisto).toBe(1568200);
      expect(result.pessoal.competencia.valorHorasExtrasRealizado).toBe(117935);
    });
  });
});
