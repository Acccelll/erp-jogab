import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { documentosFiltersSchema } from '../types';
import type { Documento, DocumentosDashboardData, DocumentosFiltersData } from '../types';
import { getMockDocumentoById, getMockDocumentosDashboard } from '../data/documentos.mock';

export const DOCUMENTOS_API_ENDPOINTS = {
  dashboard: '/documentos/dashboard',
  detail: (id: string) => `/documentos/${id}`,
  upload: '/documentos/upload',
  update: (id: string) => `/documentos/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: DocumentosFiltersData) {
  return documentosFiltersSchema.parse(filters ?? {});
}

export function normalizeDocumentosDashboardData(
  payload: Partial<DocumentosDashboardData> | null | undefined,
): DocumentosDashboardData {
  const safe = payload ?? {};
  return {
    documentos: Array.isArray(safe.documentos) ? safe.documentos : [],
    kpis: {
      totalDocumentos: 0,
      vigentes: 0,
      aVencer: 0,
      vencidos: 0,
      entidadesCobertas: 0,
      alertasCriticos: 0,
      ...safe.kpis,
    },
    resumoCards: Array.isArray(safe.resumoCards) ? safe.resumoCards : [],
    statusResumo: Array.isArray(safe.statusResumo) ? safe.statusResumo : [],
    vencimentoResumo: Array.isArray(safe.vencimentoResumo) ? safe.vencimentoResumo : [],
  };
}

async function fetchDocumentosDashboardMock(filters?: DocumentosFiltersData) {
  await wait();
  return getMockDocumentosDashboard(normalizeFilters(filters));
}

async function fetchDocumentoByIdMock(documentoId: string) {
  await wait();
  const result = getMockDocumentoById(documentoId);

  if (!result) {
    throw new Error('Documento não encontrado.');
  }

  return result;
}

export async function fetchDocumentosDashboard(filters?: DocumentosFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(DOCUMENTOS_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchDocumentosDashboardMock>>>(response.data);
    },
    () => fetchDocumentosDashboardMock(filters),
  );
}

export async function fetchDocumentoById(documentoId: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(DOCUMENTOS_API_ENDPOINTS.detail(documentoId));
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchDocumentoByIdMock>>>(response.data);
    },
    () => fetchDocumentoByIdMock(documentoId),
  );
}

export interface UploadDocumentoPayload {
  titulo: string;
  tipo: Documento['tipo'];
  entidade: Documento['entidade'];
  entidadeId: string;
  entidadeNome: string;
  responsavelNome: string;
  obraId?: string;
  competencia?: string;
  dataVencimento?: string;
  file: File;
}

export interface UpdateDocumentoPayload {
  titulo?: string;
  responsavelNome?: string;
  dataVencimento?: string;
  obraId?: string;
  competencia?: string;
}

async function uploadDocumentoMock(payload: UploadDocumentoPayload): Promise<Documento> {
  await wait();
  return {
    id: `doc-mock-${Date.now()}`,
    codigo: `DOC-MOCK-${Date.now()}`,
    titulo: payload.titulo,
    tipo: payload.tipo,
    entidade: payload.entidade,
    status: 'vigente',
    entidadeId: payload.entidadeId,
    entidadeNome: payload.entidadeNome,
    responsavelNome: payload.responsavelNome,
    obraId: payload.obraId,
    versao: '1',
    vencimento: { alerta: 'sem_alerta' as const },
    ultimaAtualizacaoEm: new Date().toISOString(),
  };
}

async function updateDocumentoMock(documentoId: string, payload: UpdateDocumentoPayload): Promise<Documento> {
  await wait();
  const found = getMockDocumentoById(documentoId);
  if (!found) throw new Error('Documento não encontrado.');
  return { ...found.documento, ...payload };
}

export async function uploadDocumento(payload: UploadDocumentoPayload): Promise<Documento> {
  return withApiFallback(
    async () => {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('titulo', payload.titulo);
      formData.append('tipo', payload.tipo);
      formData.append('entidade', payload.entidade);
      formData.append('entidadeId', payload.entidadeId);
      formData.append('entidadeNome', payload.entidadeNome);
      formData.append('responsavelNome', payload.responsavelNome);
      if (payload.obraId) formData.append('obraId', payload.obraId);
      if (payload.competencia) formData.append('competencia', payload.competencia);
      if (payload.dataVencimento) formData.append('dataVencimento', payload.dataVencimento);
      const response = await api.post(DOCUMENTOS_API_ENDPOINTS.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return unwrapApiResponse<Documento>(response.data);
    },
    () => uploadDocumentoMock(payload),
  );
}

export async function updateDocumento(documentoId: string, payload: UpdateDocumentoPayload): Promise<Documento> {
  return withApiFallback(
    async () => {
      const response = await api.put(DOCUMENTOS_API_ENDPOINTS.update(documentoId), payload);
      return unwrapApiResponse<Documento>(response.data);
    },
    () => updateDocumentoMock(documentoId, payload),
  );
}
