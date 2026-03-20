import { formatCurrency, formatCompetencia } from '@/shared/lib/utils';
import type {
  CompraFiltersData,
  ComprasKpis,
  ComprasResumoCard,
  ComprasStatusResumo,
  CotacaoCompra,
  PedidoCompra,
  PedidoCompraDetalhe,
  SolicitacaoCompra,
} from '../types';
import { COMPRA_STATUS_LABELS } from '../types';

export const mockSolicitacoesCompra: SolicitacaoCompra[] = [
  {
    id: 'sol-001',
    codigo: 'SC-2026-001',
    titulo: 'Concreto usinado para laje do bloco A',
    descricao: 'Solicitação para concretagem da laje do 8º pavimento.',
    solicitanteNome: 'Carlos Menezes',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    centroCustoNome: 'Estrutura',
    competencia: '2026-03',
    categoria: 'material_obra',
    prioridade: 'alta',
    status: 'em_cotacao',
    valorEstimado: 128500,
    itens: 3,
    createdAt: '2026-03-02T11:20:00Z',
    prazoNecessidade: '2026-03-25',
    integracaoFiscal: true,
    integracaoFinanceiro: true,
  },
  {
    id: 'sol-002',
    codigo: 'SC-2026-002',
    titulo: 'Locação de plataforma elevatória',
    descricao: 'Equipamento para execução de fachada e instalações.',
    solicitanteNome: 'Fernanda Lima',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    centroCustoNome: 'Equipamentos',
    competencia: '2026-03',
    categoria: 'equipamento',
    prioridade: 'media',
    status: 'pendente_aprovacao',
    valorEstimado: 38400,
    itens: 1,
    createdAt: '2026-03-04T15:40:00Z',
    prazoNecessidade: '2026-03-28',
    integracaoFiscal: true,
    integracaoFinanceiro: true,
  },
  {
    id: 'sol-003',
    codigo: 'SC-2026-003',
    titulo: 'Serviço de impermeabilização da cobertura',
    descricao: 'Contratação terceirizada para etapa final da cobertura.',
    solicitanteNome: 'Juliana Prado',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    centroCustoNome: 'Acabamento',
    competencia: '2026-03',
    categoria: 'servico',
    prioridade: 'alta',
    status: 'cotada',
    valorEstimado: 92200,
    itens: 1,
    createdAt: '2026-03-01T09:10:00Z',
    prazoNecessidade: '2026-03-30',
    integracaoFiscal: true,
    integracaoFinanceiro: true,
  },
  {
    id: 'sol-004',
    codigo: 'SC-2026-004',
    titulo: 'Compra de EPIs complementares',
    descricao: 'Reposição de luvas, capacetes e óculos para equipes de campo.',
    solicitanteNome: 'Rafael Costa',
    obraId: 'obra-4',
    obraNome: 'OBR-004 — Ponte BR-101',
    centroCustoNome: 'Segurança do Trabalho',
    competencia: '2026-02',
    categoria: 'administrativo',
    prioridade: 'media',
    status: 'pedido_emitido',
    valorEstimado: 15480,
    itens: 12,
    createdAt: '2026-02-20T14:00:00Z',
    prazoNecessidade: '2026-03-10',
    integracaoFiscal: true,
    integracaoFinanceiro: true,
  },
];

export const mockCotacoesCompra: CotacaoCompra[] = [
  {
    id: 'cot-001',
    solicitacaoId: 'sol-001',
    codigo: 'CQ-2026-001',
    objeto: 'Concreto usinado fck 30',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    competencia: '2026-03',
    categoria: 'material_obra',
    prioridade: 'alta',
    fornecedorPrincipal: 'Concretiza SP',
    quantidadeFornecedores: 3,
    valorCotado: 124200,
    melhorPrazoEntrega: '48 horas',
    status: 'cotada',
    createdAt: '2026-03-05T16:30:00Z',
  },
  {
    id: 'cot-002',
    solicitacaoId: 'sol-003',
    codigo: 'CQ-2026-002',
    objeto: 'Impermeabilização cobertura bloco corporativo',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    competencia: '2026-03',
    categoria: 'servico',
    prioridade: 'alta',
    fornecedorPrincipal: 'Protege Engenharia',
    quantidadeFornecedores: 4,
    valorCotado: 89750,
    melhorPrazoEntrega: '7 dias',
    status: 'cotada',
    createdAt: '2026-03-06T10:00:00Z',
  },
  {
    id: 'cot-003',
    solicitacaoId: 'sol-002',
    codigo: 'CQ-2026-003',
    objeto: 'Locação de plataforma elevatória',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    competencia: '2026-03',
    categoria: 'equipamento',
    prioridade: 'media',
    fornecedorPrincipal: 'EquipRent',
    quantidadeFornecedores: 2,
    valorCotado: 39200,
    melhorPrazoEntrega: '3 dias',
    status: 'em_cotacao',
    createdAt: '2026-03-07T13:20:00Z',
  },
];

