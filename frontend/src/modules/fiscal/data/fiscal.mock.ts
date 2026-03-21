import { formatCurrency } from '@/shared/lib/utils';
import type {
  DocumentoFiscal,
  DocumentoFiscalDetalheData,
  FiscalDashboardData,
  FiscalFiltersData,
  FiscalKpis,
  FiscalResumoCardData,
  FiscalStatus,
  FiscalStatusResumo,
} from '../types';
import {
  FISCAL_DOCUMENTO_TIPO_LABELS,
  FISCAL_INTEGRACAO_STATUS_LABELS,
  FISCAL_STATUS_LABELS,
} from '../types';

export const fiscalDocumentos: DocumentoFiscal[] = [
  {
    id: 'doc-fis-001',
    codigo: 'FIS-2026-001',
    numero: '88731',
    serie: '1',
    tipoOperacao: 'entrada',
    documentoTipo: 'nfe',
    status: 'em_validacao',
    emitenteNome: 'Concreforte Materiais',
    destinatarioNome: 'JOGAB Engenharia',
    obraId: 'obra-4',
    obraNome: 'OBR-004 — Ponte BR-101',
    competencia: '2026-03',
    emissao: '2026-03-04',
    lancamento: '2026-03-05',
    vencimento: '2026-03-22',
    valorDocumento: 96420,
    chaveAcesso: '35260388731000000001550010000088731012345678',
    resumo: 'Nota fiscal de concreto usinado vinculada ao pedido PC-2026-001 e aguardando validação fiscal.',
    impostos: {
      baseCalculo: 96420,
      valorIcms: 17355.6,
      valorPis: 626.73,
      valorCofins: 2887.38,
      valorRetencoes: 0,
      valorTotalImpostos: 20869.71,
    },
    vinculos: {
      compraCodigo: 'PC-2026-001',
      pedidoCompraHref: '/compras/pedidos/ped-001',
      obraId: 'obra-4',
      obraNome: 'OBR-004 — Ponte BR-101',
      estoqueMovimentacaoResumo: 'Entrada prevista no almoxarifado central após validação fiscal.',
      estoqueStatus: 'pendente',
      tituloFinanceiroCodigo: 'TIT-2026-002',
      tituloFinanceiroHref: '/financeiro/titulos/tit-002',
      financeiroStatus: 'pendente',
    },
  },
  {
    id: 'doc-fis-002',
    codigo: 'FIS-2026-002',
    numero: '1198',
    serie: 'A',
    tipoOperacao: 'entrada',
    documentoTipo: 'nfse',
    status: 'integrado_financeiro',
    emitenteNome: 'MaqLoc Engenharia',
    destinatarioNome: 'JOGAB Engenharia',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    competencia: '2026-03',
    emissao: '2026-03-01',
    lancamento: '2026-03-02',
    vencimento: '2026-03-15',
    valorDocumento: 52640,
    resumo: 'NFS-e de locação de equipamento com reflexo financeiro já programado e serviço liberado para apropriação.',
    impostos: {
      baseCalculo: 52640,
      valorIss: 2632,
      valorPis: 342.16,
      valorCofins: 1579.2,
      valorRetencoes: 894.88,
      valorTotalImpostos: 5448.24,
    },
    vinculos: {
      compraCodigo: 'PC-2026-002',
      pedidoCompraHref: '/compras/pedidos/ped-002',
      obraId: 'obra-2',
      obraNome: 'OBR-002 — Residencial Parque',
      estoqueStatus: 'nao_aplicavel',
      tituloFinanceiroCodigo: 'TIT-2026-006',
      tituloFinanceiroHref: '/financeiro/titulos/tit-006',
      financeiroStatus: 'integrado',
    },
  },
  {
    id: 'doc-fis-003',
    codigo: 'FIS-2026-003',
    numero: 'NF-4501',
    serie: '2',
    tipoOperacao: 'saida',
    documentoTipo: 'nfe',
    status: 'faturado',
    emitenteNome: 'JOGAB Engenharia',
    destinatarioNome: 'Cliente Parque SPE',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    competencia: '2026-03',
    emissao: '2026-03-12',
    lancamento: '2026-03-12',
    vencimento: '2026-04-02',
    valorDocumento: 245000,
    chaveAcesso: '35260345010000000001550020000045011012345670',
    resumo: 'NF-e emitida a partir da medição aprovada do contrato CP-88 com reflexo em contas a receber.',
    impostos: {
      baseCalculo: 245000,
      valorIss: 12250,
      valorPis: 1592.5,
      valorCofins: 7350,
      valorRetencoes: 3675,
      valorTotalImpostos: 24867.5,
    },
    vinculos: {
      obraId: 'obra-2',
      obraNome: 'OBR-002 — Residencial Parque',
      estoqueStatus: 'nao_aplicavel',
      tituloFinanceiroCodigo: 'TIT-2026-003',
      tituloFinanceiroHref: '/financeiro/titulos/tit-003',
      financeiroStatus: 'integrado',
    },
  },
  {
    id: 'doc-fis-004',
    codigo: 'FIS-2026-004',
    numero: 'DARF-11902',
    tipoOperacao: 'saida',
    documentoTipo: 'guia',
    status: 'pendente',
    emitenteNome: 'JOGAB Engenharia',
    destinatarioNome: 'Receita Federal',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    competencia: '2026-02',
    emissao: '2026-02-28',
    lancamento: '2026-03-01',
    vencimento: '2026-03-10',
    valorDocumento: 18320.55,
    resumo: 'Guia de tributos retidos sobre serviços terceirizados pendente de regularização financeira.',
    impostos: {
      baseCalculo: 18320.55,
      valorRetencoes: 18320.55,
      valorTotalImpostos: 18320.55,
    },
    vinculos: {
      obraId: 'obra-3',
      obraNome: 'OBR-003 — Torre Empresarial',
      estoqueStatus: 'nao_aplicavel',
      tituloFinanceiroCodigo: 'TIT-2026-004',
      tituloFinanceiroHref: '/financeiro/titulos/tit-004',
      financeiroStatus: 'pendente',
    },
  },
  {
    id: 'doc-fis-005',
    codigo: 'FIS-2026-005',
    numero: 'CTE-7711',
    serie: '3',
    tipoOperacao: 'entrada',
    documentoTipo: 'cte',
    status: 'integrado_estoque',
    emitenteNome: 'Transvias Logística',
    destinatarioNome: 'JOGAB Engenharia',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    emissao: '2026-03-09',
    lancamento: '2026-03-10',
    vencimento: '2026-03-21',
    valorDocumento: 12480,
    resumo: 'Conhecimento de transporte integrado ao recebimento de materiais e em programação financeira.',
    impostos: {
      baseCalculo: 12480,
      valorIcms: 1497.6,
      valorPis: 81.12,
      valorCofins: 373.44,
      valorRetencoes: 0,
      valorTotalImpostos: 1952.16,
    },
    vinculos: {
      compraCodigo: 'PC-2026-001',
      pedidoCompraHref: '/compras/pedidos/ped-001',
      obraId: 'obra-1',
      obraNome: 'OBR-001 — Edifício Aurora',
      estoqueMovimentacaoResumo: 'Frete apropriado à entrada dos materiais estruturais.',
      estoqueStatus: 'integrado',
      financeiroStatus: 'pendente',
    },
  },
  {
    id: 'doc-fis-006',
    codigo: 'FIS-2026-006',
    numero: 'NFS-8820',
    serie: 'B',
    tipoOperacao: 'saida',
    documentoTipo: 'nfse',
    status: 'erro',
    emitenteNome: 'JOGAB Engenharia',
    destinatarioNome: 'Aurora Desenvolvimento Imobiliário',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    emissao: '2026-03-14',
    lancamento: '2026-03-14',
    vencimento: '2026-03-28',
    valorDocumento: 38750,
    resumo: 'NFS-e de reembolso contratual com falha de transmissão e necessidade de reprocessamento.',
    impostos: {
      baseCalculo: 38750,
      valorIss: 1937.5,
      valorPis: 251.88,
      valorCofins: 1162.5,
      valorRetencoes: 581.25,
      valorTotalImpostos: 3933.13,
    },
    vinculos: {
      obraId: 'obra-1',
      obraNome: 'OBR-001 — Edifício Aurora',
      estoqueStatus: 'nao_aplicavel',
      tituloFinanceiroCodigo: 'TIT-2026-005',
      tituloFinanceiroHref: '/financeiro/titulos/tit-005',
      financeiroStatus: 'erro',
    },
  },
];

