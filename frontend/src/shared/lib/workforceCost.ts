import { getAlocacaoAtivaByFuncionarioId, getAlocacoesAtivasByObraId, getCentroCustoById } from '@/shared/lib/erpRelations';
import { mockHorasExtras } from '@/modules/horas-extras/data/horas-extras.mock';
import { mockFuncionarios } from '@/modules/rh/data/funcionarios.mock';

const HE_ELIGIVEIS_FOPAG = new Set(['aprovada', 'fechada_para_fopag', 'enviada_para_fopag', 'paga']);
const HE_INTEGRADAS_FOPAG = new Set(['fechada_para_fopag', 'enviada_para_fopag', 'paga']);


export interface WorkforceCostByCenterSnapshot {
  centroCustoId: string;
  centroCustoNome: string;
  obraId: string;
  obraNome: string;
  totalFuncionarios: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface WorkforceCostByObraSnapshot {
  obraId: string;
  obraNome: string;
  totalFuncionarios: number;
  totalCentrosCusto: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface WorkforceCostSummarySnapshot {
  competencia: string;
  totalFuncionarios: number;
  totalObras: number;
  totalCentrosCusto: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
  variacao: number;
  statusFechamento: 'aberta' | 'parcial' | 'fechada';
  porObra: WorkforceCostByObraSnapshot[];
  porCentroCusto: WorkforceCostByCenterSnapshot[];
  origemHorasExtras: {
    totalLancamentos: number;
    totalLancamentosElegiveis: number;
    totalLancamentosIntegrados: number;
  };
}

function getFuncionarioById(funcionarioId: string) {
  return mockFuncionarios.find((funcionario) => funcionario.id === funcionarioId) ?? null;
}

function getHorasExtrasByCompetencia(competencia: string) {
  return mockHorasExtras.filter((item) => item.competencia === competencia);
}

function getHorasExtrasElegiveisFopag(competencia: string) {
  return getHorasExtrasByCompetencia(competencia).filter((item) => HE_ELIGIVEIS_FOPAG.has(item.status));
}

function getHorasExtrasIntegradasFopag(competencia: string) {
  return getHorasExtrasByCompetencia(competencia).filter((item) => HE_INTEGRADAS_FOPAG.has(item.status));
}

export function buildFopagCompetenciaSnapshot(competencia: string) {
  const horasExtras = getHorasExtrasElegiveisFopag(competencia);
  const horasIntegradas = getHorasExtrasIntegradasFopag(competencia);
  const funcionariosMap = new Map<string, {
    funcionarioId: string;
    funcionarioNome: string;
    matricula: string;
    cargo: string;
    obraPrincipalId: string;
    obraPrincipalNome: string;
    salarioBase: number;
    horasExtrasValor: number;
    beneficiosValor: number;
    descontosValor: number;
    valorPrevisto: number;
    valorRealizado: number;
  }>();

  horasExtras.forEach((item) => {
    const funcionario = getFuncionarioById(item.funcionarioId);
    const alocacaoAtiva = getAlocacaoAtivaByFuncionarioId(item.funcionarioId);
    const base = funcionariosMap.get(item.funcionarioId) ?? {
      funcionarioId: item.funcionarioId,
      funcionarioNome: funcionario?.nome ?? item.funcionarioNome,
      matricula: funcionario?.matricula ?? item.matricula,
      cargo: funcionario?.cargo ?? item.cargo,
      obraPrincipalId: alocacaoAtiva?.obraId ?? item.obraId,
      obraPrincipalNome: alocacaoAtiva?.obraNome ?? item.obraNome,
      salarioBase: funcionario?.salarioBase ?? Math.round(item.valorCalculado * 12),
      horasExtrasValor: 0,
      beneficiosValor: funcionario ? Math.round(funcionario.salarioBase * 0.12) : 480,
      descontosValor: funcionario ? Math.round(funcionario.salarioBase * 0.05) : 180,
      valorPrevisto: 0,
      valorRealizado: 0,
    };

    base.horasExtrasValor += item.valorCalculado;
    base.valorPrevisto = base.salarioBase + base.horasExtrasValor + base.beneficiosValor - base.descontosValor;
    base.valorRealizado = Math.round(base.valorPrevisto * 0.985 * 100) / 100;
    funcionariosMap.set(item.funcionarioId, base);
  });

  const funcionarios = [...funcionariosMap.values()].map((item, index) => ({ id: `fopag-func-${index + 1}`, ...item }));

  const obrasMap = new Map<string, { obraId: string; obraNome: string; totalFuncionarios: number; valorPrevisto: number; valorRealizado: number; valorHorasExtras: number }>();
  funcionarios.forEach((item) => {
    const obra = obrasMap.get(item.obraPrincipalId) ?? {
      obraId: item.obraPrincipalId,
      obraNome: item.obraPrincipalNome,
      totalFuncionarios: 0,
      valorPrevisto: 0,
      valorRealizado: 0,
      valorHorasExtras: 0,
    };
    obra.totalFuncionarios += 1;
    obra.valorPrevisto += item.valorPrevisto;
    obra.valorRealizado += item.valorRealizado;
    obra.valorHorasExtras += item.horasExtrasValor;
    obrasMap.set(item.obraPrincipalId, obra);
  });

  const totalPrevistoObras = [...obrasMap.values()].reduce((acc, item) => acc + item.valorPrevisto, 0);
  const obras = [...obrasMap.values()].map((item, index) => ({
    id: `fopag-obra-${index + 1}`,
    ...item,
    percentualParticipacao: totalPrevistoObras > 0 ? Math.round((item.valorPrevisto / totalPrevistoObras) * 1000) / 10 : 0,
  }));

  const rateiosMap = new Map<string, { centroCustoNome: string; obraNome: string; percentual: number; valorPrevisto: number }>();
  horasExtras.forEach((item) => {
    const centro = getCentroCustoById(item.centroCustoId);
    const key = `${item.obraId}:${item.centroCustoId}`;
    const current = rateiosMap.get(key) ?? {
      centroCustoNome: centro?.nome ?? item.centroCustoNome,
      obraNome: item.obraNome,
      percentual: 0,
      valorPrevisto: 0,
    };
    current.percentual += 1;
    current.valorPrevisto += item.valorCalculado;
    rateiosMap.set(key, current);
  });

  const totalEventos = horasExtras.length;
  const valorSalarioBase = funcionarios.reduce((acc, item) => acc + item.salarioBase, 0);
  const valorHorasExtras = horasExtras.reduce((acc, item) => acc + item.valorCalculado, 0);
  const valorHorasExtrasIntegradas = horasIntegradas.reduce((acc, item) => acc + item.valorCalculado, 0);
  const valorBeneficios = funcionarios.reduce((acc, item) => acc + item.beneficiosValor, 0);
  const valorDescontos = funcionarios.reduce((acc, item) => acc + item.descontosValor, 0);
  const valorEncargos = Math.round((valorSalarioBase + valorHorasExtras) * 0.22 * 100) / 100;
  const valorPrevisto = valorSalarioBase + valorHorasExtras + valorBeneficios + valorEncargos - valorDescontos;
  const valorRealizado = Math.round(valorPrevisto * 0.975 * 100) / 100;

  return {
    funcionarios,
    obras,
    rateios: [...rateiosMap.values()].map((item, index) => ({
      id: `rat-${index + 1}`,
      centroCustoNome: item.centroCustoNome,
      obraNome: item.obraNome,
      criterio: 'Rateio por horas extras aprovadas/fechadas',
      percentual: horasExtras.length > 0 ? Math.round((item.percentual / horasExtras.length) * 1000) / 10 : 0,
      valorPrevisto: item.valorPrevisto,
    })),
    eventos: [
      { id: 'evt-sal', codigo: 'SAL', nome: 'Salário Base', tipo: 'provento' as const, origem: 'rh' as const, quantidadeLancamentos: funcionarios.length, valorPrevisto: valorSalarioBase, valorRealizado: Math.round(valorSalarioBase * 0.998 * 100) / 100 },
      { id: 'evt-he', codigo: 'HE', nome: 'Horas Extras', tipo: 'provento' as const, origem: 'horas_extras' as const, quantidadeLancamentos: totalEventos, valorPrevisto: valorHorasExtras, valorRealizado: valorHorasExtrasIntegradas },
      { id: 'evt-ben', codigo: 'BEN', nome: 'Benefícios', tipo: 'provento' as const, origem: 'beneficios' as const, quantidadeLancamentos: funcionarios.length, valorPrevisto: valorBeneficios, valorRealizado: Math.round(valorBeneficios * 0.99 * 100) / 100 },
      { id: 'evt-enc', codigo: 'ENC', nome: 'Encargos', tipo: 'encargo' as const, origem: 'provisoes' as const, quantidadeLancamentos: funcionarios.length, valorPrevisto: valorEncargos, valorRealizado: Math.round(valorEncargos * 0.985 * 100) / 100 },
    ],
    financeiro: {
      valorPrevistoDesembolso: valorPrevisto,
      valorRealizadoDesembolso: valorRealizado,
      valorEncargos,
      valorBeneficios,
      valorHorasExtrasIntegradas,
      principalSaida: obras[0]?.obraNome ? `Folha operacional com maior impacto em ${obras[0].obraNome}` : 'Folha operacional das obras ativas',
    },
    previstoRealizado: [
      { id: 'pr-sal', categoria: 'Salário Base', valorPrevisto: valorSalarioBase, valorRealizado: Math.round(valorSalarioBase * 0.998 * 100) / 100 },
      { id: 'pr-he', categoria: 'Horas Extras', valorPrevisto: valorHorasExtras, valorRealizado: valorHorasExtrasIntegradas },
      { id: 'pr-ben', categoria: 'Benefícios', valorPrevisto: valorBeneficios, valorRealizado: Math.round(valorBeneficios * 0.99 * 100) / 100 },
      { id: 'pr-enc', categoria: 'Encargos', valorPrevisto: valorEncargos, valorRealizado: Math.round(valorEncargos * 0.985 * 100) / 100 },
    ],
    meta: {
      totalFuncionarios: funcionarios.length,
      totalObras: obras.length,
      totalEventos: totalEventos + funcionarios.length * 3,
      valorPrevisto,
      valorRealizado,
      valorHorasExtras: valorHorasExtrasIntegradas,
    },
  };
}

export function getObraLaborCostSnapshot(obraId: string, competencia = '2026-03') {
  const fopag = buildFopagCompetenciaSnapshot(competencia);
  const horasExtrasObra = getHorasExtrasByCompetencia(competencia).filter((item) => item.obraId === obraId);
  const horasExtrasIntegradas = horasExtrasObra.filter((item) => HE_ELIGIVEIS_FOPAG.has(item.status));
  const obraFolha = fopag.obras.find((item) => item.obraId === obraId);
  const equipeAtiva = getAlocacoesAtivasByObraId(obraId).length;

  return {
    competencia,
    equipeAtiva,
    totalHorasExtras: horasExtrasObra.reduce((acc, item) => acc + item.quantidadeHoras, 0),
    custoHorasExtras: horasExtrasIntegradas.reduce((acc, item) => acc + item.valorCalculado, 0),
    fopagPrevista: obraFolha?.valorPrevisto ?? 0,
    fopagRealizada: obraFolha?.valorRealizado ?? 0,
    custoTotalPessoal: (obraFolha?.valorPrevisto ?? 0) + horasExtrasIntegradas.reduce((acc, item) => acc + item.valorCalculado, 0),
  };
}


export function buildWorkforceFinancialSummary(competencia: string): WorkforceCostSummarySnapshot {
  const fopag = buildFopagCompetenciaSnapshot(competencia);
  const horasCompetencia = getHorasExtrasByCompetencia(competencia);
  const horasElegiveis = horasCompetencia.filter((item) => HE_ELIGIVEIS_FOPAG.has(item.status));
  const horasIntegradas = horasCompetencia.filter((item) => HE_INTEGRADAS_FOPAG.has(item.status));
  const centrosMap = new Map<string, WorkforceCostByCenterSnapshot>();
  const obraEquipeMap = new Map<string, Set<string>>();

  horasElegiveis.forEach((item) => {
    const alocacaoAtiva = getAlocacaoAtivaByFuncionarioId(item.funcionarioId);
    const centro = getCentroCustoById(alocacaoAtiva?.centroCustoId ?? item.centroCustoId);
    const key = centro?.id ?? item.centroCustoId;
    const current = centrosMap.get(key) ?? {
      centroCustoId: centro?.id ?? item.centroCustoId,
      centroCustoNome: centro?.nome ?? item.centroCustoNome,
      obraId: centro?.obraId ?? item.obraId,
      obraNome: centro?.obraNome ?? item.obraNome,
      totalFuncionarios: 0,
      valorHorasExtrasPrevisto: 0,
      valorHorasExtrasRealizado: 0,
      valorFopagPrevisto: 0,
      valorFopagRealizado: 0,
      valorPrevisto: 0,
      valorRealizado: 0,
    };

    current.valorHorasExtrasPrevisto += item.valorCalculado;
    if (HE_INTEGRADAS_FOPAG.has(item.status)) {
      current.valorHorasExtrasRealizado += item.valorCalculado;
    }
    centrosMap.set(key, current);

    const equipe = obraEquipeMap.get(current.obraId) ?? new Set();
    equipe.add(item.funcionarioId);
    obraEquipeMap.set(current.obraId, equipe);
  });

  fopag.funcionarios.forEach((item) => {
    const alocacaoAtiva = getAlocacaoAtivaByFuncionarioId(item.funcionarioId);
    const centro = getCentroCustoById(alocacaoAtiva?.centroCustoId);
    const key = centro?.id ?? `sem-centro:${item.obraPrincipalId}`;
    const current = centrosMap.get(key) ?? {
      centroCustoId: centro?.id ?? 'sem-centro-custo',
      centroCustoNome: centro?.nome ?? `Centro de custo principal — ${item.obraPrincipalNome}`,
      obraId: centro?.obraId ?? item.obraPrincipalId,
      obraNome: centro?.obraNome ?? item.obraPrincipalNome,
      totalFuncionarios: 0,
      valorHorasExtrasPrevisto: 0,
      valorHorasExtrasRealizado: 0,
      valorFopagPrevisto: 0,
      valorFopagRealizado: 0,
      valorPrevisto: 0,
      valorRealizado: 0,
    };

    current.totalFuncionarios += 1;
    current.valorFopagPrevisto += item.valorPrevisto;
    current.valorFopagRealizado += item.valorRealizado;
    current.valorPrevisto = current.valorFopagPrevisto + current.valorHorasExtrasPrevisto;
    current.valorRealizado = current.valorFopagRealizado + current.valorHorasExtrasRealizado;
    centrosMap.set(key, current);

    const equipe = obraEquipeMap.get(current.obraId) ?? new Set();
    equipe.add(item.funcionarioId);
    obraEquipeMap.set(current.obraId, equipe);
  });

  const porCentroCusto = [...centrosMap.values()]
    .map((item) => ({
      ...item,
      valorPrevisto: item.valorFopagPrevisto + item.valorHorasExtrasPrevisto,
      valorRealizado: item.valorFopagRealizado + item.valorHorasExtrasRealizado,
    }))
    .sort((a, b) => b.valorPrevisto - a.valorPrevisto);

  const obrasMap = new Map<string, WorkforceCostByObraSnapshot>();
  porCentroCusto.forEach((item) => {
    const current = obrasMap.get(item.obraId) ?? {
      obraId: item.obraId,
      obraNome: item.obraNome,
      totalFuncionarios: obraEquipeMap.get(item.obraId)?.size ?? 0,
      totalCentrosCusto: 0,
      valorHorasExtrasPrevisto: 0,
      valorHorasExtrasRealizado: 0,
      valorFopagPrevisto: 0,
      valorFopagRealizado: 0,
      valorPrevisto: 0,
      valorRealizado: 0,
    };

    current.totalCentrosCusto += 1;
    current.valorHorasExtrasPrevisto += item.valorHorasExtrasPrevisto;
    current.valorHorasExtrasRealizado += item.valorHorasExtrasRealizado;
    current.valorFopagPrevisto += item.valorFopagPrevisto;
    current.valorFopagRealizado += item.valorFopagRealizado;
    current.valorPrevisto += item.valorPrevisto;
    current.valorRealizado += item.valorRealizado;
    obrasMap.set(item.obraId, current);
  });

  const porObra = [...obrasMap.values()].sort((a, b) => b.valorPrevisto - a.valorPrevisto);
  const valorHorasExtrasPrevisto = horasElegiveis.reduce((acc, item) => acc + item.valorCalculado, 0);
  const valorHorasExtrasRealizado = horasIntegradas.reduce((acc, item) => acc + item.valorCalculado, 0);
  const valorFopagPrevisto = fopag.financeiro.valorPrevistoDesembolso;
  const valorFopagRealizado = fopag.financeiro.valorRealizadoDesembolso;
  const valorPrevisto = porCentroCusto.reduce((acc, item) => acc + item.valorPrevisto, 0);
  const valorRealizado = porCentroCusto.reduce((acc, item) => acc + item.valorRealizado, 0);

  return {
    competencia,
    totalFuncionarios: fopag.funcionarios.length,
    totalObras: porObra.length,
    totalCentrosCusto: porCentroCusto.length,
    valorHorasExtrasPrevisto,
    valorHorasExtrasRealizado,
    valorFopagPrevisto,
    valorFopagRealizado,
    valorPrevisto,
    valorRealizado,
    variacao: valorPrevisto - valorRealizado,
    statusFechamento:
      horasElegiveis.length === 0
        ? 'aberta'
        : horasElegiveis.length === horasIntegradas.length
          ? 'fechada'
          : 'parcial',
    porObra,
    porCentroCusto,
    origemHorasExtras: {
      totalLancamentos: horasCompetencia.length,
      totalLancamentosElegiveis: horasElegiveis.length,
      totalLancamentosIntegrados: horasIntegradas.length,
    },
  };
}
