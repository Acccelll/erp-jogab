import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FiscalDashboardData,
  FiscalDocumento,
  FiscalDocumentoDetalhe,
  FiscalDocumentoTipo,
  FiscalFiltersData,
  FiscalKpis,
  FiscalResumoCard,
  FiscalStatusResumo,
  FiscalTipoResumo,
} from '../types';
import { FISCAL_STATUS_LABELS, FISCAL_TIPO_LABELS } from '../types';

export const mockDocumentosFiscais: FiscalDocumento[] = [
  {
    id: 'doc-001',
    numero: '18457',
    serie: '1',
    chaveAcesso: '35260312345678000199550010000184571000018457',
    fluxo: 'entrada',
    tipo: 'nfe_entrada',
    status: 'aguardando_validacao',
    emitenteNome: 'Concretiza SP',
    emitenteDocumento: '12.345.678/0001-99',
    destinatarioNome: 'JOGAB Engenharia Ltda',
    destinatarioDocumento: '55.111.222/0001-10',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    pedidoCompraId: 'ped-001',
    financeiroTituloId: null,
    origemResumo: 'Pedido de compra PC-2026-001 vinculado à concretagem da laje.',
    dataEmissao: '2026-03-22',
    dataLancamento: '2026-03-23T09:20:00Z',
    valorTotal: 124200,
    valorLiquido: 117886,
    impostos: {
      baseCalculo: 124200,
      icms: 4471.2,
      ipi: 0,
      pis: 807.3,
      cofins: 3720.6,
      iss: 0,
      retencoes: 1314.9,
    },
  },
  {
    id: 'doc-002',
    numero: '9021',
    serie: 'U',
    chaveAcesso: '35260399887766000122550010000090211000009021',
    fluxo: 'entrada',
    tipo: 'nfse_entrada',
    status: 'aguardando_financeiro',
    emitenteNome: 'Protege Engenharia',
    emitenteDocumento: '22.333.444/0001-88',
    destinatarioNome: 'JOGAB Engenharia Ltda',
    destinatarioDocumento: '55.111.222/0001-10',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    competencia: '2026-03',
    pedidoCompraId: 'ped-003',
    financeiroTituloId: 'fin-9821',
    origemResumo: 'Serviço de impermeabilização contratado pela área de Compras.',
    dataEmissao: '2026-03-28',
    dataLancamento: '2026-03-29T13:00:00Z',
    valorTotal: 89750,
    valorLiquido: 82341.25,
    impostos: {
      baseCalculo: 89750,
      icms: 0,
      ipi: 0,
      pis: 583.38,
      cofins: 2692.5,
      iss: 4487.5,
      retencoes: 9645.37,
    },
  },
  {
    id: 'doc-003',
    numero: '15000034',
    serie: '2',
    chaveAcesso: '35260311122233000144550020015000341000015003',
    fluxo: 'entrada',
    tipo: 'cte_entrada',
    status: 'escriturado',
    emitenteNome: 'Logística Estrutural',
    emitenteDocumento: '11.122.233/0001-44',
    destinatarioNome: 'JOGAB Engenharia Ltda',
    destinatarioDocumento: '55.111.222/0001-10',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    pedidoCompraId: 'ped-001',
    financeiroTituloId: 'fin-9830',
    origemResumo: 'Conhecimento de transporte vinculado à entrega do concreto.',
    dataEmissao: '2026-03-22',
    dataLancamento: '2026-03-24T11:15:00Z',
    valorTotal: 6850,
    valorLiquido: 6586.27,
    impostos: {
      baseCalculo: 6850,
      icms: 123.3,
      ipi: 0,
      pis: 44.53,
      cofins: 205.5,
      iss: 0,
      retencoes: 0.4,
    },
  },
  {
    id: 'doc-004',
    numero: '3012',
    serie: 'A',
    chaveAcesso: '35260344556677000188550010000030121000003012',
    fluxo: 'saida',
    tipo: 'nfe_saida',
    status: 'pendente_escrituracao',
    emitenteNome: 'JOGAB Engenharia Ltda',
    emitenteDocumento: '55.111.222/0001-10',
    destinatarioNome: 'Cliente Aurora SPE',
    destinatarioDocumento: '88.777.666/0001-55',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    pedidoCompraId: null,
    financeiroTituloId: null,
    origemResumo: 'Faturamento parcial de medição da etapa de estrutura.',
    dataEmissao: '2026-03-30',
    dataLancamento: '2026-03-30T16:40:00Z',
    valorTotal: 245000,
    valorLiquido: 228932.5,
    impostos: {
      baseCalculo: 245000,
      icms: 0,
      ipi: 0,
      pis: 1592.5,
      cofins: 7350,
      iss: 12250,
      retencoes: 4875,
    },
  },
  {
    id: 'doc-005',
    numero: '778',
    serie: 'S',
    chaveAcesso: '35260377788899000144550010000007781000000778',
    fluxo: 'saida',
    tipo: 'nfse_saida',
    status: 'aguardando_financeiro',
    emitenteNome: 'JOGAB Engenharia Ltda',
    emitenteDocumento: '55.111.222/0001-10',
    destinatarioNome: 'Parque Residencial Incorporadora',
    destinatarioDocumento: '44.555.666/0001-70',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    competencia: '2026-03',
    pedidoCompraId: null,
    financeiroTituloId: 'fin-11021',
    origemResumo: 'Serviço de administração de obra faturado ao cliente.',
    dataEmissao: '2026-03-27',
    dataLancamento: '2026-03-27T18:10:00Z',
    valorTotal: 98500,
    valorLiquido: 91514.75,
    impostos: {
      baseCalculo: 98500,
      icms: 0,
      ipi: 0,
      pis: 640.25,
      cofins: 2955,
      iss: 4925,
      retencoes: 4465,
    },
  },
];

