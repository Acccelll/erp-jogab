import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type {
  FechamentoCompetencia,
  HoraExtraLancamento,
  HoraExtraListItem,
  HoraExtraMutationResponse,
  HoraExtraResumoCard,
  HorasExtrasDashboardData,
  HorasExtrasFechamentoResponse,
  HorasExtrasKpis,
} from '../types';
import type { HorasExtrasFiltersData } from '../types';
import {
  approveHoraExtraMock,
  calcularHorasExtrasKpis,
  fecharCompetenciaMock,
  gerarHorasExtrasResumoCards,
  mockHorasExtras,
  syncFechamentoCompetencia,
  toHoraExtraListItem,
} from '../data/horas-extras.mock';
import { registrarHoraExtraHistorico } from '../data/horas-extras-aprovacao.mock';

export const HORAS_EXTRAS_API_ENDPOINTS = {
  list: '/horas-extras',
  detail: (id: string) => `/horas-extras/${id}`,
  dashboard: '/horas-extras/dashboard',
  aprovar: (id: string) => `/horas-extras/${id}/aprovar`,
  fechamento: '/horas-extras/fechamento',
  fechamentos: '/horas-extras/fechamentos',
} as const;

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

async function fetchHorasExtrasMock(filters?: HorasExtrasFiltersData): Promise<{
  data: HoraExtraListItem[];
  kpis: HorasExtrasKpis;
  resumoCards: HoraExtraResumoCard[];
  fechamentoAtual: FechamentoCompetencia | null;
}> {
  await delay();

  const filtered = applyFilters(mockHorasExtras, filters);
  const competenciaAtiva = filters?.competencia ?? filtered[0]?.competencia ?? null;
  const fechamentoAtual = competenciaAtiva ? syncFechamentoCompetencia(competenciaAtiva) : null;

  return {
    data: filtered.map(toHoraExtraListItem),
    kpis: calcularHorasExtrasKpis(filtered),
    resumoCards: gerarHorasExtrasResumoCards(filtered, fechamentoAtual),
    fechamentoAtual,
  };
}

async function fetchHoraExtraByIdMock(id: string): Promise<HoraExtraLancamento | null> {
  await delay(180);
  return mockHorasExtras.find((item) => item.id === id) ?? null;
}

async function fetchFechamentosCompetenciaMock(): Promise<FechamentoCompetencia[]> {
  await delay(180);
  return [...new Set(mockHorasExtras.map((item) => item.competencia))].map((competencia) => syncFechamentoCompetencia(competencia));
}

async function fetchHorasExtrasDashboardMock(filters?: HorasExtrasFiltersData): Promise<HorasExtrasDashboardData> {
  const response = await fetchHorasExtrasMock(filters);
  return {
    list: response.data,
    kpis: response.kpis,
    resumoCards: response.resumoCards,
    fechamentoAtual: response.fechamentoAtual,
  };
}

async function approveHoraExtraServiceMock(id: string): Promise<HoraExtraMutationResponse> {
  await delay(180);
  const result = approveHoraExtraMock(id);
  registrarHoraExtraHistorico({
    horaExtraId: id,
    competencia: result.lancamento.competencia,
    funcionarioNome: result.lancamento.funcionarioNome,
    obraNome: result.lancamento.obraNome,
    evento: 'aprovada',
    responsavel: result.lancamento.aprovadorNome ?? 'Gestor da Competência',
    destino: 'horas_extras',
    descricao: 'Lançamento aprovado e liberado para o fechamento da competência.',
  });
  return result;
}

async function fecharCompetenciaHorasExtrasMock(competencia: string): Promise<HorasExtrasFechamentoResponse> {
  await delay(220);
  const result = fecharCompetenciaMock(competencia);
  mockHorasExtras
    .filter((item) => item.competencia === competencia && item.status === 'fechada_para_fopag')
    .forEach((item) => {
      registrarHoraExtraHistorico({
        horaExtraId: item.id,
        competencia: item.competencia,
        funcionarioNome: item.funcionarioNome,
        obraNome: item.obraNome,
        evento: 'fechada_para_fopag',
        responsavel: 'Gestão de Horas Extras',
        destino: 'fopag',
        descricao: 'Competência fechada e preparada para composição da FOPAG.',
      });
    });
  return result;
}

