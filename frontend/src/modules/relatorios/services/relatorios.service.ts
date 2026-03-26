import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { relatoriosFiltersSchema } from '../types';
import type {
  RelatorioCategoria,
  RelatorioCategoriaData,
  RelatoriosDashboardData,
  RelatoriosFiltersData,
  RelatoriosResumoExecutivo,
  RelatorioSaida,
} from '../types';
import { getMockRelatorioCategoria, getMockRelatoriosDashboard } from '../data/relatorios.mock';

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

async function fetchRelatorioCategoriasMock(categoria: RelatorioCategoria, filters?: RelatoriosFiltersData) {
  await wait();
  return getMockRelatorioCategoria(categoria, normalizeFilters(filters));
}

const EMPTY_RESUMO: RelatoriosResumoExecutivo = {
  totalRelatorios: 0,
  categoriasAtivas: 0,
  disponiveis: 0,
  planejados: 0,
  exportaveis: 0,
};

/** Ensures the API payload always conforms to a complete RelatoriosDashboardData. */
export function normalizeRelatoriosDashboardData(
  payload: Partial<RelatoriosDashboardData> | null | undefined,
): RelatoriosDashboardData {
  return {
    itens: Array.isArray(payload?.itens) ? payload.itens : [],
    categorias: Array.isArray(payload?.categorias) ? payload.categorias : [],
    resumo: payload?.resumo ? { ...EMPTY_RESUMO, ...payload.resumo } : EMPTY_RESUMO,
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    saidasOperacionais: Array.isArray(payload?.saidasOperacionais) ? payload.saidasOperacionais : [],
    coberturaModulos: Array.isArray(payload?.coberturaModulos) ? payload.coberturaModulos : [],
  };
}

export async function fetchRelatoriosDashboard(filters?: RelatoriosFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(RELATORIOS_API_ENDPOINTS.dashboard, { params: filters });
      const raw = unwrapApiResponse<RelatoriosDashboardData>(response.data);
      return normalizeRelatoriosDashboardData(raw);
    },
    () => fetchRelatoriosDashboardMock(filters),
  );
}

/** Ensures the API payload always conforms to a complete RelatorioCategoriaData. */
export function normalizeRelatorioCategoriaData(
  payload: Partial<RelatorioCategoriaData> | null | undefined,
  categoria: RelatorioCategoria,
): RelatorioCategoriaData {
  return {
    categoria: payload?.categoria ?? categoria,
    itens: Array.isArray(payload?.itens) ? payload.itens : [],
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    saidasOperacionais: Array.isArray(payload?.saidasOperacionais) ? payload.saidasOperacionais : [],
    coberturaModulos: Array.isArray(payload?.coberturaModulos) ? payload.coberturaModulos : [],
  };
}

export async function fetchRelatorioCategoria(
  categoria: RelatorioCategoria,
  filters?: RelatoriosFiltersData,
): Promise<RelatorioCategoriaData> {
  return withApiFallback(
    async () => {
      const response = await api.get(RELATORIOS_API_ENDPOINTS.categoria(categoria), { params: filters });
      const raw = unwrapApiResponse<RelatorioCategoriaData>(response.data);
      return normalizeRelatorioCategoriaData(raw, categoria);
    },
    () => fetchRelatorioCategoriasMock(categoria, filters),
  );
}

export interface GerarRelatorioPayload {
  relatorioId: string;
  formato: RelatorioSaida;
  filtros?: Record<string, unknown>;
  periodoInicio?: string;
  periodoFim?: string;
  obraId?: string;
}

export interface RelatorioGeradoResult {
  id: string;
  relatorioId: string;
  titulo: string;
  formato: RelatorioSaida;
  status: 'processando' | 'concluido' | 'erro';
  url?: string;
  geradoEm: string;
  expiracaoEm: string;
}

export async function gerarRelatorio(payload: GerarRelatorioPayload): Promise<RelatorioGeradoResult> {
  return withApiFallback(
    async () => {
      const response = await api.post(`${RELATORIOS_API_ENDPOINTS.dashboard}/gerar`, payload);
      return unwrapApiResponse<RelatorioGeradoResult>(response.data);
    },
    () =>
      Promise.resolve({
        id: crypto.randomUUID(),
        relatorioId: payload.relatorioId,
        titulo: `Relatório ${payload.relatorioId}`,
        formato: payload.formato,
        status: 'concluido' as const,
        url: `/relatorios/download/${crypto.randomUUID()}`,
        geradoEm: new Date().toISOString(),
        expiracaoEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
  );
}