export const mockPedidosCompra: PedidoCompra[] = [
  {
    id: 'ped-001',
    codigo: 'PC-2026-001',
    solicitacaoId: 'sol-001',
    cotacaoId: 'cot-001',
    fornecedorId: 'for-001',
    fornecedorNome: 'Concretiza SP',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    centroCustoNome: 'Estrutura',
    competencia: '2026-03',
    categoria: 'material_obra',
    prioridade: 'alta',
    status: 'aguardando_fiscal',
    valorPedido: 124200,
    valorComprometidoFinanceiro: 124200,
    previsaoEntrega: '2026-03-24',
    fiscalStatus: 'aguardando_documentos',
    financeiroStatus: 'previsto',
    itens: 3,
    createdAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'ped-002',
    codigo: 'PC-2026-002',
    solicitacaoId: 'sol-004',
    cotacaoId: null,
    fornecedorId: 'for-002',
    fornecedorNome: 'Safety Equipamentos',
    obraId: 'obra-4',
    obraNome: 'OBR-004 — Ponte BR-101',
    centroCustoNome: 'Segurança do Trabalho',
    competencia: '2026-02',
    categoria: 'administrativo',
    prioridade: 'media',
    status: 'recebimento_parcial',
    valorPedido: 14980,
    valorComprometidoFinanceiro: 14980,
    previsaoEntrega: '2026-03-09',
    fiscalStatus: 'validado',
    financeiroStatus: 'programado',
    itens: 12,
    createdAt: '2026-02-25T11:15:00Z',
  },
  {
    id: 'ped-003',
    codigo: 'PC-2026-003',
    solicitacaoId: 'sol-003',
    cotacaoId: 'cot-002',
    fornecedorId: 'for-003',
    fornecedorNome: 'Protege Engenharia',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    centroCustoNome: 'Acabamento',
    competencia: '2026-03',
    categoria: 'servico',
    prioridade: 'alta',
    status: 'pedido_emitido',
    valorPedido: 89750,
    valorComprometidoFinanceiro: 89750,
    previsaoEntrega: '2026-03-29',
    fiscalStatus: 'nao_iniciado',
    financeiroStatus: 'previsto',
    itens: 1,
    createdAt: '2026-03-10T14:45:00Z',
  },
];

