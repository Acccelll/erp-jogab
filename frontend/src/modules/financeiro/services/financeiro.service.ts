import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import {
  getMockFinanceiroDashboard,
  getMockFinanceiroPessoal,
  getMockFluxoCaixa,
  getMockTituloFinanceiroById,
  getMockTitulosFinanceiros,
} from '../data/financeiro.mock';
import { financeiroFiltersSchema } from '../types';
import type {
  FinanceiroDashboardData,
  FinanceiroFiltersData,
  FinanceiroKpis,
  FinanceiroPessoalDashboardData,
} from '../types';

export const FINANCEIRO_API_ENDPOINTS = {
  dashboard: '/financeiro/dashboard',
  fluxoCaixa: '/financeiro/fluxo-caixa',
  pessoal: '/financeiro/pessoal',
  contasPagar: '/financeiro/contas-pagar',
  contasReceber: '/financeiro/contas-receber',
  tituloDetail: (id: string) => `/financeiro/titulos/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, NETWORK_DELAY_MS);
  });
}

function normalizeFilters(filters?: FinanceiroFiltersData) {
  return financeiroFiltersSchema.parse(filters ?? {});
}

const EMPTY_FINANCEIRO_KPIS: FinanceiroKpis = {
  totalTitulos: 0,
  totalPagar: 0,
  totalReceber: 0,
  valorPagar: 0,
  valorReceber: 0,
  valorVencido: 0,
  saldoProjetado: 0,
};

const EMPTY_FINANCEIRO_PESSOAL: FinanceiroPessoalDashboardData = {
  competencia: {
    competencia: '',
    totalFuncionarios: 0,
    totalObras: 0,
    totalCentrosCusto: 0,
    valorHorasExtrasPrevisto: 0,
    valorHorasExtrasRealizado: 0,
    valorFopagPrevisto: 0,
    valorFopagRealizado: 0,
    valorPrevisto: 0,
    valorRealizado: 0,
    variacao: 0,
    statusFechamento: 'aberta',
  },
  porObra: [],
  porCentroCusto: [],
  previstoRealizado: [],
  destaques: [],
};

/** Ensures the API payload always conforms to a complete FinanceiroDashboardData. */
export function normalizeFinanceiroDashboardData(
  payload: Partial<FinanceiroDashboardData> | null | undefined,
): FinanceiroDashboardData {
  return {
    titulos: Array.isArray(payload?.titulos) ? payload.titulos : [],
    kpis: payload?.kpis ? { ...EMPTY_FINANCEIRO_KPIS, ...payload.kpis } : EMPTY_FINANCEIRO_KPIS,
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    statusResumo: Array.isArray(payload?.statusResumo) ? payload.statusResumo : [],
    tipoResumo: Array.isArray(payload?.tipoResumo) ? payload.tipoResumo : [],
    pessoal: payload?.pessoal
      ? {
          ...EMPTY_FINANCEIRO_PESSOAL,
          ...payload.pessoal,
          competencia: {
            ...EMPTY_FINANCEIRO_PESSOAL.competencia,
            ...payload.pessoal.competencia,
          },
          porObra: Array.isArray(payload.pessoal.porObra) ? payload.pessoal.porObra : [],
          porCentroCusto: Array.isArray(payload.pessoal.porCentroCusto) ? payload.pessoal.porCentroCusto : [],
          previstoRealizado: Array.isArray(payload.pessoal.previstoRealizado) ? payload.pessoal.previstoRealizado : [],
          destaques: Array.isArray(payload.pessoal.destaques) ? payload.pessoal.destaques : [],
        }
      : EMPTY_FINANCEIRO_PESSOAL,
  };
}

async function fetchFinanceiroDashboardMock(filters?: FinanceiroFiltersData) {
  await wait();
  return getMockFinanceiroDashboard(normalizeFilters(filters));
}

async function fetchFluxoCaixaMock(filters?: FinanceiroFiltersData) {
  await wait();
  return getMockFluxoCaixa(normalizeFilters(filters));
}

async function fetchFinanceiroPessoalMock(filters?: FinanceiroFiltersData) {
  await wait();
  return getMockFinanceiroPessoal(normalizeFilters(filters));
}

async function fetchContasPagarMock(filters?: FinanceiroFiltersData) {
  await wait();
  const normalized = normalizeFilters({ ...filters, tipo: 'pagar' });
  return getMockTitulosFinanceiros(normalized);
}

async function fetchContasReceberMock(filters?: FinanceiroFiltersData) {
  await wait();
  const normalized = normalizeFilters({ ...filters, tipo: 'receber' });
  return getMockTitulosFinanceiros(normalized);
}

async function fetchTituloFinanceiroByIdMock(tituloId: string) {
  await wait();
  const result = getMockTituloFinanceiroById(tituloId);

  if (!result) {
    throw new Error('Título financeiro não encontrado.');
  }

  return result;
}

export async function fetchFinanceiroDashboard(filters?: FinanceiroFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFinanceiroDashboardMock>>>(response.data);
    },
    () => fetchFinanceiroDashboardMock(filters),
  );
}

export async function fetchFluxoCaixa(filters?: FinanceiroFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.fluxoCaixa, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFluxoCaixaMock>>>(response.data);
    },
    () => fetchFluxoCaixaMock(filters),
  );
}

export async function fetchFinanceiroPessoal(filters?: FinanceiroFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.pessoal, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchFinanceiroPessoalMock>>>(response.data);
    },
    () => fetchFinanceiroPessoalMock(filters),
  );
}

export async function fetchContasPagar(filters?: FinanceiroFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.contasPagar, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchContasPagarMock>>>(response.data);
    },
    () => fetchContasPagarMock(filters),
  );
}

export async function fetchContasReceber(filters?: FinanceiroFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.contasReceber, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchContasReceberMock>>>(response.data);
    },
    () => fetchContasReceberMock(filters),
  );
}

export async function fetchTituloFinanceiroById(tituloId: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(FINANCEIRO_API_ENDPOINTS.tituloDetail(tituloId));
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchTituloFinanceiroByIdMock>>>(response.data);
    },
    () => fetchTituloFinanceiroByIdMock(tituloId),
  );
}