export const mockDocumentoFiscalDetalhes: Record<string, FiscalDocumentoDetalhe> = {
  'doc-001': {
    documento: mockDocumentosFiscais[0],
    itens: [
      {
        id: 'item-001',
        descricao: 'Concreto usinado fck 30 MPa',
        quantidade: 180,
        unidade: 'm³',
        valorUnitario: 620,
        valorTotal: 111600,
        centroCustoNome: 'Estrutura',
      },
      {
        id: 'item-002',
        descricao: 'Bomba lança para concretagem',
        quantidade: 1,
        unidade: 'diária',
        valorUnitario: 8600,
        valorTotal: 8600,
        centroCustoNome: 'Apoio operacional',
      },
    ],
    observacoes: [
      'Documento precisa validar vínculo com o pedido de compra antes de liberar o financeiro.',
      'A escrituração impactará custo de obra e integração futura com estoque.',
    ],
    timeline: [
      {
        id: 'tl-001',
        titulo: 'Documento recebido',
        descricao: 'NF-e recebida a partir do fluxo de compras.',
        data: '2026-03-23T09:20:00Z',
      },
      {
        id: 'tl-002',
        titulo: 'Aguardando validação fiscal',
        descricao: 'Time fiscal validará tributos e consistência da chave de acesso.',
        data: '2026-03-23T11:00:00Z',
      },
    ],
  },
  'doc-002': {
    documento: mockDocumentosFiscais[1],
    itens: [
      {
        id: 'item-003',
        descricao: 'Serviço de impermeabilização de cobertura',
        quantidade: 1,
        unidade: 'vb',
        valorUnitario: 89750,
        valorTotal: 89750,
        centroCustoNome: 'Acabamento',
      },
    ],
    observacoes: [
      'Documento já validado fiscalmente e aguardando consolidação no Financeiro.',
    ],
    timeline: [
      {
        id: 'tl-003',
        titulo: 'Escrituração concluída',
        descricao: 'Tributos e retenções validados para integração financeira.',
        data: '2026-03-29T14:15:00Z',
      },
    ],
  },
  'doc-003': {
    documento: mockDocumentosFiscais[2],
    itens: [
      {
        id: 'item-004',
        descricao: 'Frete de concreto usinado',
        quantidade: 1,
        unidade: 'vb',
        valorUnitario: 6850,
        valorTotal: 6850,
        centroCustoNome: 'Logística',
      },
    ],
    observacoes: ['Documento já refletido em custo de obra e título financeiro programado.'],
    timeline: [
      {
        id: 'tl-004',
        titulo: 'Documento escriturado',
        descricao: 'CT-e fechado e integrado ao financeiro.',
        data: '2026-03-24T15:00:00Z',
      },
    ],
  },
  'doc-004': {
    documento: mockDocumentosFiscais[3],
    itens: [
      {
        id: 'item-005',
        descricao: 'Medição etapa estrutura',
        quantidade: 1,
        unidade: 'vb',
        valorUnitario: 245000,
        valorTotal: 245000,
        centroCustoNome: 'Receita operacional',
      },
    ],
    observacoes: [
      'Documento de saída dependerá de integração com Financeiro para geração e conciliação do título.',
    ],
    timeline: [
      {
        id: 'tl-005',
        titulo: 'Nota emitida',
        descricao: 'Documento de faturamento emitido para o cliente da obra.',
        data: '2026-03-30T16:40:00Z',
      },
    ],
  },
  'doc-005': {
    documento: mockDocumentosFiscais[4],
    itens: [
      {
        id: 'item-006',
        descricao: 'Serviço de administração de obra',
        quantidade: 1,
        unidade: 'vb',
        valorUnitario: 98500,
        valorTotal: 98500,
        centroCustoNome: 'Receita de serviços',
      },
    ],
    observacoes: [
      'Documento já possui vínculo preliminar com o Financeiro para cobrança.',
    ],
    timeline: [
      {
        id: 'tl-006',
        titulo: 'Aguardando financeiro',
        descricao: 'Título financeiro em preparação para cobrança.',
        data: '2026-03-27T18:10:00Z',
      },
    ],
  },
};

