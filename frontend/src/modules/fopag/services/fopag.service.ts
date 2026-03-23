import type { FopagCompetenciaDetalhe, FopagCompetenciaListItem, FopagCompetenciasKpis } from '../types';
import type { FopagFiltersData } from '../types';
import { calcularFopagCompetenciasKpis, getFopagCompetenciaDetalheMock, getFopagCompetenciasMock } from '../data/fopag.mock';

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

export async function fetchFopagCompetencias(filters?: FopagFiltersData): Promise<{ data: FopagCompetenciaListItem[]; kpis: FopagCompetenciasKpis }> {
  await delay();
  const filtered = applyFilters(getFopagCompetenciasMock(), filters);
  return { data: filtered, kpis: calcularFopagCompetenciasKpis(filtered) };
}

export async function fetchFopagCompetenciaDetails(competenciaId: string): Promise<FopagCompetenciaDetalhe | null> {
  await delay(180);
  return getFopagCompetenciaDetalheMock(competenciaId);
}
