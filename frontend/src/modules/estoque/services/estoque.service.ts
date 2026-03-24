import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { estoqueFiltersSchema } from '../types';
import type { EstoqueFiltersData } from '../types';
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
