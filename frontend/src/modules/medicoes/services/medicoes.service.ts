import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { medicoesFiltersSchema } from '../types';
import type {
  Medicao,
  MedicaoAprovacaoStatus,
  MedicaoFaturamentoStatus,
  MedicoesDashboardData,
  MedicoesFiltersData,
  MedicaoOrigem,
  MedicaoStatus,
} from '../types';
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

export interface CreateMedicaoPayload {
  obraId: string;
  contratoId: string;
  clienteNome: string;
  competencia: string;
  periodoInicio: string;
  periodoFim: string;
  percentualAvanco: number;
  valorContrato: number;
  centroCusto: string;
  responsavelNome: string;
}

export interface UpdateMedicaoPayload {
  status?: MedicaoStatus;
  percentualAvanco?: number;
  observacao?: string;
}

export interface AprovarMedicaoPayload {
  aprovadorNome: string;
  observacao?: string;
}

export async function createMedicao(payload: CreateMedicaoPayload): Promise<Medicao> {
  return withApiFallback(
    async () => {
      const response = await api.post(MEDICOES_API_ENDPOINTS.list, payload);
      return unwrapApiResponse<Medicao>(response.data);
    },
    () =>
      Promise.resolve({
        id: crypto.randomUUID(),
        codigo: `MED-${Date.now()}`,
        numeroMedicao: 1,
        obraNome: payload.obraId,
        contratoCodigo: payload.contratoId,
        status: 'rascunho' as MedicaoStatus,
        origem: 'manual' as MedicaoOrigem,
        aprovacaoStatus: 'pendente' as MedicaoAprovacaoStatus,
        faturamentoStatus: 'nao_faturado' as MedicaoFaturamentoStatus,
        resumoFinanceiro: {
          valorMedido: 0,
          valorRetido: 0,
          valorLiberadoFaturamento: 0,
          valorFaturado: 0,
          valorRecebido: 0,
        },
        updatedAt: new Date().toISOString(),
        ...payload,
      }),
  );
}

export async function updateMedicao(id: string, payload: UpdateMedicaoPayload): Promise<Medicao> {
  return withApiFallback(
    async () => {
      const response = await api.put(MEDICOES_API_ENDPOINTS.detail(id), payload);
      return unwrapApiResponse<Medicao>(response.data);
    },
    async () => {
      const detail = await fetchMedicaoById(id);
      if (detail?.medicao) return detail.medicao;
      throw new Error(`Medição ${id} not found`);
    },
  );
}

export async function aprovarMedicao(id: string, payload: AprovarMedicaoPayload): Promise<Medicao> {
  return withApiFallback(
    async () => {
      const response = await api.post(`${MEDICOES_API_ENDPOINTS.detail(id)}/aprovar`, payload);
      return unwrapApiResponse<Medicao>(response.data);
    },
    async () => {
      const detail = await fetchMedicaoById(id);
      if (detail?.medicao) return detail.medicao;
      throw new Error(`Medição ${id} not found`);
    },
  );
}