export function applyFiscalFilters(items: FiscalDocumento[], filters?: FiscalFiltersData): FiscalDocumento[] {
  let result = [...items];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((item) =>
      [
        item.numero,
        item.emitenteNome,
        item.destinatarioNome,
        item.obraNome,
        item.origemResumo,
      ].some((value) => value.toLowerCase().includes(search)),
    );
  }

  if (filters?.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.tipo) {
    result = result.filter((item) => item.tipo === filters.tipo);
  }

  if (filters?.fluxo) {
    result = result.filter((item) => item.fluxo === filters.fluxo);
  }

  if (filters?.competencia) {
    result = result.filter((item) => item.competencia === filters.competencia);
  }

  if (filters?.obraId) {
    result = result.filter((item) => item.obraId === filters.obraId);
  }

  return result;
}

export function calcularFiscalKpis(documentos: FiscalDocumento[]): FiscalKpis {
  return {
    totalDocumentos: documentos.length,
    entradas: documentos.filter((item) => item.fluxo === 'entrada').length,
    saidas: documentos.filter((item) => item.fluxo === 'saida').length,
    aguardandoValidacao: documentos.filter((item) => item.status === 'aguardando_validacao').length,
    aguardandoFinanceiro: documentos.filter((item) => item.status === 'aguardando_financeiro').length,
    valorTotal: documentos.reduce((acc, item) => acc + item.valorTotal, 0),
  };
}

export function gerarFiscalResumoCards(documentos: FiscalDocumento[]): FiscalResumoCard[] {
  const entradas = documentos.filter((item) => item.fluxo === 'entrada');
  const saidas = documentos.filter((item) => item.fluxo === 'saida');
  const maiorDocumento = [...documentos].sort((a, b) => b.valorTotal - a.valorTotal)[0];

  return [
    {
      id: 'fluxo',
      titulo: 'Fluxo fiscal',
      descricao: 'Leitura operacional de entradas e saídas em apuração.',
      itens: [
        { label: 'Entradas', valor: String(entradas.length) },
        { label: 'Saídas', valor: String(saidas.length) },
        { label: 'Maior documento', valor: maiorDocumento ? `${maiorDocumento.numero} • ${formatCurrency(maiorDocumento.valorTotal)}` : 'Sem dados', destaque: true },
      ],
    },
    {
      id: 'compras',
      titulo: 'Integração com Compras',
      descricao: 'Documentos de entrada vinculados a pedidos de compra e recebimentos.',
      itens: [
        { label: 'Com pedido vinculado', valor: String(entradas.filter((item) => item.pedidoCompraId).length), destaque: true },
        { label: 'Obra principal', valor: entradas[0]?.obraNome ?? 'Sem dados' },
        { label: 'Competência de referência', valor: formatCompetencia(documentos[0]?.competencia ?? '2026-03') },
      ],
    },
    {
      id: 'financeiro',
      titulo: 'Integração com Financeiro',
      descricao: 'Documentos que exigem geração, programação ou conciliação financeira.',
      itens: [
        { label: 'Aguardando financeiro', valor: String(documentos.filter((item) => item.status === 'aguardando_financeiro').length), destaque: true },
        { label: 'Já vinculados', valor: String(documentos.filter((item) => item.financeiroTituloId).length) },
        { label: 'Valor total', valor: formatCurrency(documentos.reduce((acc, item) => acc + item.valorTotal, 0)) },
      ],
    },
  ];
}

export function gerarFiscalStatusResumo(documentos: FiscalDocumento[]): FiscalStatusResumo[] {
  const statuses: FiscalStatusResumo['status'][] = [
    'pendente_escrituracao',
    'aguardando_validacao',
    'aguardando_financeiro',
    'escriturado',
  ];

  return statuses.map((status) => {
    const filtered = documentos.filter((item) => item.status === status);
    return {
      status,
      label: FISCAL_STATUS_LABELS[status],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.valorTotal, 0),
      descricao:
        status === 'aguardando_financeiro'
          ? 'Documentos prontos para refletir títulos, cobranças ou desembolsos.'
          : 'Leitura resumida do estágio fiscal dos documentos.',
    };
  });
}

export function gerarFiscalTipoResumo(documentos: FiscalDocumento[]): FiscalTipoResumo[] {
  const tipos: FiscalDocumentoTipo[] = ['nfe_entrada', 'nfse_entrada', 'cte_entrada', 'nfe_saida', 'nfse_saida'];

  return tipos.map((tipo) => {
    const filtered = documentos.filter((item) => item.tipo === tipo);
    return {
      tipo,
      label: FISCAL_TIPO_LABELS[tipo],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.valorTotal, 0),
    };
  });
}

export function buildFiscalDashboard(documentos: FiscalDocumento[]): FiscalDashboardData {
  return {
    documentos,
    kpis: calcularFiscalKpis(documentos),
    resumoCards: gerarFiscalResumoCards(documentos),
    statusResumo: gerarFiscalStatusResumo(documentos),
    tipoResumo: gerarFiscalTipoResumo(documentos),
  };
}
