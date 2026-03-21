import { relatoriosFiltersSchema } from '../types';
import type {
  RelatorioCategoria,
  RelatoriosFiltersData,
} from '../types';
import {
  getMockRelatorioCategoria,
  getMockRelatoriosDashboard,
} from '../data/relatorios.mock';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: RelatoriosFiltersData) {
  return relatoriosFiltersSchema.parse(filters ?? {});
}

export async function fetchRelatoriosDashboard(filters?: RelatoriosFiltersData) {
  await wait();
  return getMockRelatoriosDashboard(normalizeFilters(filters));
}

export async function fetchRelatorioCategoria(
  categoria: RelatorioCategoria,
  filters?: RelatoriosFiltersData,
) {
  await wait();
  return getMockRelatorioCategoria(categoria, normalizeFilters(filters));
}