export const mockPedidoDetalhes: Record<string, PedidoCompraDetalhe> = {
  'ped-001': {
    pedido: mockPedidosCompra[0],
    solicitacao: mockSolicitacoesCompra[0],
    cotacao: mockCotacoesCompra[0],
    itens: [
      {
        id: 'item-001',
        descricao: 'Concreto usinado fck 30 MPa',
        quantidade: 180,
        unidade: 'm³',
        valorUnitario: 620,
        valorTotal: 111600,
        obraAplicacao: 'Bloco A — laje 8º pavimento',
      },
      {
        id: 'item-002',
        descricao: 'Bomba lança para concretagem',
        quantidade: 1,
        unidade: 'diária',
        valorUnitario: 8600,
        valorTotal: 8600,
        obraAplicacao: 'Bloco A — apoio operacional',
      },
      {
        id: 'item-003',
        descricao: 'Aditivo plastificante',
        quantidade: 12,
        unidade: 'un',
        valorUnitario: 333.33,
        valorTotal: 3999.96,
        obraAplicacao: 'Bloco A — central de concreto',
      },
    ],
    timeline: [
      {
        id: 'tl-001',
        titulo: 'Solicitação aberta',
        descricao: 'Engenharia da obra registrou a necessidade de concretagem.',
        data: '2026-03-02T11:20:00Z',
      },
      {
        id: 'tl-002',
        titulo: 'Cotação consolidada',
        descricao: 'Três fornecedores comparados com foco em prazo e preço.',
        data: '2026-03-05T16:30:00Z',
      },
      {
        id: 'tl-003',
        titulo: 'Pedido emitido',
        descricao: 'Pedido encaminhado ao fornecedor e aguardando documentação fiscal.',
        data: '2026-03-08T09:00:00Z',
      },
    ],
    observacoes: [
      'Pedido impacta diretamente o cronograma da estrutura da obra.',
      'Fiscal deverá validar retenções e documentação antes do recebimento.',
      'Financeiro deve converter previsão em programação de desembolso após aceite fiscal.',
    ],
  },
  'ped-002': {
    pedido: mockPedidosCompra[1],
    solicitacao: mockSolicitacoesCompra[3],
    cotacao: null,
    itens: [
      {
        id: 'item-004',
        descricao: 'Capacete classe B',
        quantidade: 20,
        unidade: 'un',
        valorUnitario: 82,
        valorTotal: 1640,
        obraAplicacao: 'Frente ponteiro central',
      },
      {
        id: 'item-005',
        descricao: 'Luva de vaqueta',
        quantidade: 80,
        unidade: 'par',
        valorUnitario: 28,
        valorTotal: 2240,
        obraAplicacao: 'Todas as frentes de trabalho',
      },
    ],
    timeline: [
      {
        id: 'tl-004',
        titulo: 'Pedido emergencial aprovado',
        descricao: 'Compra direta autorizada por segurança operacional.',
        data: '2026-02-25T11:15:00Z',
      },
    ],
    observacoes: ['Recebimento parcial já ocorreu e estoque deverá apontar saldo pendente.'],
  },
  'ped-003': {
    pedido: mockPedidosCompra[2],
    solicitacao: mockSolicitacoesCompra[2],
    cotacao: mockCotacoesCompra[1],
    itens: [
      {
        id: 'item-006',
        descricao: 'Serviço completo de impermeabilização',
        quantidade: 1,
        unidade: 'vb',
        valorUnitario: 89750,
        valorTotal: 89750,
        obraAplicacao: 'Cobertura técnica da torre',
      },
    ],
    timeline: [
      {
        id: 'tl-005',
        titulo: 'Fornecedor selecionado',
        descricao: 'Comparativo técnico-financeiro finalizado pela suprimentos.',
        data: '2026-03-06T10:00:00Z',
      },
      {
        id: 'tl-006',
        titulo: 'Pedido emitido',
        descricao: 'Aguardando programação financeira e validação fiscal contratual.',
        data: '2026-03-10T14:45:00Z',
      },
    ],
    observacoes: ['Contrato de serviço exigirá interface com Fiscal para retenções e medições futuras.'],
  },
};

export function applyCompraFilters<
  T extends {
    status: string;
    competencia?: string;
    obraId?: string;
    categoria?: string;
    prioridade?: string;
    fornecedorId?: string;
  },
>(items: T[], filters?: CompraFiltersData): T[] {
  let result = [...items];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((item) =>
      Object.values(item as Record<string, unknown>).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(search),
      ),
    );
  }

  if (filters?.status) {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.competencia) {
    result = result.filter((item) => !item.competencia || item.competencia === filters.competencia);
  }

  if (filters?.obraId) {
    result = result.filter((item) => item.obraId === filters.obraId);
  }

  if (filters?.categoria) {
    result = result.filter((item) => item.categoria === filters.categoria);
  }

  if (filters?.prioridade) {
    result = result.filter((item) => item.prioridade === filters.prioridade);
  }

  if (filters?.fornecedorId) {
    result = result.filter((item) => item.fornecedorId === filters.fornecedorId);
  }

  return result;
}