const fiscalTimelines: Record<string, DocumentoFiscalDetalheData['timeline']> = {
  'doc-fis-001': [
    { id: 'tl-001', label: 'Documento recebido', descricao: 'XML e DANFE recebidos da compra de concreto.', data: '2026-03-04T10:30:00Z' },
    { id: 'tl-002', label: 'Conferência inicial', descricao: 'Equipe fiscal iniciou validação de CFOP, NCM e impostos.', data: '2026-03-05T08:10:00Z' },
  ],
  'doc-fis-002': [
    { id: 'tl-003', label: 'NFS-e lançada', descricao: 'Serviço lançado e vinculado ao pedido da locação.', data: '2026-03-02T09:40:00Z' },
    { id: 'tl-004', label: 'Financeiro integrado', descricao: 'Título financeiro programado para pagamento.', data: '2026-03-03T14:20:00Z' },
  ],
  'doc-fis-003': [
    { id: 'tl-005', label: 'Medição aprovada', descricao: 'Medição originadora liberou o faturamento.', data: '2026-03-11T16:00:00Z' },
    { id: 'tl-006', label: 'NF-e emitida', descricao: 'Documento autorizado e contas a receber gerado.', data: '2026-03-12T11:15:00Z' },
  ],
  'doc-fis-004': [
    { id: 'tl-007', label: 'Guia gerada', descricao: 'Tributo retido consolidado para recolhimento.', data: '2026-03-01T08:00:00Z' },
  ],
  'doc-fis-005': [
    { id: 'tl-008', label: 'CT-e validado', descricao: 'Frete apropriado ao recebimento da compra.', data: '2026-03-10T13:00:00Z' },
  ],
  'doc-fis-006': [
    { id: 'tl-009', label: 'Erro de transmissão', descricao: 'Rejeição do município por inconsistência cadastral.', data: '2026-03-14T15:25:00Z' },
  ],
};