interface HorasExtrasListResponse {
  data: HoraExtraListItem[];
  kpis: HorasExtrasKpis;
  resumoCards: HoraExtraResumoCard[];
  fechamentoAtual: FechamentoCompetencia | null;
}

/** Ensures the API payload always conforms to a complete HorasExtrasListResponse. */
function normalizeHorasExtrasListResponse(
  payload: Partial<HorasExtrasListResponse> | null | undefined,
): HorasExtrasListResponse {
  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    kpis: {
      totalLancamentos: payload?.kpis?.totalLancamentos ?? 0,
      pendentesAprovacao: payload?.kpis?.pendentesAprovacao ?? 0,
      aprovadas: payload?.kpis?.aprovadas ?? 0,
      fechadasParaFopag: payload?.kpis?.fechadasParaFopag ?? 0,
      horasTotais: payload?.kpis?.horasTotais ?? 0,
      valorTotal: payload?.kpis?.valorTotal ?? 0,
    },
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    fechamentoAtual: payload?.fechamentoAtual ?? null,
  };
}

export async function fetchHorasExtras(filters?: HorasExtrasFiltersData): Promise<HorasExtrasListResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_API_ENDPOINTS.list, { params: filters });
      const raw = unwrapApiResponse<HorasExtrasListResponse>(response.data);
      return normalizeHorasExtrasListResponse(raw);
    },
    () => fetchHorasExtrasMock(filters),
  );
}

export async function fetchHoraExtraById(id: string): Promise<HoraExtraLancamento | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_API_ENDPOINTS.detail(id));
      return unwrapApiResponse<HoraExtraLancamento | null>(response.data);
    },
    () => fetchHoraExtraByIdMock(id),
  );
}

export async function fetchFechamentosCompetencia(): Promise<FechamentoCompetencia[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_API_ENDPOINTS.fechamentos);
      return unwrapApiResponse<FechamentoCompetencia[]>(response.data);
    },
    () => fetchFechamentosCompetenciaMock(),
  );
}

/** Ensures the API payload always conforms to a complete HorasExtrasDashboardData. */
export function normalizeHorasExtrasDashboardData(
  payload: Partial<HorasExtrasDashboardData> | null | undefined,
): HorasExtrasDashboardData {
  return {
    list: Array.isArray(payload?.list) ? payload.list : [],
    kpis: {
      totalLancamentos: payload?.kpis?.totalLancamentos ?? 0,
      pendentesAprovacao: payload?.kpis?.pendentesAprovacao ?? 0,
      aprovadas: payload?.kpis?.aprovadas ?? 0,
      fechadasParaFopag: payload?.kpis?.fechadasParaFopag ?? 0,
      horasTotais: payload?.kpis?.horasTotais ?? 0,
      valorTotal: payload?.kpis?.valorTotal ?? 0,
    },
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    fechamentoAtual: payload?.fechamentoAtual ?? null,
  };
}

export async function fetchHorasExtrasDashboard(filters?: HorasExtrasFiltersData): Promise<HorasExtrasDashboardData> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_API_ENDPOINTS.dashboard, { params: filters });
      const raw = unwrapApiResponse<HorasExtrasDashboardData>(response.data);
      return normalizeHorasExtrasDashboardData(raw);
    },
    () => fetchHorasExtrasDashboardMock(filters),
  );
}

export async function approveHoraExtra(id: string): Promise<HoraExtraMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(HORAS_EXTRAS_API_ENDPOINTS.aprovar(id));
      return unwrapApiResponse<HoraExtraMutationResponse>(response.data);
    },
    () => approveHoraExtraServiceMock(id),
  );
}

export async function fecharCompetenciaHorasExtras(competencia: string): Promise<HorasExtrasFechamentoResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(HORAS_EXTRAS_API_ENDPOINTS.fechamento, { competencia });
      return unwrapApiResponse<HorasExtrasFechamentoResponse>(response.data);
    },
    () => fecharCompetenciaHorasExtrasMock(competencia),
  );
}
