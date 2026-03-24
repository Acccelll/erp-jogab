import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { medicoesFiltersSchema } from '../types';
import type { MedicoesDashboardData, MedicoesFiltersData } from '../types';
import { getMockMedicaoById, getMockMedicoes, getMockMedicoesDashboard } from '../data/medicoes.mock';

export const MEDICOES_API_ENDPOINTS = {
  dashboard: '/medicoes/dashboard',
  list: '/medicoes',
  detail: (id: string) => `/medicoes/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: MedicoesFiltersData) {
  return medicoesFiltersSchema.parse(filters ?? {});
}

export function normalizeMedicoesDashboardData(
  payload: Partial<MedicoesDashboardData> | null | undefined,
): MedicoesDashboardData {
  const safe = payload ?? {};
  return {
    medicoes: Array.isArray(safe.medicoes) ? safe.medicoes : [],
    kpis: {
      totalMedicoes: 0,
      medicoesEmAprovacao: 0,
      medicoesAprovadas: 0,
      valorMedido: 0,
      valorFaturado: 0,
      valorReceber: 0,
      ...safe.kpis,
    },
    resumoCards: Array.isArray(safe.resumoCards) ? safe.resumoCards : [],
    statusResumo: Array.isArray(safe.statusResumo) ? safe.statusResumo : [],
    competenciaResumo: Array.isArray(safe.competenciaResumo) ? safe.competenciaResumo : [],
  };
}

async function fetchMedicoesDashboardMock(filters?: MedicoesFiltersData) {
  await wait();
  return getMockMedicoesDashboard(normalizeFilters(filters));
}

async function fetchMedicoesMock(filters?: MedicoesFiltersData) {
  await wait();
  return getMockMedicoes(normalizeFilters(filters));
}

async function fetchMedicaoByIdMock(medicaoId: string) {
  await wait();
  const result = getMockMedicaoById(medicaoId);

  if (!result) {
    throw new Error('Medição não encontrada.');
  }

  return result;
}

export async function fetchMedicoesDashboard(filters?: MedicoesFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(MEDICOES_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchMedicoesDashboardMock>>>(response.data);
    },
    () => fetchMedicoesDashboardMock(filters),
  );
}

export async function fetchMedicoes(filters?: MedicoesFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(MEDICOES_API_ENDPOINTS.list, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchMedicoesMock>>>(response.data);
    },
    () => fetchMedicoesMock(filters),
  );
}

export async function fetchMedicaoById(medicaoId: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(MEDICOES_API_ENDPOINTS.detail(medicaoId));
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchMedicaoByIdMock>>>(response.data);
    },
    () => fetchMedicaoByIdMock(medicaoId),
  );
}
