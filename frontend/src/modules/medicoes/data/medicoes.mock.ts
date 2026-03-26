import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  Medicao,
  MedicaoDetalheData,
  MedicoesCompetenciaResumo,
  MedicoesDashboardData,
  MedicoesFiltersData,
  MedicoesKpis,
  MedicoesResumoCardData,
  MedicoesStatusResumo,
} from '../types';
import {
  MEDICAO_APROVACAO_LABELS,
  MEDICAO_FATURAMENTO_LABELS,
  MEDICAO_STATUS_LABELS,
} from '../types';

const medicoes: Medicao[] = [
  {
    id: 'med-001', codigo: 'MED-2026-001', numeroMedicao: 7, obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', contratoId: 'ctr-088', contratoCodigo: 'CTR-088', clienteNome: 'Parque SPE', competencia: '2026-03', periodoInicio: '2026-03-01', periodoFim: '2026-03-15', status: 'em_aprovacao', origem: 'contrato', aprovacaoStatus: 'pendente_cliente', faturamentoStatus: 'preparado', percentualAvanco: 63, valorContrato: 4820000, resumoFinanceiro: { valorMedido: 245000, valorRetido: 12250, valorLiberadoFaturamento: 232750, valorFaturado: 0, valorRecebido: 0, tituloFinanceiroCodigo: 'TIT-2026-003' }, centroCusto: 'CC-FAT-OBR', responsavelNome: 'Bianca Tavares', updatedAt: '2026-03-20',
  },
  {
    id: 'med-002', codigo: 'MED-2026-002', numeroMedicao: 11, obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', contratoId: 'ctr-041', contratoCodigo: 'CTR-041', clienteNome: 'Aurora Desenvolvimento', competencia: '2026-03', periodoInicio: '2026-03-01', periodoFim: '2026-03-10', status: 'faturada', origem: 'aditivo', aprovacaoStatus: 'aprovada', faturamentoStatus: 'emitido', percentualAvanco: 71, valorContrato: 6350000, resumoFinanceiro: { valorMedido: 318400, valorRetido: 15920, valorLiberadoFaturamento: 302480, valorFaturado: 302480, valorRecebido: 121000, tituloFinanceiroCodigo: 'TIT-2026-010' }, centroCusto: 'CC-CON-REC', responsavelNome: 'Leandro Costa', updatedAt: '2026-03-18',
  },
  {
    id: 'med-003', codigo: 'MED-2026-003', numeroMedicao: 4, obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', contratoId: 'ctr-102', contratoCodigo: 'CTR-102', clienteNome: 'DNIT', competencia: '2026-02', periodoInicio: '2026-02-16', periodoFim: '2026-02-28', status: 'aprovada', origem: 'obra', aprovacaoStatus: 'aprovada', faturamentoStatus: 'nao_iniciado', percentualAvanco: 29, valorContrato: 12300000, resumoFinanceiro: { valorMedido: 412800, valorRetido: 20640, valorLiberadoFaturamento: 392160, valorFaturado: 0, valorRecebido: 0 }, centroCusto: 'CC-INF-MED', responsavelNome: 'Tatiane Prado', updatedAt: '2026-03-05',
  },
  {
    id: 'med-004', codigo: 'MED-2026-004', numeroMedicao: 2, obraId: 'obra-3', obraNome: 'OBR-003 — Torre Empresarial', contratoId: 'ctr-073', contratoCodigo: 'CTR-073', clienteNome: 'Empresarial Prime', competencia: '2026-03', periodoInicio: '2026-03-05', periodoFim: '2026-03-20', status: 'em_elaboracao', origem: 'contrato', aprovacaoStatus: 'pendente_engenharia', faturamentoStatus: 'nao_iniciado', percentualAvanco: 18, valorContrato: 5800000, resumoFinanceiro: { valorMedido: 98000, valorRetido: 4900, valorLiberadoFaturamento: 93100, valorFaturado: 0, valorRecebido: 0 }, centroCusto: 'CC-OBR-MED', responsavelNome: 'Paulo Mendes', updatedAt: '2026-03-21',
  },
  {
    id: 'med-005', codigo: 'MED-2026-005', numeroMedicao: 9, obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', contratoId: 'ctr-088', contratoCodigo: 'CTR-088', clienteNome: 'Parque SPE', competencia: '2026-01', periodoInicio: '2026-01-16', periodoFim: '2026-01-31', status: 'faturada_parcial', origem: 'ajuste', aprovacaoStatus: 'aprovada', faturamentoStatus: 'recebido', percentualAvanco: 48, valorContrato: 4820000, resumoFinanceiro: { valorMedido: 205500, valorRetido: 10275, valorLiberadoFaturamento: 195225, valorFaturado: 150000, valorRecebido: 150000, tituloFinanceiroCodigo: 'TIT-2026-011' }, centroCusto: 'CC-FAT-OBR', responsavelNome: 'Bianca Tavares', updatedAt: '2026-02-15',
  },
  {
    id: 'med-006', codigo: 'MED-2026-006', numeroMedicao: 1, obraId: 'obra-7', obraNome: 'OBR-007 — Hospital da Luz', contratoId: 'ctr-150', contratoCodigo: 'CTR-150', clienteNome: 'Saúde & Vida S.A.', competencia: '2026-03', periodoInicio: '2026-03-01', periodoFim: '2026-03-15', status: 'em_elaboracao', origem: 'contrato', aprovacaoStatus: 'pendente_engenharia', faturamentoStatus: 'nao_iniciado', percentualAvanco: 5, valorContrato: 45000000, resumoFinanceiro: { valorMedido: 2250000, valorRetido: 112500, valorLiberadoFaturamento: 2137500, valorFaturado: 0, valorRecebido: 0 }, centroCusto: 'CC-HOS-ENG', responsavelNome: 'Rafael Lima', updatedAt: '2026-03-20',
  },
];

