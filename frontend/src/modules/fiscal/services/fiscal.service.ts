import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { getMockDocumentoFiscalById, getMockFiscalDashboard } from '../data/fiscal.mock';
import { fiscalFiltersSchema } from '../types';
import type { FiscalDashboardData, FiscalFiltersData } from '../types';

export const FISCAL_API_ENDPOINTS = {
  dashboard: '/fiscal/dashboard',
  entradas: '/fiscal/entradas',
  saidas: '/fiscal/saidas',
  documentoDetail: (id: string) => `/fiscal/documentos/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: FiscalFiltersData) {
  return fiscalFiltersSchema.parse(filters ?? {});
}

export function normalizeFiscalDashboardData(
  payload: Partial<FiscalDashboardData> | null | undefined,
): FiscalDashboardData {
  const safe = payload ?? {};
  return {
    documentos: Array.isArray(safe.documentos) ? safe.documentos : [],
    kpis: {
      totalDocumentos: 0,
      totalEntradas: 0,
      totalSaidas: 0,
      valorEntradas: 0,
      valorSaidas: 0,
      validando: 0,
      comErro: 0,
      ...safe.kpis,
    },
    resumoCards: Array.isArray(safe.resumoCards) ? safe.resumoCards : [],
    statusResumo: Array.isArray(safe.statusResumo) ? safe.statusResumo : [],
  };
}

async function fetchFiscalDashboardMock(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard(normalizeFilters(filters));
}

async function fetchFiscalEntradasMock(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard({ ...normalizeFilters(filters), tipoOperacao: 'entrada' });
}

async function fetchFiscalSaidasMock(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard({ ...normalizeFilters(filters), tipoOperacao: 'saida' });
}

async function fetchDocumentoFiscalByIdMock(documentoId: string) {
  await wait();
  const result = getMockDocumentoFiscalById(documentoId);

  if (!result) {
    throw new Error('Documento fiscal não encontrado.');
  }

  return result;
}

export async function fetchFiscalDashboard(filters?: FiscalFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FISCAL_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFiscalDashboardMock>>>(response.data);
    },
    () => fetchFiscalDashboardMock(filters),
  );
}

export async function fetchFiscalEntradas(filters?: FiscalFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FISCAL_API_ENDPOINTS.entradas, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFiscalEntradasMock>>>(response.data);
    },
    () => fetchFiscalEntradasMock(filters),
  );
}

export async function fetchFiscalSaidas(filters?: FiscalFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FISCAL_API_ENDPOINTS.saidas, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFiscalSaidasMock>>>(response.data);
    },
    () => fetchFiscalSaidasMock(filters),
  );
}

export async function fetchDocumentoFiscalById(documentoId: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(FISCAL_API_ENDPOINTS.documentoDetail(documentoId));
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchDocumentoFiscalByIdMock>>>(response.data);
    },
    () => fetchDocumentoFiscalByIdMock(documentoId),
  );
}
