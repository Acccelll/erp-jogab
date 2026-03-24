import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type { FopagCompetenciaDetalhe, FopagCompetenciaListItem, FopagCompetenciasKpis } from '../types';
import type { FopagFiltersData } from '../types';
import { calcularFopagCompetenciasKpis, getFopagCompetenciaDetalheMock, getFopagCompetenciasMock } from '../data/fopag.mock';

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

async function fetchFopagCompetenciasMock(filters?: FopagFiltersData): Promise<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> {
  await delay();
  const filtered = applyFilters(getFopagCompetenciasMock(), filters);
  return { data: filtered, kpis: calcularFopagCompetenciasKpis(filtered) };
}

async function fetchFopagCompetenciaDetailsMock(competenciaId: string): Promise<FopagCompetenciaDetalhe | null> {
  await delay(180);
  return getFopagCompetenciaDetalheMock(competenciaId);
}

export async function fetchFopagCompetencias(filters?: FopagFiltersData): Promise<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> {
  return withApiFallback(
    async () => {
      const response = await api.get(FOPAG_API_ENDPOINTS.competencias, { params: filters });
      return unwrapApiResponse<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }>(response.data);
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