const medicaoDetalhes: Record<string, MedicaoDetalheData> = {
  'med-001': {
    medicao: medicoes[0],
    itens: [
      { id: 'med-001-item-1', descricao: 'Estrutura do bloco A', etapa: 'Estrutura', unidade: 'm²', quantidadeContratada: 4200, quantidadeAnterior: 2250, quantidadePeriodo: 410, quantidadeAcumulada: 2660, percentualExecutado: 63.3, valorUnitario: 320, valorPeriodo: 131200 },
      { id: 'med-001-item-2', descricao: 'Instalações hidrossanitárias', etapa: 'Instalações', unidade: 'vb', quantidadeContratada: 1, quantidadeAnterior: 0.45, quantidadePeriodo: 0.12, quantidadeAcumulada: 0.57, percentualExecutado: 57, valorUnitario: 410000, valorPeriodo: 49200 },
      { id: 'med-001-item-3', descricao: 'Acabamento áreas comuns', etapa: 'Acabamento', unidade: 'm²', quantidadeContratada: 1600, quantidadeAnterior: 300, quantidadePeriodo: 210, quantidadeAcumulada: 510, percentualExecutado: 31.8, valorUnitario: 308, valorPeriodo: 64680 },
    ],
    timeline: [
      { id: 'tl-1', label: 'Medição fechada na obra', descricao: 'Conferência interna concluída pela engenharia residente.', data: '2026-03-16' },
      { id: 'tl-2', label: 'Enviada para aprovação do cliente', descricao: 'Pacote documental encaminhado com memória de cálculo e fotos.', data: '2026-03-18' },
      { id: 'tl-3', label: 'Faturamento preparado', descricao: 'Valor liberado já projetado para entrada financeira após aprovação.', data: '2026-03-20' },
    ],
    integracoes: [
      { modulo: 'Obra', descricao: 'Avanço físico vinculado ao contrato e ao centro de custo da obra.', href: '/obras/obra-2/medicoes' },
      { modulo: 'Financeiro', descricao: 'Título previsto preparado para contas a receber após aprovação.', href: '/financeiro/contas-receber' },
      { modulo: 'Estoque', descricao: 'Consumos críticos podem ser confrontados com a evolução medida para análise de produtividade.', href: '/estoque' },
    ],
    observacoes: [
      'Preparada para fluxo formal de aprovação cliente com anexos e versionamento em fase futura.',
      'Relação com faturamento preserva diferença entre medido, retido, faturado e recebido.',
    ],
  },
};

