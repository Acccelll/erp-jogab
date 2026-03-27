import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchFiscalDashboard,
  fetchFiscalEntradas,
  fetchFiscalSaidas,
  fetchDocumentoFiscalById,
  normalizeFiscalDashboardData,
  createDocumentoFiscal,
  updateDocumentoFiscal,
  FISCAL_API_ENDPOINTS,
} from './fiscal.service';
import { fiscalDocumentos, getMockFiscalDashboard, getMockDocumentoFiscalById } from '../data/fiscal.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return {
    ...actual,
    api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
  };
});

const mockApiGet = vi.mocked(api.get);
const mockApiPost = vi.mocked(api.post);
const mockApiPut = vi.mocked(api.put);

describe('FiscalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchFiscalDashboard
  // ---------------------------------------------------------------------------
  describe('fetchFiscalDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockFiscalDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchFiscalDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.dashboard, { params: undefined });
      expect(Array.isArray(result.documentos)).toBe(true);
    });

    it('passes filters as query params', async () => {
      const mockData = getMockFiscalDashboard({ tipoOperacao: 'entrada' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { tipoOperacao: 'entrada' as const };

      await fetchFiscalDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.dashboard, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalDashboard();

      expect(Array.isArray(result.documentos)).toBe(true);
      expect(result.kpis).toBeDefined();
    });

    it('falls back to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalDashboard();

      expect(Array.isArray(result.documentos)).toBe(true);
    });

    it('falls back to mock on HTTP 504', async () => {
      const axiosError = { isAxiosError: true, response: { status: 504, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalDashboard();

      expect(result.kpis).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED timeout', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalDashboard();

      expect(Array.isArray(result.documentos)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchFiscalDashboard();

      expect(Array.isArray(result.documentos)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // fetchFiscalEntradas
  // ---------------------------------------------------------------------------
  describe('fetchFiscalEntradas', () => {
    it('fetches entradas from API when successful', async () => {
      const mockData = getMockFiscalDashboard({ tipoOperacao: 'entrada' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchFiscalEntradas();

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.entradas, { params: undefined });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalEntradas();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalEntradas();

      expect(result).toBeDefined();
    });

    it('passes filters correctly', async () => {
      const mockData = getMockFiscalDashboard({ tipoOperacao: 'entrada' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { tipoOperacao: 'entrada' as const };

      await fetchFiscalEntradas(filters);

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.entradas, { params: filters });
    });
  });

  // ---------------------------------------------------------------------------
  // fetchFiscalSaidas
  // ---------------------------------------------------------------------------
  describe('fetchFiscalSaidas', () => {
    it('fetches saidas from API when successful', async () => {
      const mockData = getMockFiscalDashboard({ tipoOperacao: 'saida' });
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchFiscalSaidas();

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.saidas, { params: undefined });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      const axiosError = { isAxiosError: true, response: { status: 503, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchFiscalSaidas();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      const networkError = { isAxiosError: true, code: 'ERR_NETWORK' };
      mockApiGet.mockRejectedValueOnce(networkError);

      const result = await fetchFiscalSaidas();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchDocumentoFiscalById
  // ---------------------------------------------------------------------------
  describe('fetchDocumentoFiscalById', () => {
    const docId = fiscalDocumentos[0].id;

    it('fetches documento by id from API when successful', async () => {
      const mockDoc = { id: docId, codigo: 'FIS-2026-001', status: 'em_validacao' };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDoc } });

      const result = await fetchDocumentoFiscalById(docId);

      expect(mockApiGet).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.documentoDetail(docId));
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 502', async () => {
      const axiosError = { isAxiosError: true, response: { status: 502, data: {} } };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchDocumentoFiscalById(docId);

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      const axiosError = { isAxiosError: true, code: 'ECONNABORTED' };
      mockApiGet.mockRejectedValueOnce(axiosError);

      const result = await fetchDocumentoFiscalById(docId);

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeFiscalDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeFiscalDashboardData', () => {
    it('returns defaults for null input', () => {
      const result = normalizeFiscalDashboardData(null);

      expect(result.documentos).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.statusResumo).toEqual([]);
      expect(result.kpis.totalDocumentos).toBe(0);
      expect(result.kpis.totalEntradas).toBe(0);
      expect(result.kpis.valorEntradas).toBe(0);
    });

    it('returns defaults for undefined input', () => {
      const result = normalizeFiscalDashboardData(undefined);

      expect(result.documentos).toEqual([]);
      expect(result.kpis.totalSaidas).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeFiscalDashboardData({
        kpis: {
          totalDocumentos: 10,
          totalEntradas: 5,
          totalSaidas: 5,
          valorEntradas: 100000,
          valorSaidas: 80000,
          validando: 2,
          comErro: 1,
        },
      });

      expect(result.documentos).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.statusResumo).toEqual([]);
      expect(result.kpis.totalDocumentos).toBe(10);
      expect(result.kpis.valorEntradas).toBe(100000);
    });

    it('normalizes partial payload — kpis missing', () => {
      const result = normalizeFiscalDashboardData({ documentos: fiscalDocumentos });

      expect(result.documentos.length).toBeGreaterThan(0);
      expect(result.kpis.totalDocumentos).toBe(0);
      expect(result.kpis.valorSaidas).toBe(0);
    });

    it('merges partial kpis with defaults', () => {
      const result = normalizeFiscalDashboardData({
        kpis: { totalDocumentos: 7 } as never,
      });

      expect(result.kpis.totalDocumentos).toBe(7);
      expect(result.kpis.totalEntradas).toBe(0);
      expect(result.kpis.comErro).toBe(0);
    });

    it('normalizes non-array documentos to empty array', () => {
      const result = normalizeFiscalDashboardData({
        documentos: 'not-an-array' as never,
      });

      expect(result.documentos).toEqual([]);
    });

    it('preserves valid complete payload', () => {
      const payload = getMockFiscalDashboard();

      const result = normalizeFiscalDashboardData(payload);

      expect(result.documentos.length).toBeGreaterThan(0);
      expect(result.kpis.totalDocumentos).toBeGreaterThanOrEqual(0);
    });
  });

  // ---------------------------------------------------------------------------
  // createDocumentoFiscal (Phase 12 mutation)
  // ---------------------------------------------------------------------------
  describe('createDocumentoFiscal', () => {
    const payload = {
      numero: '001234',
      serie: '1',
      tipoOperacao: 'entrada' as const,
      documentoTipo: 'nfe' as const,
      emitenteNome: 'Fornecedor XPTO',
      destinatarioNome: 'JOGAB Construções',
      obraId: 'obra-001',
      competencia: '2026-03',
      emissao: '2026-03-20',
      valorDocumento: 25000,
    };

    it('should call POST /fiscal/documentos with payload', async () => {
      const created = { ...fiscalDocumentos[0], numero: payload.numero };
      mockApiPost.mockResolvedValueOnce({ data: { data: created } });

      const result = await createDocumentoFiscal(payload);

      expect(mockApiPost).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.documentos, payload);
      expect(result.id).toBeDefined();
    });

    it('should fallback to mock on HTTP 503 and return valid shape', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await createDocumentoFiscal(payload);

      expect(result.id).toBeDefined();
      expect(result.numero).toBe(payload.numero);
      expect(result.tipoOperacao).toBe(payload.tipoOperacao);
      expect(result.valorDocumento).toBe(payload.valorDocumento);
    });

    it('should fallback to mock on network error', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await createDocumentoFiscal(payload);

      expect(result.impostos).toBeDefined();
      expect(result.vinculos).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // updateDocumentoFiscal (Phase 12 mutation)
  // ---------------------------------------------------------------------------
  describe('updateDocumentoFiscal', () => {
    it('should call PUT /fiscal/documentos/:id with payload', async () => {
      const updated = { ...fiscalDocumentos[0] };
      mockApiPut.mockResolvedValueOnce({ data: { data: updated } });

      const result = await updateDocumentoFiscal('doc-001', { status: 'validado' as const });

      expect(mockApiPut).toHaveBeenCalledWith(FISCAL_API_ENDPOINTS.documentoDetail('doc-001'), { status: 'validado' });
      expect(result.id).toBeDefined();
    });

    it('should fallback to mock on HTTP 502', async () => {
      const detail = getMockDocumentoFiscalById('doc-fis-001');
      mockApiGet.mockResolvedValueOnce({ data: { data: detail } });
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await updateDocumentoFiscal('doc-001', { observacao: 'Revisado' });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });
});
