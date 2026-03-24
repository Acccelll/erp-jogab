import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { relatoriosFiltersSchema } from '../types';
import type {
  RelatorioCategoria,
  RelatoriosFiltersData,
} from '../types';
import {
  getMockRelatorioCategoria,
  getMockRelatoriosDashboard,
} from '../data/relatorios.mock';

export const RELATORIOS_API_ENDPOINTS = {
  dashboard: '/relatorios/dashboard',
  categoria: (categoria: string) => `/relatorios/categorias/${categoria}`,
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: RelatoriosFiltersData) {
  return relatoriosFiltersSchema.parse(filters ?? {});
}

async function fetchRelatoriosDashboardMock(filters?: RelatoriosFiltersData) {
  await wait();
  return getMockRelatoriosDashboard(normalizeFilters(filters));
}

async function fetchRelatorioCategoriasMock(
  categoria: RelatorioCategoria,
  filters?: RelatoriosFiltersData,
) {
  await wait();
  return getMockRelatorioCategoria(categoria, normalizeFilters(filters));
}

export async function fetchRelatoriosDashboard(filters?: RelatoriosFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(RELATORIOS_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchRelatoriosDashboardMock>>>(response.data);
    },
    () => fetchRelatoriosDashboardMock(filters),
  );
}

export async function fetchRelatorioCategoria(
  categoria: RelatorioCategoria,
  filters?: RelatoriosFiltersData,
) {
  return withApiFallback(
    async () => {
      const response = await api.get(RELATORIOS_API_ENDPOINTS.categoria(categoria), { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchRelatorioCategoriasMock>>>(response.data);
    },
    () => fetchRelatorioCategoriasMock(categoria, filters),
  );
}