function matchesFilters(item: Medicao, filters?: MedicoesFiltersData) {
  if (!filters) return true;

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    const haystack = [item.codigo, item.obraNome, item.contratoCodigo, item.clienteNome, item.centroCusto, item.responsavelNome].join(' ').toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (filters.status && item.status !== filters.status) return false;
  if (filters.aprovacaoStatus && item.aprovacaoStatus !== filters.aprovacaoStatus) return false;
  if (filters.faturamentoStatus && item.faturamentoStatus !== filters.faturamentoStatus) return false;
  if (filters.competencia && item.competencia !== filters.competencia) return false;
  if (filters.obraId && item.obraId !== filters.obraId) return false;
  if (filters.contratoId && item.contratoId !== filters.contratoId) return false;

  return true;
}

export function getMockMedicoes(filters?: MedicoesFiltersData): Medicao[] {
  return medicoes.filter((item) => matchesFilters(item, filters));
}

function buildKpis(items: Medicao[]): MedicoesKpis {
  return {
    totalMedicoes: items.length,
    medicoesEmAprovacao: items.filter((item) => item.status === 'em_aprovacao').length,
    medicoesAprovadas: items.filter((item) => item.aprovacaoStatus === 'aprovada').length,
    valorMedido: items.reduce((acc, item) => acc + item.resumoFinanceiro.valorMedido, 0),
    valorFaturado: items.reduce((acc, item) => acc + item.resumoFinanceiro.valorFaturado, 0),
    valorReceber: items.reduce((acc, item) => acc + (item.resumoFinanceiro.valorLiberadoFaturamento - item.resumoFinanceiro.valorRecebido), 0),
  };
}

function buildResumoCards(items: Medicao[]): MedicoesResumoCardData[] {
  const aprovacoesPendentes = items.filter((item) => item.aprovacaoStatus === 'pendente_cliente' || item.aprovacaoStatus === 'pendente_engenharia');
  const faturamentoPronto = items.filter((item) => item.faturamentoStatus === 'preparado' || item.faturamentoStatus === 'emitido');

  return [
    {
      id: 'aprovacao',
      titulo: 'Visão de aprovação',
      descricao: 'Controle do pipeline entre fechamento técnico, revisão interna e validação do cliente.',
      itens: [
        { label: 'Pendentes', valor: String(aprovacoesPendentes.length) },
        { label: 'Engenharia', valor: String(items.filter((item) => item.aprovacaoStatus === 'pendente_engenharia').length) },
        { label: 'Cliente', valor: String(items.filter((item) => item.aprovacaoStatus === 'pendente_cliente').length), destaque: true },
      ],
    },
    {
      id: 'faturamento',
      titulo: 'Preparação para faturamento',
      descricao: 'Leitura dos valores já liberados para emissão, faturamento parcial e entrada financeira futura.',
      itens: [
        { label: 'Prontas para faturar', valor: String(faturamentoPronto.length) },
        { label: 'Valor liberado', valor: formatCurrency(items.reduce((acc, item) => acc + item.resumoFinanceiro.valorLiberadoFaturamento, 0)), destaque: true },
        { label: 'Recebido', valor: formatCurrency(items.reduce((acc, item) => acc + item.resumoFinanceiro.valorRecebido, 0)) },
      ],
    },
    {
      id: 'integracao',
      titulo: 'Integração com Obra e Financeiro',
      descricao: 'Medições preservando vínculo com contrato, obra, competência e contas a receber do financeiro.',
      itens: [
        { label: 'Obras cobertas', valor: String(new Set(items.map((item) => item.obraId)).size) },
        { label: 'Contratos ativos', valor: String(new Set(items.map((item) => item.contratoId)).size), destaque: true },
        { label: 'Maior medição', valor: formatCurrency(Math.max(...items.map((item) => item.resumoFinanceiro.valorMedido), 0)) },
      ],
    },
  ];
}

