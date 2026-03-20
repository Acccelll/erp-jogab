import {
  getMockFinanceiroDashboard,
  getMockFluxoCaixa,
  getMockTituloFinanceiroById,
  getMockTitulosFinanceiros,
} from '../data/financeiro.mock';
import { financeiroFiltersSchema } from '../types';
import type { FinanceiroFiltersData } from '../types';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, NETWORK_DELAY_MS);
  });
}

function normalizeFilters(filters?: FinanceiroFiltersData) {
  return financeiroFiltersSchema.parse(filters ?? {});
}

export async function fetchFinanceiroDashboard(filters?: FinanceiroFiltersData) {
  await wait();
  return getMockFinanceiroDashboard(normalizeFilters(filters));
}

export async function fetchFluxoCaixa(filters?: FinanceiroFiltersData) {
  await wait();
  return getMockFluxoCaixa(normalizeFilters(filters));
}

export async function fetchContasPagar(filters?: FinanceiroFiltersData) {
  await wait();
  const normalized = normalizeFilters({ ...filters, tipo: 'pagar' });
  return getMockTitulosFinanceiros(normalized);
}

export async function fetchContasReceber(filters?: FinanceiroFiltersData) {
  await wait();
  const normalized = normalizeFilters({ ...filters, tipo: 'receber' });
  return getMockTitulosFinanceiros(normalized);
}

export async function fetchTituloFinanceiroById(tituloId: string) {
  await wait();
  const result = getMockTituloFinanceiroById(tituloId);

  if (!result) {
    throw new Error('Título financeiro não encontrado.');
  }

  return result;
}
