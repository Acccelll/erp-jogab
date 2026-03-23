import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { buildFopagCompetenciaSnapshot } from '@/shared/lib/workforceCost';
import type {
  FopagCompetenciaDetalhe,
  FopagCompetenciaListItem,
  FopagCompetenciasKpis,
  FopagResumoCard,
} from '../types';

const baseCompetencias: FopagCompetenciaListItem[] = [
  {
    id: '2026-03',
    competencia: '2026-03',
    status: 'em_consolidacao',
    totalFuncionarios: 186,
    totalObras: 12,
    totalEventos: 38,
    valorPrevisto: 1568200,
    valorRealizado: 1494300,
    valorHorasExtras: 117935,
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: '2026-02',
    competencia: '2026-02',
    status: 'fechada_prevista',
    totalFuncionarios: 179,
    totalObras: 11,
    totalEventos: 34,
    valorPrevisto: 1492800,
    valorRealizado: 1478600,
    valorHorasExtras: 84520,
    updatedAt: '2026-03-03T16:20:00.000Z',
  },
  {
    id: '2026-01',
    competencia: '2026-01',
    status: 'conciliada',
    totalFuncionarios: 172,
    totalObras: 10,
    totalEventos: 33,
    valorPrevisto: 1423500,
    valorRealizado: 1420100,
    valorHorasExtras: 79300,
    updatedAt: '2026-02-05T18:10:00.000Z',
  },
];

function buildResumoCards(competencia: FopagCompetenciaListItem, detalhe: ReturnType<typeof buildFopagCompetenciaSnapshot>): FopagResumoCard[] {
  const principalObra = detalhe.obras[0];

  return [
    {
      id: 'resumo-origem',
      titulo: 'Integrações da Competência',
      descricao: 'Leitura consolidada das principais origens da previsão mensal.',
      itens: [
        { label: 'RH cadastral', valor: `${detalhe.funcionarios.length} vínculo(s) com folha`, destaque: true },
        { label: 'Horas Extras integradas', valor: formatCurrency(detalhe.financeiro.valorHorasExtrasIntegradas) },
        { label: 'Benefícios previstos', valor: formatCurrency(detalhe.financeiro.valorBeneficios) },
        { label: 'Encargos previstos', valor: formatCurrency(detalhe.financeiro.valorEncargos) },
      ],
    },
    {
      id: 'resumo-obra',
      titulo: 'Consolidação por Obra',
      descricao: 'A folha prevista já nasce com leitura por obra e centro de custo.',
      itens: [
        { label: 'Obra com maior impacto', valor: principalObra?.obraNome ?? '—', destaque: true },
        { label: 'Participação da obra', valor: principalObra ? `${principalObra.percentualParticipacao}%` : '0%' },
        { label: 'Obras com rateio', valor: String(detalhe.obras.length) },
        { label: 'Maior origem variável', valor: 'Horas extras' },
      ],
    },
    {
      id: 'resumo-financeiro',
      titulo: 'Leitura Financeira',
      descricao: 'Sinalização preliminar do desembolso a refletir no Financeiro.',
      itens: [
        { label: 'Previsto de desembolso', valor: formatCurrency(competencia.valorPrevisto), destaque: true },
        { label: 'Realizado até o momento', valor: formatCurrency(competencia.valorRealizado) },
        { label: 'Diferença', valor: formatCurrency(competencia.valorPrevisto - competencia.valorRealizado) },
        { label: 'Próximo marco', valor: competencia.status === 'fechada_prevista' ? 'Rateio consolidado' : 'Fechar rateio da competência' },
      ],
    },
  ];
}

export function getFopagCompetenciasMock() {
  return baseCompetencias.map((item) => {
    const snapshot = buildFopagCompetenciaSnapshot(item.competencia);
    return {
      ...item,
      totalFuncionarios: Math.max(item.totalFuncionarios, snapshot.meta.totalFuncionarios),
      totalObras: Math.max(item.totalObras, snapshot.meta.totalObras),
      totalEventos: Math.max(item.totalEventos, snapshot.meta.totalEventos),
      valorPrevisto: Math.max(item.valorPrevisto, snapshot.meta.valorPrevisto),
      valorRealizado: Math.max(item.valorRealizado, snapshot.meta.valorRealizado),
      valorHorasExtras: snapshot.meta.valorHorasExtras,
      updatedAt: new Date().toISOString(),
    };
  });
}

export function getFopagCompetenciaDetalheMock(competenciaId: string): FopagCompetenciaDetalhe | null {
  const competencia = getFopagCompetenciasMock().find((item) => item.id === competenciaId);
  if (!competencia) return null;

  const snapshot = buildFopagCompetenciaSnapshot(competenciaId);

  return {
    competencia,
    resumoCards: buildResumoCards(competencia, snapshot),
    funcionarios: snapshot.funcionarios,
    obras: snapshot.obras,
    eventos: snapshot.eventos,
    rateios: snapshot.rateios,
    financeiro: snapshot.financeiro,
    previstoRealizado: snapshot.previstoRealizado,
  };
}

export function calcularFopagCompetenciasKpis(items: FopagCompetenciaListItem[]): FopagCompetenciasKpis {
  return {
    totalCompetencias: items.length,
    emConsolidacao: items.filter((item) => item.status === 'em_consolidacao').length,
    prontasParaRateio: items.filter((item) => item.status === 'pronta_para_rateio').length,
    valorPrevistoTotal: items.reduce((total, item) => total + item.valorPrevisto, 0),
    valorRealizadoTotal: items.reduce((total, item) => total + item.valorRealizado, 0),
  };
}

export function gerarCompetenciaResumoListItem(item: FopagCompetenciaListItem): FopagResumoCard {
  return {
    id: `resumo-${item.id}`,
    titulo: `Competência ${formatCompetencia(item.competencia)}`,
    descricao: 'Resumo rápido da consolidação da folha prevista e sua leitura financeira.',
    itens: [
      { label: 'Status', valor: item.status, destaque: true },
      { label: 'Funcionários', valor: `${item.totalFuncionarios}` },
      { label: 'Obras impactadas', valor: `${item.totalObras}` },
      { label: 'Horas extras integradas', valor: formatCurrency(item.valorHorasExtras) },
    ],
  };
}