function buildStatusResumo(items: Medicao[]): MedicoesStatusResumo[] {
  return Array.from(new Set(items.map((item) => item.status))).map((status) => {
    const filtered = items.filter((item) => item.status === status);
    return {
      status,
      label: MEDICAO_STATUS_LABELS[status],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.resumoFinanceiro.valorMedido, 0),
      descricao: status === 'em_aprovacao'
        ? 'Medições aguardando validação para seguir ao faturamento.'
        : 'Medições acompanhadas no fluxo técnico-financeiro do contrato.',
    };
  });
}

function buildCompetenciaResumo(items: Medicao[]): MedicoesCompetenciaResumo[] {
  return Array.from(new Set(items.map((item) => item.competencia))).map((competencia) => {
    const filtered = items.filter((item) => item.competencia === competencia);
    return {
      competencia,
      quantidade: filtered.length,
      valorMedido: filtered.reduce((acc, item) => acc + item.resumoFinanceiro.valorMedido, 0),
      valorFaturado: filtered.reduce((acc, item) => acc + item.resumoFinanceiro.valorFaturado, 0),
    };
  });
}

export function getMockMedicoesDashboard(filters?: MedicoesFiltersData): MedicoesDashboardData {
  const filtered = getMockMedicoes(filters);
  return {
    medicoes: filtered,
    kpis: buildKpis(filtered),
    resumoCards: buildResumoCards(filtered),
    statusResumo: buildStatusResumo(filtered),
    competenciaResumo: buildCompetenciaResumo(filtered),
  };
}

export function getMockMedicaoById(medicaoId: string): MedicaoDetalheData | undefined {
  if (medicaoDetalhes[medicaoId]) return medicaoDetalhes[medicaoId];

  const medicao = medicoes.find((item) => item.id === medicaoId);
  if (!medicao) return undefined;

  return {
    medicao,
    itens: [
      { id: `${medicaoId}-item-1`, descricao: 'Serviço medido consolidado', etapa: 'Etapa principal', unidade: 'vb', quantidadeContratada: 1, quantidadeAnterior: 0.35, quantidadePeriodo: 0.15, quantidadeAcumulada: 0.5, percentualExecutado: medicao.percentualAvanco, valorUnitario: medicao.resumoFinanceiro.valorMedido, valorPeriodo: medicao.resumoFinanceiro.valorMedido },
    ],
    timeline: [
      { id: `${medicaoId}-tl-1`, label: 'Leitura gerada', descricao: `Competência ${formatCompetencia(medicao.competencia)} preparada para aprovação e faturamento.`, data: medicao.updatedAt },
    ],
    integracoes: [
      { modulo: 'Obra', descricao: 'Integração com contrato e avanço físico da obra.', href: `/obras/${medicao.obraId}/medicoes` },
      { modulo: 'Financeiro', descricao: 'Preparação para contas a receber e fluxo de caixa.', href: '/financeiro/contas-receber' },
    ],
    observacoes: [
      `Status de aprovação: ${MEDICAO_APROVACAO_LABELS[medicao.aprovacaoStatus]}.`,
      `Status de faturamento: ${MEDICAO_FATURAMENTO_LABELS[medicao.faturamentoStatus]}.`,
    ],
  };
}
