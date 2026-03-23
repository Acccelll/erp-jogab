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
  const fechamentoAtual = competenciaAtiva ? syncFechamentoCompetencia(competenciaAtiva) : null;

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
  return [...new Set(mockHorasExtras.map((item) => item.competencia))].map((competencia) => syncFechamentoCompetencia(competencia));
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

export async function approveHoraExtra(id: string): Promise<HoraExtraMutationResponse> {
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

export async function fecharCompetenciaHorasExtras(competencia: string): Promise<HorasExtrasFechamentoResponse> {
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
