import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import {
  getMockFinanceiroDashboard,
  getMockFinanceiroPessoal,
  getMockFluxoCaixa,
  getMockTituloFinanceiroById,
  getMockTitulosFinanceiros,
} from '../data/financeiro.mock';
import { financeiroFiltersSchema } from '../types';
import type { FinanceiroFiltersData } from '../types';

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
