import { getMockFinanceiroDashboard } from '@/modules/financeiro/data/financeiro.mock';
import { getFopagCompetenciaDetalheMock } from '@/modules/fopag/data/fopag.mock';
import { mockHorasExtras, syncFechamentoCompetencia } from '@/modules/horas-extras/data/horas-extras.mock';
import { mockObras, normalizeObra } from '@/modules/obras/data/obras.mock';
import { mockFuncionarios } from '@/modules/rh/data/funcionarios.mock';
import { buildWorkforceFinancialSummary } from '@/shared/lib/workforceCost';

export interface ExecutiveSummaryMetricRow {
  id: string;
  label: string;
  obraNome?: string;
  centroCustoNome?: string;
  funcionarioNome?: string;
  competencia?: string;
  previsto?: number;
  realizado?: number;
  valor?: number;
  quantidade?: number;
  descricao?: string;
}

export interface ExecutiveManagementSnapshot {
  competencia: string;
  pessoal: ReturnType<typeof buildWorkforceFinancialSummary>;
  financeiro: ReturnType<typeof getMockFinanceiroDashboard>;
  fopag: NonNullable<ReturnType<typeof getFopagCompetenciaDetalheMock>>;
  horasExtras: {
    totalLancamentos: number;
    totalHoras: number;
    valorTotal: number;
    pendentesAprovacao: number;
    fechadasParaFopag: number;
    fechamentoAtual: ReturnType<typeof syncFechamentoCompetencia>;
  };
  obras: Array<ReturnType<typeof normalizeObra> & { custoPessoalPrevisto: number; custoPessoalRealizado: number; desvioFinanceiro: number }>;
  rh: {
    totalFuncionarios: number;
    ativos: number;
    emFerias: number;
    afastados: number;
    alocadosEmObra: number;
    maiorObra: string | null;
  };
}

export function buildExecutiveManagementSnapshot(competencia = '2026-03'): ExecutiveManagementSnapshot {
  const pessoal = buildWorkforceFinancialSummary(competencia);
  const financeiro = getMockFinanceiroDashboard({ competencia });
  const fopag = getFopagCompetenciaDetalheMock(competencia) ?? getFopagCompetenciaDetalheMock('2026-03');

  if (!fopag) {
    throw new Error('Competência de FOPAG não encontrada para a visão executiva.');
  }

  const horasCompetencia = mockHorasExtras.filter((item) => item.competencia === competencia);
  const horasFechadas = horasCompetencia.filter((item) => item.status === 'fechada_para_fopag' || item.status === 'enviada_para_fopag' || item.status === 'paga');
  const obras = mockObras
    .map((obra) => {
      const normalized = normalizeObra(obra);
      const pessoalObra = pessoal.porObra.find((item) => item.obraId === obra.id);
      return {
        ...normalized,
        custoPessoalPrevisto: pessoalObra?.valorPrevisto ?? 0,
        custoPessoalRealizado: pessoalObra?.valorRealizado ?? 0,
        desvioFinanceiro: normalized.orcamentoPrevisto > 0
          ? Number((((normalized.custoRealizado + normalized.custoComprometido) / normalized.orcamentoPrevisto) * 100 - normalized.percentualConcluido).toFixed(1))
          : 0,
      };
    })
    .sort((a, b) => b.custoPessoalPrevisto - a.custoPessoalPrevisto || b.custoRealizado - a.custoRealizado);

  const ativos = mockFuncionarios.filter((item) => item.status === 'ativo');
  const alocados = ativos.filter((item) => item.obraAlocadoId);
  const maiorObra = pessoal.porObra[0]?.obraNome ?? null;

  return {
    competencia,
    pessoal,
    financeiro,
    fopag,
    horasExtras: {
      totalLancamentos: horasCompetencia.length,
      totalHoras: horasCompetencia.reduce((acc, item) => acc + item.quantidadeHoras, 0),
      valorTotal: horasCompetencia.reduce((acc, item) => acc + item.valorCalculado, 0),
      pendentesAprovacao: horasCompetencia.filter((item) => item.status === 'pendente_aprovacao' || item.status === 'digitada').length,
      fechadasParaFopag: horasFechadas.length,
      fechamentoAtual: syncFechamentoCompetencia(competencia),
    },
    obras,
    rh: {
      totalFuncionarios: mockFuncionarios.length,
      ativos: ativos.length,
      emFerias: mockFuncionarios.filter((item) => item.status === 'ferias').length,
      afastados: mockFuncionarios.filter((item) => item.status === 'afastado').length,
      alocadosEmObra: alocados.length,
      maiorObra,
    },
  };
}

export function buildRelatorioGerencialRows(categoria: 'obras' | 'rh' | 'horas-extras' | 'fopag' | 'financeiro', competencia = '2026-03'): ExecutiveSummaryMetricRow[] {
  const snapshot = buildExecutiveManagementSnapshot(competencia);

  switch (categoria) {
    case 'obras':
      return snapshot.obras.slice(0, 5).map((obra) => ({
        id: obra.id,
        label: obra.nome,
        obraNome: obra.nome,
        competencia,
        previsto: obra.custoPessoalPrevisto,
        realizado: obra.custoPessoalRealizado,
        valor: obra.custoRealizado,
        descricao: `Avanço ${obra.percentualConcluido}% · desvio ${obra.desvioFinanceiro}%`,
      }));
    case 'rh':
      return mockFuncionarios
        .filter((item) => item.obraAlocadoId)
        .slice(0, 5)
        .map((funcionario) => ({
          id: funcionario.id,
          label: funcionario.nome,
          funcionarioNome: funcionario.nome,
          obraNome: funcionario.obraAlocadoNome ?? undefined,
          centroCustoNome: funcionario.centroCustoNome ?? undefined,
          valor: funcionario.salarioBase,
          descricao: `${funcionario.cargo} · ${funcionario.status}`,
        }));
    case 'horas-extras':
      return mockHorasExtras
        .filter((item) => item.competencia === competencia)
        .sort((a, b) => b.valorCalculado - a.valorCalculado)
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          label: item.funcionarioNome,
          funcionarioNome: item.funcionarioNome,
          obraNome: item.obraNome,
          centroCustoNome: item.centroCustoNome,
          quantidade: item.quantidadeHoras,
          valor: item.valorCalculado,
          descricao: `${item.tipo} · ${item.status}`,
        }));
    case 'fopag':
      return snapshot.fopag.obras.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.obraNome,
        obraNome: item.obraNome,
        competencia,
        previsto: item.valorPrevisto,
        realizado: item.valorRealizado,
        valor: item.valorHorasExtras,
        descricao: `${item.totalFuncionarios} funcionário(s) · ${item.percentualParticipacao}% da competência`,
      }));
    case 'financeiro':
      return snapshot.pessoal.porCentroCusto.slice(0, 5).map((item) => ({
        id: item.centroCustoId,
        label: item.centroCustoNome,
        obraNome: item.obraNome,
        centroCustoNome: item.centroCustoNome,
        competencia,
        previsto: item.valorPrevisto,
        realizado: item.valorRealizado,
        descricao: `${item.totalFuncionarios} funcionário(s) vinculados`,
      }));
  }
}
