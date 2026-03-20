import type {
  FechamentoCompetencia,
  HoraExtraLancamento,
  HoraExtraListItem,
  HoraExtraResumoCard,
  HorasExtrasDashboardData,
  HorasExtrasKpis,
} from '../types';
import type { HorasExtrasFiltersData } from '../types';
import {
  calcularHorasExtrasKpis,
  gerarHorasExtrasResumoCards,
  mockFechamentosCompetencia,
  mockHorasExtras,
  toHoraExtraListItem,
} from '../data/horas-extras.mock';

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(items: HoraExtraLancamento[], filters?: HorasExtrasFiltersData): HoraExtraLancamento[] {
  let result = [...items];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((item) =>
      item.funcionarioNome.toLowerCase().includes(search) ||
      item.matricula.toLowerCase().includes(search) ||
      item.obraNome.toLowerCase().includes(search) ||
      item.cargo.toLowerCase().includes(search),
    );
  }

  if (filters?.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.tipo) {
    result = result.filter((item) => item.tipo === filters.tipo);
  }

  if (filters?.competencia) {
    result = result.filter((item) => item.competencia === filters.competencia);
  }

  if (filters?.obraId) {
    result = result.filter((item) => item.obraId === filters.obraId);
  }

  if (filters?.filialId) {
    result = result.filter((item) => item.filialId === filters.filialId);
  }

  return result;
}

export async function fetchHorasExtras(filters?: HorasExtrasFiltersData): Promise<{
  data: HoraExtraListItem[];
  kpis: HorasExtrasKpis;
  resumoCards: HoraExtraResumoCard[];
  fechamentoAtual: FechamentoCompetencia | null;
}> {
  await delay();

  const filtered = applyFilters(mockHorasExtras, filters);
  const competenciaAtiva = filters?.competencia ?? filtered[0]?.competencia ?? null;
  const fechamentoAtual = competenciaAtiva
    ? mockFechamentosCompetencia.find((item) => item.competencia === competenciaAtiva) ?? null
    : null;

  return {
    data: filtered.map(toHoraExtraListItem),
    kpis: calcularHorasExtrasKpis(filtered),
    resumoCards: gerarHorasExtrasResumoCards(filtered, fechamentoAtual),
    fechamentoAtual,
  };
}

export async function fetchHoraExtraById(id: string): Promise<HoraExtraLancamento | null> {
  await delay(180);
  return mockHorasExtras.find((item) => item.id === id) ?? null;
}

export async function fetchFechamentosCompetencia(): Promise<FechamentoCompetencia[]> {
  await delay(180);
  return [...mockFechamentosCompetencia];
}

export async function fetchHorasExtrasDashboard(filters?: HorasExtrasFiltersData): Promise<HorasExtrasDashboardData> {
  const response = await fetchHorasExtras(filters);
  return {
    list: response.data,
    kpis: response.kpis,
    resumoCards: response.resumoCards,
    fechamentoAtual: response.fechamentoAtual,
  };
}
