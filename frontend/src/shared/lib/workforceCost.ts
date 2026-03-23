import { getAlocacaoAtivaByFuncionarioId, getAlocacoesAtivasByObraId, getCentroCustoById } from '@/shared/lib/erpRelations';
import { mockHorasExtras } from '@/modules/horas-extras/data/horas-extras.mock';
import { mockFuncionarios } from '@/modules/rh/data/funcionarios.mock';

const HE_ELIGIVEIS_FOPAG = new Set(['aprovada', 'fechada_para_fopag', 'enviada_para_fopag', 'paga']);
const HE_INTEGRADAS_FOPAG = new Set(['fechada_para_fopag', 'enviada_para_fopag', 'paga']);

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

export function buildWorkforceFinancialSummary(competencia: string) {
  const fopag = buildFopagCompetenciaSnapshot(competencia);
  const horasExtras = getHorasExtrasElegiveisFopag(competencia);
  const horasIntegradas = getHorasExtrasIntegradasFopag(competencia);

  const porObra = fopag.obras.map((obra) => {
    const heObra = horasExtras.filter((h) => h.obraId === obra.obraId);
    const heIntegradas = horasIntegradas.filter((h) => h.obraId === obra.obraId);
    const centrosCusto = new Set(heObra.map((h) => h.centroCustoId));
    const valorHorasExtrasPrevisto = heObra.reduce((acc, h) => acc + h.valorCalculado, 0);
    const valorHorasExtrasRealizado = heIntegradas.reduce((acc, h) => acc + h.valorCalculado, 0);
    return {
      obraId: obra.obraId,
      obraNome: obra.obraNome,
      totalFuncionarios: obra.totalFuncionarios,
      totalCentrosCusto: centrosCusto.size || 1,
      valorFopagPrevisto: obra.valorPrevisto,
      valorFopagRealizado: obra.valorRealizado,
      valorHorasExtrasPrevisto,
      valorHorasExtrasRealizado,
      valorPrevisto: obra.valorPrevisto + valorHorasExtrasPrevisto,
      valorRealizado: obra.valorRealizado + valorHorasExtrasRealizado,
      valorHorasExtras: valorHorasExtrasRealizado,
      percentualParticipacao: obra.percentualParticipacao,
    };
  });

  const porCentroCusto = fopag.rateios.map((rateio, index) => ({
    centroCustoId: `cc-rateio-${index + 1}`,
    centroCustoNome: rateio.centroCustoNome,
    obraNome: rateio.obraNome,
    totalFuncionarios: fopag.funcionarios.filter((f) => f.obraPrincipalNome === rateio.obraNome).length,
    valorPrevisto: rateio.valorPrevisto,
    valorRealizado: Math.round(rateio.valorPrevisto * 0.975 * 100) / 100,
  }));

  const valorFopagPrevisto = fopag.meta.valorPrevisto;
  const valorFopagRealizado = fopag.meta.valorRealizado;
  const valorHorasExtrasPrevisto = horasExtras.reduce((acc, h) => acc + h.valorCalculado, 0);
  const valorHorasExtrasRealizado = horasIntegradas.reduce((acc, h) => acc + h.valorCalculado, 0);
  const valorPrevisto = valorFopagPrevisto + valorHorasExtrasPrevisto;
  const valorRealizado = valorFopagRealizado + valorHorasExtrasRealizado;

  return {
    competencia,
    totalFuncionarios: fopag.meta.totalFuncionarios,
    totalObras: fopag.meta.totalObras,
    totalCentrosCusto: porCentroCusto.length,
    valorFopagPrevisto,
    valorFopagRealizado,
    valorHorasExtrasPrevisto,
    valorHorasExtrasRealizado,
    valorPrevisto,
    valorRealizado,
    variacao: valorPrevisto - valorRealizado,
    statusFechamento: horasIntegradas.length > 0 ? 'fechada' : 'aberta',
    origemHorasExtras: {
      totalLancamentos: horasExtras.length,
      totalLancamentosElegiveis: horasExtras.length,
      totalLancamentosIntegrados: horasIntegradas.length,
    },
    porObra,
    porCentroCusto,
  };
}