const fiscalObservacoes: Record<string, string[]> = {
  'doc-fis-001': [
    'Documento aguardando liberação fiscal para refletir estoque e financeiro.',
    'Compra e obra já vinculadas para rastreabilidade do custo.',
  ],
  'doc-fis-002': ['Serviço sem integração com estoque, apenas financeiro e obra.'],
  'doc-fis-003': ['Saída fiscal associada a medição aprovada e pronta para cobrança.'],
  'doc-fis-004': ['Guia depende de regularização financeira imediata.'],
  'doc-fis-005': ['CT-e apropriado como componente logístico da compra.'],
  'doc-fis-006': ['Necessário reprocessar documento após correção cadastral.'],
};

function matchesSearch(documento: DocumentoFiscal, search?: string) {
  if (!search?.trim()) {
    return true;
  }

  const haystack = [
    documento.codigo,
    documento.numero,
    documento.emitenteNome,
    documento.destinatarioNome,
    documento.obraNome,
    documento.resumo,
    documento.vinculos.compraCodigo,
    documento.vinculos.tituloFinanceiroCodigo,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(search.trim().toLowerCase());
}

export function applyFiscalFilters(documentos: DocumentoFiscal[], filters?: FiscalFiltersData) {
  if (!filters) {
    return documentos;
  }

  return documentos.filter((documento) => {
    if (!matchesSearch(documento, filters.search)) return false;
    if (filters.tipoOperacao && documento.tipoOperacao !== filters.tipoOperacao) return false;
    if (filters.documentoTipo && documento.documentoTipo !== filters.documentoTipo) return false;
    if (filters.status && documento.status !== filters.status) return false;
    if (filters.estoqueStatus && documento.vinculos.estoqueStatus !== filters.estoqueStatus) return false;
    if (filters.financeiroStatus && documento.vinculos.financeiroStatus !== filters.financeiroStatus) return false;
    if (filters.competencia && documento.competencia !== filters.competencia) return false;
    if (filters.obraId && documento.obraId !== filters.obraId) return false;
    return true;
  });
}

function buildFiscalKpis(documentos: DocumentoFiscal[]): FiscalKpis {
  const entradas = documentos.filter((item) => item.tipoOperacao === 'entrada');
  const saidas = documentos.filter((item) => item.tipoOperacao === 'saida');

  return {
    totalDocumentos: documentos.length,
    totalEntradas: entradas.length,
    totalSaidas: saidas.length,
    valorEntradas: entradas.reduce((acc, item) => acc + item.valorDocumento, 0),
    valorSaidas: saidas.reduce((acc, item) => acc + item.valorDocumento, 0),
    validando: documentos.filter((item) => item.status === 'pendente' || item.status === 'em_validacao').length,
    comErro: documentos.filter((item) => item.status === 'erro').length,
  };
}

function buildResumoCards(documentos: DocumentoFiscal[]): FiscalResumoCardData[] {
  const estoqueIntegrado = documentos.filter((item) => item.vinculos.estoqueStatus === 'integrado').length;
  const financeiroIntegrado = documentos.filter((item) => item.vinculos.financeiroStatus === 'integrado').length;
  const comprasVinculadas = documentos.filter((item) => item.vinculos.compraCodigo).length;
  const cargaTributaria = documentos.reduce((acc, item) => acc + item.impostos.valorTotalImpostos, 0);

  return [
    {
      id: 'integracoes',
      titulo: 'Integrações operacionais',
      descricao: 'Documentos fiscais conectados a Compras, Estoque e Financeiro.',
      itens: [
        { label: 'Compras vinculadas', valor: String(comprasVinculadas) },
        { label: 'Estoque integrado', valor: String(estoqueIntegrado) },
        { label: 'Financeiro integrado', valor: String(financeiroIntegrado), destaque: true },
      ],
    },
    {
      id: 'tributacao',
      titulo: 'Carga tributária observada',
      descricao: 'Leitura rápida do montante de impostos e retenções nos documentos filtrados.',
      itens: [
        { label: 'Total de impostos', valor: formatCurrency(cargaTributaria), destaque: true },
        { label: 'Entradas', valor: formatCurrency(documentos.filter((item) => item.tipoOperacao === 'entrada').reduce((acc, item) => acc + item.impostos.valorTotalImpostos, 0)) },
        { label: 'Saídas', valor: formatCurrency(documentos.filter((item) => item.tipoOperacao === 'saida').reduce((acc, item) => acc + item.impostos.valorTotalImpostos, 0)) },
      ],
    },
    {
      id: 'documentos',
      titulo: 'Tipos documentais',
      descricao: 'Distribuição entre NF-e, NFS-e, CT-e e guias no contexto ativo.',
      itens: [
        ...Object.entries(FISCAL_DOCUMENTO_TIPO_LABELS).map(([tipo, label]) => ({
          label,
          valor: String(documentos.filter((item) => item.documentoTipo === tipo).length),
          destaque: tipo === 'nfe',
        })),
      ],
    },
  ];
}

function buildStatusResumo(documentos: DocumentoFiscal[]): FiscalStatusResumo[] {
  const descriptions: Record<FiscalStatus, string> = {
    pendente: 'Documento recebido e ainda não processado pelo fiscal.',
    em_validacao: 'Documento em conferência tributária e cadastral.',
    validado: 'Documento fiscal validado e pronto para próximos reflexos.',
    integrado_estoque: 'Documento já refletido no estoque.',
    integrado_financeiro: 'Documento já refletido no financeiro.',
    faturado: 'Documento de saída emitido e faturado.',
    erro: 'Documento com falha ou inconsistência a tratar.',
    cancelado: 'Documento fiscal cancelado.',
  };

  return (Object.keys(FISCAL_STATUS_LABELS) as FiscalStatus[]).map((status) => ({
    status,
    label: FISCAL_STATUS_LABELS[status],
    quantidade: documentos.filter((item) => item.status === status).length,
    descricao: descriptions[status],
  }));
}

export function getMockFiscalDashboard(filters?: FiscalFiltersData): FiscalDashboardData {
  const documentos = applyFiscalFilters(fiscalDocumentos, filters);

  return {
    documentos,
    kpis: buildFiscalKpis(documentos),
    resumoCards: buildResumoCards(documentos),
    statusResumo: buildStatusResumo(documentos),
  };
}

export function getMockDocumentoFiscalById(documentoId: string): DocumentoFiscalDetalheData | null {
  const documento = fiscalDocumentos.find((item) => item.id === documentoId);

  if (!documento) {
    return null;
  }

  return {
    documento,
    timeline: fiscalTimelines[documentoId] ?? [],
    observacoes: [
      `Status de estoque: ${FISCAL_INTEGRACAO_STATUS_LABELS[documento.vinculos.estoqueStatus]}.`,
      `Status financeiro: ${FISCAL_INTEGRACAO_STATUS_LABELS[documento.vinculos.financeiroStatus]}.`,
      ...(fiscalObservacoes[documentoId] ?? []),
    ],
  };
}
