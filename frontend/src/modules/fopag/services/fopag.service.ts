import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type { FopagCompetenciaDetalhe, FopagCompetenciaListItem, FopagCompetenciasKpis } from '../types';
import type { FopagFiltersData } from '../types';
import {
  calcularFopagCompetenciasKpis,
  getFopagCompetenciaDetalheMock,
  getFopagCompetenciasMock,
} from '../data/fopag.mock';

export const FOPAG_API_ENDPOINTS = {
  competencias: '/fopag/competencias',
  competenciaDetail: (id: string) => `/fopag/competencias/${id}`,
} as const;

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: FopagCompetenciaListItem[], filters?: FopagFiltersData): FopagCompetenciaListItem[] {
  let result = [...items];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((item) => item.competencia.includes(search));
  }

  if (filters?.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.competencia) {
    result = result.filter((item) => item.competencia === filters.competencia);
  }

  return result;
}

async function fetchFopagCompetenciasMock(
  filters?: FopagFiltersData,
): Promise<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> {
  await delay();
  const filtered = applyFilters(getFopagCompetenciasMock(), filters);
  return { data: filtered, kpis: calcularFopagCompetenciasKpis(filtered) };
}

async function fetchFopagCompetenciaDetailsMock(competenciaId: string): Promise<FopagCompetenciaDetalhe | null> {
  await delay(180);
  return getFopagCompetenciaDetalheMock(competenciaId);
}

/** Ensures the API payload always conforms to a complete FOPAG competências response. */
export function normalizeFopagCompetenciasResponse(
  payload: Partial<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> | null | undefined,
): { data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis } {
  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    kpis: {
      totalCompetencias: payload?.kpis?.totalCompetencias ?? 0,
      emConsolidacao: payload?.kpis?.emConsolidacao ?? 0,
      prontasParaRateio: payload?.kpis?.prontasParaRateio ?? 0,
      valorPrevistoTotal: payload?.kpis?.valorPrevistoTotal ?? 0,
      valorRealizadoTotal: payload?.kpis?.valorRealizadoTotal ?? 0,
    },
  };
}

export async function fetchFopagCompetencias(
  filters?: FopagFiltersData,
): Promise<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> {
  return withApiFallback(
    async () => {
      const response = await api.get(FOPAG_API_ENDPOINTS.competencias, { params: filters });
      const raw = unwrapApiResponse<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }>(response.data);
      return normalizeFopagCompetenciasResponse(raw);
    },
    () => fetchFopagCompetenciasMock(filters),
  );
}

export async function fetchFopagCompetenciaDetails(competenciaId: string): Promise<FopagCompetenciaDetalhe | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(FOPAG_API_ENDPOINTS.competenciaDetail(competenciaId));
      return unwrapApiResponse<FopagCompetenciaDetalhe | null>(response.data);
    },
    () => fetchFopagCompetenciaDetailsMock(competenciaId),
  );
}
