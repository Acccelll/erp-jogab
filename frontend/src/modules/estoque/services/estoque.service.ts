import { estoqueFiltersSchema } from '../types';
import type { EstoqueFiltersData } from '../types';
import { getMockEstoqueDashboard, getMockItemEstoqueById, getMockMovimentacoesEstoque } from '../data/estoque.mock';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: EstoqueFiltersData) {
  return estoqueFiltersSchema.parse(filters ?? {});
}

export async function fetchEstoqueDashboard(filters?: EstoqueFiltersData) {
  await wait();
  return getMockEstoqueDashboard(normalizeFilters(filters));
}

export async function fetchMovimentacoesEstoque(filters?: EstoqueFiltersData) {
  await wait();
  return getMockMovimentacoesEstoque(normalizeFilters(filters));
}

export async function fetchItemEstoqueById(itemId: string) {
  await wait();
  const result = getMockItemEstoqueById(itemId);

  if (!result) {
    throw new Error('Item de estoque não encontrado.');
  }

  return result;
}
