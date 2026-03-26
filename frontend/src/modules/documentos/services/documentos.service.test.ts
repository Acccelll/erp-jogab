import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/shared/lib/api';
import {
  fetchDocumentosDashboard,
  fetchDocumentoById,
  uploadDocumento,
  updateDocumento,
  normalizeDocumentosDashboardData,
  DOCUMENTOS_API_ENDPOINTS,
} from './documentos.service';
import { getMockDocumentosDashboard, getMockDocumentos } from '../data/documentos.mock';

vi.mock('@/shared/lib/api', async () => {
  const actual = await vi.importActual('@/shared/lib/api');
  return { ...actual, api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } };
});

const mockApiGet = vi.mocked(api.get);
const mockApiPost = vi.mocked(api.post);
const mockApiPut = vi.mocked(api.put);

describe('DocumentosService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------------------------------------------------------------------------
  // fetchDocumentosDashboard
  // ---------------------------------------------------------------------------
  describe('fetchDocumentosDashboard', () => {
    it('fetches dashboard from API when successful', async () => {
      const mockData = getMockDocumentosDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await fetchDocumentosDashboard();

      expect(mockApiGet).toHaveBeenCalledWith(DOCUMENTOS_API_ENDPOINTS.dashboard, { params: undefined });
      expect(Array.isArray(result.documentos)).toBe(true);
      expect(result.kpis).toBeDefined();
    });

    it('passes filters as query params', async () => {
      const mockData = getMockDocumentosDashboard();
      mockApiGet.mockResolvedValueOnce({ data: { data: mockData } });
      const filters = { search: 'alvará' };

      await fetchDocumentosDashboard(filters);

      expect(mockApiGet).toHaveBeenCalledWith(DOCUMENTOS_API_ENDPOINTS.dashboard, { params: filters });
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchDocumentosDashboard();

      expect(result.kpis).toBeDefined();
      expect(Array.isArray(result.documentos)).toBe(true);
    });

    it('falls back to mock on HTTP 502', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 502, data: {} } });

      const result = await fetchDocumentosDashboard();

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchDocumentosDashboard();

      expect(Array.isArray(result.documentos)).toBe(true);
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await fetchDocumentosDashboard();

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // fetchDocumentoById
  // ---------------------------------------------------------------------------
  describe('fetchDocumentoById', () => {
    const docId = getMockDocumentos()[0].id;

    it('fetches documento detail from API when successful', async () => {
      const mockDetail = { documento: { id: docId }, integracoes: [], historico: [], observacoes: [] };
      mockApiGet.mockResolvedValueOnce({ data: { data: mockDetail } });

      const result = await fetchDocumentoById(docId);

      expect(mockApiGet).toHaveBeenCalledWith(DOCUMENTOS_API_ENDPOINTS.detail(docId));
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await fetchDocumentoById(docId);

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiGet.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await fetchDocumentoById(docId);

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // uploadDocumento
  // ---------------------------------------------------------------------------
  describe('uploadDocumento', () => {
    const payload = {
      titulo: 'Alvará de Construção',
      tipo: 'alvara' as const,
      entidade: 'obra' as const,
      entidadeId: 'obra-001',
      entidadeNome: 'OBR-001 — Edifício Central',
      responsavelNome: 'João Silva',
      file: new File(['content'], 'alvara.pdf', { type: 'application/pdf' }),
    };

    it('uploads documento to API when successful', async () => {
      const mockDoc = { id: 'doc-new-001', titulo: payload.titulo, tipo: payload.tipo };
      mockApiPost.mockResolvedValueOnce({ data: { data: mockDoc } });

      const result = await uploadDocumento(payload);

      expect(mockApiPost).toHaveBeenCalledWith(
        DOCUMENTOS_API_ENDPOINTS.upload,
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }),
      );
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await uploadDocumento(payload);

      expect(result).toBeDefined();
      expect(result.titulo).toBe(payload.titulo);
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await uploadDocumento(payload);

      expect(result).toBeDefined();
    });

    it('falls back to mock on ERR_NETWORK', async () => {
      mockApiPost.mockRejectedValueOnce({ isAxiosError: true, code: 'ERR_NETWORK' });

      const result = await uploadDocumento(payload);

      expect(result.tipo).toBe(payload.tipo);
    });
  });

  // ---------------------------------------------------------------------------
  // updateDocumento
  // ---------------------------------------------------------------------------
  describe('updateDocumento', () => {
    const docId = getMockDocumentos()[0].id;

    it('updates documento via API when successful', async () => {
      const mockDoc = { id: docId, titulo: 'Novo Título' };
      mockApiPut.mockResolvedValueOnce({ data: { data: mockDoc } });

      const result = await updateDocumento(docId, { titulo: 'Novo Título' });

      expect(mockApiPut).toHaveBeenCalledWith(DOCUMENTOS_API_ENDPOINTS.update(docId), { titulo: 'Novo Título' });
      expect(result).toBeDefined();
    });

    it('falls back to mock on HTTP 503', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, response: { status: 503, data: {} } });

      const result = await updateDocumento(docId, { titulo: 'Atualizado' });

      expect(result).toBeDefined();
    });

    it('falls back to mock on ECONNABORTED', async () => {
      mockApiPut.mockRejectedValueOnce({ isAxiosError: true, code: 'ECONNABORTED' });

      const result = await updateDocumento(docId, { responsavelNome: 'Maria' });

      expect(result).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeDocumentosDashboardData
  // ---------------------------------------------------------------------------
  describe('normalizeDocumentosDashboardData', () => {
    it('returns defaults for null', () => {
      const result = normalizeDocumentosDashboardData(null);

      expect(result.documentos).toEqual([]);
      expect(result.resumoCards).toEqual([]);
      expect(result.kpis.totalDocumentos).toBe(0);
      expect(result.kpis.vigentes).toBe(0);
    });

    it('returns defaults for undefined', () => {
      const result = normalizeDocumentosDashboardData(undefined);

      expect(result.documentos).toEqual([]);
      expect(result.kpis.aVencer).toBe(0);
    });

    it('normalizes partial payload — lists missing', () => {
      const result = normalizeDocumentosDashboardData({
        kpis: { totalDocumentos: 15, vigentes: 10, aVencer: 3, vencidos: 2, entidadesCobertas: 5, alertasCriticos: 2 },
      });

      expect(result.documentos).toEqual([]);
      expect(result.kpis.totalDocumentos).toBe(15);
      expect(result.kpis.vigentes).toBe(10);
    });

    it('normalizes partial kpis missing', () => {
      const mockData = getMockDocumentosDashboard();
      const result = normalizeDocumentosDashboardData({ documentos: mockData.documentos });

      expect(result.documentos.length).toBeGreaterThan(0);
      expect(result.kpis.totalDocumentos).toBe(0);
    });

    it('merges partial kpis with defaults', () => {
      const result = normalizeDocumentosDashboardData({ kpis: { totalDocumentos: 5 } as never });

      expect(result.kpis.totalDocumentos).toBe(5);
      expect(result.kpis.vencidos).toBe(0);
    });

    it('normalizes non-array documentos to empty array', () => {
      const result = normalizeDocumentosDashboardData({ documentos: 'wrong' as never });

      expect(result.documentos).toEqual([]);
    });

    it('preserves valid complete payload', () => {
      const payload = getMockDocumentosDashboard();
      const result = normalizeDocumentosDashboardData(payload);

      expect(result.documentos.length).toBeGreaterThan(0);
      expect(result.kpis).toBeDefined();
    });
  });
});
