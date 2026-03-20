import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FopagCompetenciaDetalhe,
  FopagCompetenciaListItem,
  FopagCompetenciasKpis,
  FopagResumoCard,
} from '../types';

export const mockFopagCompetencias: FopagCompetenciaListItem[] = [
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

export const mockFopagDetalhes: Record<string, FopagCompetenciaDetalhe> = {
  '2026-03': {
    competencia: mockFopagCompetencias[0],
    resumoCards: [
      {
        id: 'resumo-origem',
        titulo: 'Integrações da Competência',
        descricao: 'Leitura consolidada das principais origens da previsão mensal.',
        itens: [
          { label: 'RH cadastral', valor: 'Base de vínculos ativa', destaque: true },
          { label: 'Horas Extras integradas', valor: formatCurrency(117935) },
          { label: 'Benefícios previstos', valor: formatCurrency(186400) },
          { label: 'Encargos previstos', valor: formatCurrency(248120) },
        ],
      },
      {
        id: 'resumo-obra',
        titulo: 'Consolidação por Obra',
        descricao: 'A folha prevista já nasce com leitura por obra e centro de custo.',
        itens: [
          { label: 'Obra com maior impacto', valor: 'Edifício Aurora', destaque: true },
          { label: 'Participação da obra', valor: '19,4%' },
          { label: 'Obras com rateio', valor: '12' },
          { label: 'Maior origem variável', valor: 'Horas extras' },
        ],
      },
      {
        id: 'resumo-financeiro',
        titulo: 'Leitura Financeira',
        descricao: 'Sinalização preliminar do desembolso a refletir no Financeiro.',
        itens: [
          { label: 'Previsto de desembolso', valor: formatCurrency(1568200), destaque: true },
          { label: 'Realizado até o momento', valor: formatCurrency(1494300) },
          { label: 'Diferença', valor: formatCurrency(73900) },
          { label: 'Próximo marco', valor: 'Fechar rateio da competência' },
        ],
      },
    ],
    funcionarios: [
      {
        id: 'fopag-func-1', funcionarioId: 'func-1', funcionarioNome: 'Lucas Andrade', matricula: 'RH-001', cargo: 'Encarregado',
        obraPrincipalId: 'obra-1', obraPrincipalNome: 'Edifício Aurora', salarioBase: 6200, horasExtrasValor: 286.4, beneficiosValor: 980, descontosValor: 420, valorPrevisto: 7046.4, valorRealizado: 6912.1,
      },
      {
        id: 'fopag-func-2', funcionarioId: 'func-2', funcionarioNome: 'Mariana Costa', matricula: 'RH-014', cargo: 'Técnica de Segurança',
        obraPrincipalId: 'obra-1', obraPrincipalNome: 'Edifício Aurora', salarioBase: 4900, horasExtrasValor: 154.2, beneficiosValor: 740, descontosValor: 310, valorPrevisto: 5484.2, valorRealizado: 5400,
      },
      {
        id: 'fopag-func-3', funcionarioId: 'func-3', funcionarioNome: 'João Pedro Lima', matricula: 'RH-022', cargo: 'Pedreiro',
        obraPrincipalId: 'obra-2', obraPrincipalNome: 'Residencial Parque', salarioBase: 3100, horasExtrasValor: 398.7, beneficiosValor: 520, descontosValor: 210, valorPrevisto: 3808.7, valorRealizado: 3754.4,
      },
    ],
    obras: [
      { id: 'fopag-obra-1', obraId: 'obra-1', obraNome: 'Edifício Aurora', totalFuncionarios: 36, valorPrevisto: 304100, valorRealizado: 292800, valorHorasExtras: 26400, percentualParticipacao: 19.4 },
      { id: 'fopag-obra-2', obraId: 'obra-2', obraNome: 'Residencial Parque', totalFuncionarios: 29, valorPrevisto: 246300, valorRealizado: 239100, valorHorasExtras: 18200, percentualParticipacao: 15.7 },
      { id: 'fopag-obra-3', obraId: 'obra-4', obraNome: 'Ponte BR-101', totalFuncionarios: 31, valorPrevisto: 272900, valorRealizado: 261500, valorHorasExtras: 34100, percentualParticipacao: 17.4 },
    ],
    eventos: [
      { id: 'evt-1', codigo: 'SAL', nome: 'Salário Base', tipo: 'provento', origem: 'rh', quantidadeLancamentos: 186, valorPrevisto: 1086200, valorRealizado: 1081200 },
      { id: 'evt-2', codigo: 'HE', nome: 'Horas Extras', tipo: 'provento', origem: 'horas_extras', quantidadeLancamentos: 27, valorPrevisto: 117935, valorRealizado: 109740 },
      { id: 'evt-3', codigo: 'BEN', nome: 'Benefícios', tipo: 'provento', origem: 'beneficios', quantidadeLancamentos: 186, valorPrevisto: 186400, valorRealizado: 184900 },
      { id: 'evt-4', codigo: 'ENC', nome: 'Encargos', tipo: 'encargo', origem: 'provisoes', quantidadeLancamentos: 186, valorPrevisto: 248120, valorRealizado: 242180 },
    ],
    rateios: [
      { id: 'rat-1', centroCustoNome: 'Estrutura', obraNome: 'Edifício Aurora', criterio: 'Alocação principal', percentual: 100, valorPrevisto: 158200 },
      { id: 'rat-2', centroCustoNome: 'Acabamento', obraNome: 'Residencial Parque', criterio: 'Rateio por apontamento', percentual: 72, valorPrevisto: 112300 },
      { id: 'rat-3', centroCustoNome: 'Instalações', obraNome: 'Ponte BR-101', criterio: 'Rateio por equipe', percentual: 68, valorPrevisto: 128500 },
    ],
    financeiro: {
      valorPrevistoDesembolso: 1568200,
      valorRealizadoDesembolso: 1494300,
      valorEncargos: 248120,
      valorBeneficios: 186400,
      valorHorasExtrasIntegradas: 117935,
      principalSaida: 'Folha operacional das obras em execução',
    },
    previstoRealizado: [
      { id: 'pr-1', categoria: 'Salário Base', valorPrevisto: 1086200, valorRealizado: 1081200 },
      { id: 'pr-2', categoria: 'Horas Extras', valorPrevisto: 117935, valorRealizado: 109740 },
      { id: 'pr-3', categoria: 'Benefícios', valorPrevisto: 186400, valorRealizado: 184900 },
      { id: 'pr-4', categoria: 'Encargos', valorPrevisto: 248120, valorRealizado: 242180 },
    ],
  },
};

mockFopagDetalhes['2026-02'] = {
  ...mockFopagDetalhes['2026-03'],
  competencia: mockFopagCompetencias[1],
  resumoCards: mockFopagDetalhes['2026-03'].resumoCards.map((card) => ({
    ...card,
    itens: card.itens.map((item) => ({ ...item })),
  })),
  financeiro: {
    valorPrevistoDesembolso: 1492800,
    valorRealizadoDesembolso: 1478600,
    valorEncargos: 237900,
    valorBeneficios: 181600,
    valorHorasExtrasIntegradas: 84520,
    principalSaida: 'Folha consolidada com menor exposição variável',
  },
  previstoRealizado: [
    { id: 'pr-1', categoria: 'Salário Base', valorPrevisto: 1049800, valorRealizado: 1047500 },
    { id: 'pr-2', categoria: 'Horas Extras', valorPrevisto: 84520, valorRealizado: 84210 },
    { id: 'pr-3', categoria: 'Benefícios', valorPrevisto: 181600, valorRealizado: 180950 },
    { id: 'pr-4', categoria: 'Encargos', valorPrevisto: 237900, valorRealizado: 236100 },
  ],
};

mockFopagDetalhes['2026-01'] = {
  ...mockFopagDetalhes['2026-03'],
  competencia: mockFopagCompetencias[2],
  financeiro: {
    valorPrevistoDesembolso: 1423500,
    valorRealizadoDesembolso: 1420100,
    valorEncargos: 229700,
    valorBeneficios: 175200,
    valorHorasExtrasIntegradas: 79300,
    principalSaida: 'Competência já conciliada com Financeiro',
  },
  previstoRealizado: [
    { id: 'pr-1', categoria: 'Salário Base', valorPrevisto: 1001200, valorRealizado: 1000300 },
    { id: 'pr-2', categoria: 'Horas Extras', valorPrevisto: 79300, valorRealizado: 79010 },
    { id: 'pr-3', categoria: 'Benefícios', valorPrevisto: 175200, valorRealizado: 174900 },
    { id: 'pr-4', categoria: 'Encargos', valorPrevisto: 229700, valorRealizado: 228890 },
  ],
};

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
