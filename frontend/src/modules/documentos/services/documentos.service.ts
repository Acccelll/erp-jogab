import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { documentosFiltersSchema } from '../types';
import type { DocumentosFiltersData } from '../types';
import { getMockDocumentoById, getMockDocumentosDashboard } from '../data/documentos.mock';

export const DOCUMENTOS_API_ENDPOINTS = {
  dashboard: '/documentos/dashboard',
  detail: (id: string) => `/documentos/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: DocumentosFiltersData) {
  return documentosFiltersSchema.parse(filters ?? {});
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