export function calcularComprasKpis(
  solicitacoes: SolicitacaoCompra[],
  cotacoes: CotacaoCompra[],
  pedidos: PedidoCompra[],
): ComprasKpis {
  return {
    totalSolicitacoes: solicitacoes.length,
    solicitacoesPendentes: solicitacoes.filter((item) => item.status === 'pendente_aprovacao').length,
    cotacoesEmAberto: cotacoes.filter((item) => item.status === 'em_cotacao').length,
    pedidosEmitidos: pedidos.filter((item) => ['pedido_emitido', 'aguardando_fiscal', 'recebimento_parcial'].includes(item.status)).length,
    valorComprometido: pedidos.reduce((acc, item) => acc + item.valorComprometidoFinanceiro, 0),
    valorAguardandoFiscal: pedidos
      .filter((item) => item.fiscalStatus !== 'validado')
      .reduce((acc, item) => acc + item.valorPedido, 0),
  };
}

export function gerarComprasResumoCards(
  solicitacoes: SolicitacaoCompra[],
  cotacoes: CotacaoCompra[],
  pedidos: PedidoCompra[],
): ComprasResumoCard[] {
  const maiorPedido = [...pedidos].sort((a, b) => b.valorPedido - a.valorPedido)[0];
  const obraMaisDemandada = [...solicitacoes].reduce<Record<string, { obraNome: string; total: number }>>((acc, item) => {
    const current = acc[item.obraId] ?? { obraNome: item.obraNome, total: 0 };
    acc[item.obraId] = { obraNome: item.obraNome, total: current.total + item.valorEstimado };
    return acc;
  }, {});
  const obraRanking = Object.values(obraMaisDemandada).sort((a, b) => b.total - a.total)[0];

  return [
    {
      id: 'fluxo',
      titulo: 'Fluxo operacional',
      descricao: 'Andamento de solicitações, cotações e pedidos com foco em suprimentos.',
      itens: [
        { label: 'Solicitações abertas', valor: String(solicitacoes.length) },
        { label: 'Cotações em curso', valor: String(cotacoes.filter((item) => item.status === 'em_cotacao').length), destaque: true },
        { label: 'Pedidos emitidos', valor: String(pedidos.filter((item) => item.status === 'pedido_emitido').length) },
      ],
    },
    {
      id: 'obra',
      titulo: 'Obra com maior demanda',
      descricao: 'Leitura inicial para conexão com obra ativa e planejamento físico-financeiro.',
      itens: [
        { label: 'Obra', valor: obraRanking?.obraNome ?? 'Sem dados', destaque: true },
        { label: 'Volume previsto', valor: formatCurrency(obraRanking?.total ?? 0) },
        { label: 'Competência de referência', valor: formatCompetencia(solicitacoes[0]?.competencia ?? '2026-03') },
      ],
    },
    {
      id: 'integracao',
      titulo: 'Integração fiscal e financeira',
      descricao: 'Pedidos que avançam para documentação fiscal e programação de desembolso.',
      itens: [
        { label: 'Maior pedido', valor: maiorPedido ? `${maiorPedido.codigo} • ${formatCurrency(maiorPedido.valorPedido)}` : 'Sem pedidos', destaque: true },
        { label: 'Aguardando fiscal', valor: String(pedidos.filter((item) => item.fiscalStatus !== 'validado').length) },
        { label: 'Previstos no financeiro', valor: String(pedidos.filter((item) => item.financeiroStatus !== 'nao_programado').length) },
      ],
    },
  ];
}

export function gerarComprasStatusResumo(pedidos: PedidoCompra[]): ComprasStatusResumo[] {
  const trackedStatuses = ['pendente_aprovacao', 'em_cotacao', 'pedido_emitido', 'aguardando_fiscal', 'recebimento_parcial', 'concluida'] as const;

  return trackedStatuses.map((status) => {
    const filtered = pedidos.filter((item) => item.status === status);
    return {
      status,
      label: COMPRA_STATUS_LABELS[status],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.valorPedido, 0),
      descricao:
        status === 'aguardando_fiscal'
          ? 'Pedidos que dependem de documentação e validação tributária.'
          : status === 'pedido_emitido'
            ? 'Pedidos emitidos e aguardando recebimento ou programação.'
            : 'Leitura resumida do estágio operacional das compras.',
    };
  });
}
