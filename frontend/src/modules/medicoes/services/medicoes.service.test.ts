import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchMedicoesDashboard,
  fetchMedicoes,
  fetchMedicaoById,
  normalizeMedicoesDashboardData,
  createMedicao,
  updateMedicao,
  aprovarMedicao,
  MEDICOES_API_ENDPOINTS,
} from './medicoes.service';
import { getMockMedicoesDashboard, getMockMedicoes, getMockMedicaoById } from '../data/medicoes.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return { ...actual, api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } };
});

const mockApiGet = vi.mocked(api.get);
const mockApiPost = vi.mocked(api.post);
const mockApiPut = vi.mocked(api.put);

describe('MedicoesService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------------------------------------------------------------------------
  // fetchMedicoesDashboard
  // ---------------------------------------------------------------------------
  describe('fetchMedicoesDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockMedicoesDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchMedicoesDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.dashboard, { params: undefined });
      expect(Array.isArray(result.medicoes)).toBe(true);
      expect(result.kpis).toBeDefined();
    });

    it('passes filters as query params', async () => {
      const mockData = getMockMedicoesDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { search: 'pavimento' };

      await fetchMedicoesDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.dashboard, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchMedicoesDashboard();

      expect(result.kpis).toBeDefined();
      expect(Array.isArray(result.medicoes)).toBe(true);
    });

    it('falls back to mock on HTTP 502', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await fetchMedicoesDashboard();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchMedicoesDashboard();

      expect(Array.isArray(result.medicoes)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await fetchMedicoesDashboard();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchMedicoes
  // ---------------------------------------------------------------------------
  describe('fetchMedicoes', () => {
    it('fetches medicoes list from API when successful', async () => {
      const mockData = getMockMedicoes();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchMedicoes();

      expect(mockApiGet).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.list, { params: undefined });
      expect(Array.isArray(result)).toBe(true);
    });

    it('passes filters correctly', async () => {
      const mockData = getMockMedicoes();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { status: 'aprovada' as const };

      await fetchMedicoes(filters);

      expect(mockApiGet).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.list, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchMedicoes();

      expect(Array.isArray(result)).toBe(true);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchMedicoes();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchMedicaoById
  // ---------------------------------------------------------------------------
  describe('fetchMedicaoById', () => {
    it('fetches medicao detail from API when successful', async () => {
      const mockDetail = { medicao: { id: 'med-001' }, itens: [] };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDetail } });

      const result = await fetchMedicaoById('med-001');

      expect(mockApiGet).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.detail('med-001'));
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchMedicaoById('med-001');

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchMedicaoById('med-001');

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeMedicoesDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeMedicoesDashboardData', () => {
    it('returns defaults for null', () => {
      const result = normalizeMedicoesDashboardData(null);

      expect(result.medicoes).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.kpis.totalMedicoes).toBe(0);
      expect(result.kpis.valorMedido).toBe(0);
    });

    it('returns defaults for undefined', () => {
      const result = normalizeMedicoesDashboardData(undefined);

      expect(result.medicoes).toEqual([]);
      expect(result.kpis.medicoesEmAprovacao).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeMedicoesDashboardData({
        kpis: {
          totalMedicoes: 20,
          medicoesEmAprovacao: 5,
          medicoesAprovadas: 15,
          valorMedido: 1000000,
          valorFaturado: 800000,
          valorReceber: 200000,
        },
      });

      expect(result.medicoes).toEqual([]);
      expect(result.kpis.totalMedicoes).toBe(20);
      expect(result.kpis.valorMedido).toBe(1000000);
    });

    it('normalizes partial payload — kpis missing', () => {
      const mockData = getMockMedicoesDashboard();
      const result = normalizeMedicoesDashboardData({ medicoes: mockData.medicoes });

      expect(result.medicoes.length).toBeGreaterThan(0);
      expect(result.kpis.totalMedicoes).toBe(0);
    });

    it('merges partial kpis with defaults', () => {
      const result = normalizeMedicoesDashboardData({ kpis: { totalMedicoes: 8 } as never });

      expect(result.kpis.totalMedicoes).toBe(8);
      expect(result.kpis.valorFaturado).toBe(0);
    });

    it('normalizes non-array medicoes to empty array', () => {
      const result = normalizeMedicoesDashboardData({ medicoes: 'wrong' as never });

      expect(result.medicoes).toEqual([]);
    });

    it('preserves valid complete payload', () => {
      const payload = getMockMedicoesDashboard();
      const result = normalizeMedicoesDashboardData(payload);

      expect(result.medicoes.length).toBeGreaterThan(0);
      expect(result.kpis).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // createMedicao (Phase 12 mutation)
  // ---------------------------------------------------------------------------
  describe('createMedicao', () => {
    const payload = {
      obraId: 'obra-001',
      contratoId: 'contrato-001',
      clienteNome: 'Cliente XPTO',
      competencia: '2026-03',
      periodoInicio: '2026-03-01',
      periodoFim: '2026-03-31',
      percentualAvanco: 25,
      valorContrato: 500000,
      centroCusto: 'CC-001',
      responsavelNome: 'Responsável',
    };

    it('should call POST /medicoes with payload', async () => {
      const medicoes = getMockMedicoes();
      const created = { ...medicoes[0], ...payload };
      mockApiPost.mockResolvedValueOnce({ data: { data: created } });

      const result = await createMedicao(payload);

      expect(mockApiPost).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.list, payload);
      expect(result.id).toBeDefined();
    });

    it('should fallback to mock on HTTP 503 and return valid shape', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await createMedicao(payload);

      expect(result.id).toBeDefined();
      expect(result.status).toBe('rascunho');
      expect(result.obraId).toBe(payload.obraId);
    });

    it('should fallback to mock on network error', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await createMedicao(payload);

      expect(result.id).toBeDefined();
      expect(result.competencia).toBe(payload.competencia);
    });
  });

  // ---------------------------------------------------------------------------
  // updateMedicao (Phase 12 mutation)
  // ---------------------------------------------------------------------------
  describe('updateMedicao', () => {
    it('should call PUT /medicoes/:id with payload', async () => {
      const medicoes = getMockMedicoes();
      mockApiPut.mockResolvedValueOnce({ data: { data: medicoes[0] } });

      const result = await updateMedicao('med-001', { percentualAvanco: 50 });

      expect(mockApiPut).toHaveBeenCalledWith(MEDICOES_API_ENDPOINTS.detail('med-001'), {
        percentualAvanco: 50,
      });
      expect(result.id).toBeDefined();
    });

    it('should fallback to mock on HTTP 502', async () => {
      const detail = getMockMedicaoById('med-001');
      mockApiGet.mockResolvedValueOnce({ data: { data: detail } });
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await updateMedicao('med-001', { status: 'aprovada' as const });

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // aprovarMedicao (Phase 12 mutation)
  // ---------------------------------------------------------------------------
  describe('aprovarMedicao', () => {
    it('should call POST /medicoes/:id/aprovar with payload', async () => {
      const medicoes = getMockMedicoes();
      mockApiPost.mockResolvedValueOnce({ data: { data: medicoes[0] } });

      const result = await aprovarMedicao('med-001', { aprovadorNome: 'Gestor', observacao: 'Aprovado' });

      expect(mockApiPost).toHaveBeenCalledWith(`${MEDICOES_API_ENDPOINTS.detail('med-001')}/aprovar`, {
        aprovadorNome: 'Gestor',
        observacao: 'Aprovado',
      });
      expect(result.id).toBeDefined();
    });

    it('should fallback to mock on HTTP 503', async () => {
      const detail = getMockMedicaoById('med-001');
      mockApiGet.mockResolvedValueOnce({ data: { data: detail } });
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await aprovarMedicao('med-001', { aprovadorNome: 'Gestor' });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });
});
