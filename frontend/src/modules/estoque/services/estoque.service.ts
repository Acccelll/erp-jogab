import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { estoqueFiltersSchema } from '../types';
import type { EstoqueDashboardData, EstoqueFiltersData } from '../types';
import { getMockEstoqueDashboard, getMockItemEstoqueById, getMockMovimentacoesEstoque } from '../data/estoque.mock';

export const ESTOQUE_API_ENDPOINTS = {
  dashboard: '/estoque/dashboard',
  movimentacoes: '/estoque/movimentacoes',
  itemDetail: (id: string) => `/estoque/itens/${id}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: EstoqueFiltersData) {
  return estoqueFiltersSchema.parse(filters ?? {});
}

export function normalizeEstoqueDashboardData(
  payload: Partial<EstoqueDashboardData> | null | undefined,
): EstoqueDashboardData {
  const safe = payload ?? {};
  return {
    itens: Array.isArray(safe.itens) ? safe.itens : [],
    movimentacoes: Array.isArray(safe.movimentacoes) ? safe.movimentacoes : [],
    kpis: {
      totalItens: 0,
      itensCriticos: 0,
      locaisAtivos: 0,
      valorEstocado: 0,
      valorReservado: 0,
      consumoMensal: 0,
      entradasPendentes: 0,
      ...safe.kpis,
    },
    resumoCards: Array.isArray(safe.resumoCards) ? safe.resumoCards : [],
    statusResumo: Array.isArray(safe.statusResumo) ? safe.statusResumo : [],
    localResumo: Array.isArray(safe.localResumo) ? safe.localResumo : [],
    tipoResumo: Array.isArray(safe.tipoResumo) ? safe.tipoResumo : [],
  };
}

async function fetchEstoqueDashboardMock(filters?: EstoqueFiltersData) {
  await wait();
  return getMockEstoqueDashboard(normalizeFilters(filters));
}

async function fetchMovimentacoesEstoqueMock(filters?: EstoqueFiltersData) {
  await wait();
  return getMockMovimentacoesEstoque(normalizeFilters(filters));
}

async function fetchItemEstoqueByIdMock(itemId: string) {
  await wait();
  const result = getMockItemEstoqueById(itemId);

  if (!result) {
    throw new Error('Item de estoque não encontrado.');
  }

  return result;
}

export async function fetchEstoqueDashboard(filters?: EstoqueFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ESTOQUE_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchEstoqueDashboardMock>>>(response.data);
    },
    () => fetchEstoqueDashboardMock(filters),
  );
}

export async function fetchMovimentacoesEstoque(filters?: EstoqueFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ESTOQUE_API_ENDPOINTS.movimentacoes, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchMovimentacoesEstoqueMock>>>(response.data);
    },
    () => fetchMovimentacoesEstoqueMock(filters),
  );
}

export async function fetchItemEstoqueById(itemId: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(ESTOQUE_API_ENDPOINTS.itemDetail(itemId));
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchItemEstoqueByIdMock>>>(response.data);
    },
    () => fetchItemEstoqueByIdMock(itemId),
  );
}
