import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FinanceiroDashboardData,
  FinanceiroFiltersData,
  FinanceiroKpis,
  FinanceiroResumoCardData,
  FinanceiroStatusResumo,
  FinanceiroTipoResumo,
  FluxoCaixaItem,
  TituloFinanceiro,
  TituloFinanceiroDetalhe,
} from '../types';

const titulos: TituloFinanceiro[] = [
  {
    id: 'tit-001',
    codigo: 'TIT-2026-001',
    tipo: 'pagar',
    status: 'programado',
    origem: 'fopag',
    descricao: 'Folha salarial administrativa - março/2026',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    centroCusto: 'CC-RH-ADM',
    competencia: '2026-03',
    fornecedorCliente: 'Equipe administrativa',
    emissao: '2026-03-01',
    vencimento: '2026-03-25',
    pagamentoRecebimentoPrevisto: '2026-03-25',
    valor: 182450.32,
    valorPagoRecebido: 0,
    observacao: 'Título originado na consolidação da FOPAG com rateio por obra.',
  },
  {
    id: 'tit-002',
    codigo: 'TIT-2026-002',
    tipo: 'pagar',
    status: 'aguardando_documentos',
    origem: 'compras',
    descricao: 'Pagamento de concreto usinado - pedido PC-2401',
    obraId: 'obra-4',
    obraNome: 'OBR-004 — Ponte BR-101',
    centroCusto: 'CC-SUP-EST',
    competencia: '2026-03',
    documentoNumero: 'NF-e 88731',
    fornecedorCliente: 'Concreforte Materiais',
    emissao: '2026-03-04',
    vencimento: '2026-03-22',
    pagamentoRecebimentoPrevisto: '2026-03-24',
    valor: 96420,
    valorPagoRecebido: 0,
    observacao: 'Aguardando validação fiscal para consolidar estoque e liberar pagamento.',
  },
  {
    id: 'tit-003',
    codigo: 'TIT-2026-003',
    tipo: 'receber',
    status: 'previsto',
    origem: 'medicoes',
    descricao: 'Medição parcial do contrato CP-88',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    centroCusto: 'CC-FAT-OBR',
    competencia: '2026-03',
    fornecedorCliente: 'Cliente Parque SPE',
    emissao: '2026-03-05',
    vencimento: '2026-03-30',
    pagamentoRecebimentoPrevisto: '2026-04-02',
    valor: 245000,
    valorPagoRecebido: 0,
    observacao: 'Previsto a partir da medição aprovada e pronto para faturamento.',
  },
  {
    id: 'tit-004',
    codigo: 'TIT-2026-004',
    tipo: 'pagar',
    status: 'vencido',
    origem: 'fiscal',
    descricao: 'Guia de tributos retidos sobre serviços terceirizados',
    obraId: 'obra-3',
    obraNome: 'OBR-003 — Torre Empresarial',
    centroCusto: 'CC-FIS-TRI',
    competencia: '2026-02',
    documentoNumero: 'DARF 11902',
    fornecedorCliente: 'Receita Federal',
    emissao: '2026-02-28',
    vencimento: '2026-03-10',
    pagamentoRecebimentoPrevisto: '2026-03-20',
    valor: 18320.55,
    valorPagoRecebido: 0,
    observacao: 'Título com impacto fiscal e necessidade de regularização imediata.',
  },
  {
    id: 'tit-005',
    codigo: 'TIT-2026-005',
    tipo: 'receber',
    status: 'recebido',
    origem: 'manual',
    descricao: 'Reembolso contratual de mobilização',
    obraId: 'obra-1',
    obraNome: 'OBR-001 — Edifício Aurora',
    centroCusto: 'CC-CON-REC',
    competencia: '2026-03',
    fornecedorCliente: 'Aurora Desenvolvimento Imobiliário',
    emissao: '2026-03-02',
    vencimento: '2026-03-18',
    pagamentoRecebimentoPrevisto: '2026-03-17',
    valor: 38750,
    valorPagoRecebido: 38750,
    observacao: 'Recebimento já conciliado com extrato bancário.',
  },
  {
    id: 'tit-006',
    codigo: 'TIT-2026-006',
    tipo: 'pagar',
    status: 'pago',
    origem: 'compras',
    descricao: 'Locação de equipamentos de içamento',
    obraId: 'obra-2',
    obraNome: 'OBR-002 — Residencial Parque',
    centroCusto: 'CC-EQP-LOC',
    competencia: '2026-03',
    documentoNumero: 'NFSe 1198',
    fornecedorCliente: 'MaqLoc Engenharia',
    emissao: '2026-03-01',
    vencimento: '2026-03-15',
    pagamentoRecebimentoPrevisto: '2026-03-15',
    valor: 52640,
    valorPagoRecebido: 52640,
    observacao: 'Compra já integrada ao comprometido da obra e quitada.',
  },
];

const fluxoCaixa: FluxoCaixaItem[] = [
  {
    periodo: '2026-03-18',
    previstoEntrada: 40000,
    previstoSaida: 52300,
    realizadoEntrada: 38750,
    realizadoSaida: 0,
    saldoProjetado: -13550,
    status: 'atencao',
  },
  {
    periodo: '2026-03-22',
    previstoEntrada: 0,
    previstoSaida: 96420,
    realizadoEntrada: 0,
    realizadoSaida: 0,
    saldoProjetado: -109970,
    status: 'atencao',
  },
  {
    periodo: '2026-03-25',
    previstoEntrada: 0,
    previstoSaida: 182450.32,
    realizadoEntrada: 0,
    realizadoSaida: 0,
    saldoProjetado: -292420.32,
    status: 'equilibrio',
  },
  {
    periodo: '2026-04-02',
    previstoEntrada: 245000,
    previstoSaida: 0,
    realizadoEntrada: 0,
    realizadoSaida: 0,
    saldoProjetado: -47420.32,
    status: 'superavit',
  },
];

function matchesFilters(item: TituloFinanceiro, filters?: FinanceiroFiltersData) {
  if (!filters) return true;

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    const haystack = [
      item.codigo,
      item.descricao,
      item.obraNome,
      item.fornecedorCliente,
      item.documentoNumero,
      item.centroCusto,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.status && item.status !== filters.status) return false;
  if (filters.tipo && item.tipo !== filters.tipo) return false;
  if (filters.origem && item.origem !== filters.origem) return false;
  if (filters.competencia && item.competencia !== filters.competencia) return false;
  if (filters.obraId && item.obraId !== filters.obraId) return false;

  return true;
}

function buildKpis(items: TituloFinanceiro[]): FinanceiroKpis {
  const valorPagar = items.filter((item) => item.tipo === 'pagar').reduce((acc, item) => acc + item.valor, 0);
  const valorReceber = items.filter((item) => item.tipo === 'receber').reduce((acc, item) => acc + item.valor, 0);
  const valorVencido = items.filter((item) => item.status === 'vencido').reduce((acc, item) => acc + item.valor, 0);
  const saldoProjetado = valorReceber - valorPagar;

  return {
    totalTitulos: items.length,
    totalPagar: items.filter((item) => item.tipo === 'pagar').length,
    totalReceber: items.filter((item) => item.tipo === 'receber').length,
    valorPagar,
    valorReceber,
    valorVencido,
    saldoProjetado,
  };
}

function buildResumoCards(items: TituloFinanceiro[]): FinanceiroResumoCardData[] {
  const fopag = items.filter((item) => item.origem === 'fopag').reduce((acc, item) => acc + item.valor, 0);
  const compras = items.filter((item) => item.origem === 'compras').reduce((acc, item) => acc + item.valor, 0);
  const fiscal = items.filter((item) => item.origem === 'fiscal').reduce((acc, item) => acc + item.valor, 0);
  const medicoes = items.filter((item) => item.origem === 'medicoes').reduce((acc, item) => acc + item.valor, 0);
  const pagos = items.filter((item) => item.status === 'pago' || item.status === 'recebido').reduce((acc, item) => acc + item.valorPagoRecebido, 0);

  return [
    {
      id: 'origens',
      titulo: 'Integração entre módulos',
      descricao: 'Financeiro consolidando previsões e realizados vindos de FOPAG, Compras, Fiscal e Medições.',
      itens: [
        { label: 'FOPAG', valor: formatCurrency(fopag) },
        { label: 'Compras', valor: formatCurrency(compras) },
        { label: 'Fiscal', valor: formatCurrency(fiscal) },
        { label: 'Medições', valor: formatCurrency(medicoes), destaque: true },
      ],
    },
    {
      id: 'execucao',
      titulo: 'Execução financeira',
      descricao: 'Leitura dos títulos que já geraram caixa ou ainda demandam programação/aprovação.',
      itens: [
        { label: 'Liquidados', valor: formatCurrency(pagos), destaque: true },
        { label: 'Vencidos', valor: formatCurrency(items.filter((item) => item.status === 'vencido').reduce((acc, item) => acc + item.valor, 0)) },
        { label: 'Em aprovação', valor: String(items.filter((item) => item.status === 'em_aprovacao').length) },
      ],
    },
    {
      id: 'competencia',
      titulo: 'Competência ativa',
      descricao: 'Distribuição de títulos vinculados à competência e à obra ativa para programação do caixa.',
      itens: [
        { label: 'Competências mapeadas', valor: String(new Set(items.map((item) => item.competencia)).size) },
        { label: 'Obras com títulos', valor: String(new Set(items.map((item) => item.obraId)).size) },
        { label: 'Maior exposição', valor: formatCurrency(Math.max(...items.map((item) => item.valor), 0)), destaque: true },
      ],
    },
  ];
}

function buildStatusResumo(items: TituloFinanceiro[]): FinanceiroStatusResumo[] {
  const catalog: Array<Pick<FinanceiroStatusResumo, 'status' | 'label' | 'descricao'>> = [
    { status: 'previsto', label: 'Previsto', descricao: 'Títulos ainda em projeção e preparação operacional.' },
    { status: 'programado', label: 'Programado', descricao: 'Títulos já previstos na agenda de pagamentos.' },
    { status: 'aguardando_documentos', label: 'Aguardando documentos', descricao: 'Dependem de conferência fiscal/documental para avançar.' },
    { status: 'vencido', label: 'Vencido', descricao: 'Exigem atuação imediata para evitar impacto financeiro e fiscal.' },
    { status: 'pago', label: 'Pago', descricao: 'Saídas liquidadas e refletidas no caixa.' },
    { status: 'recebido', label: 'Recebido', descricao: 'Entradas já efetivadas e conciliadas.' },
  ];

  return catalog.map((entry) => {
    const selected = items.filter((item) => item.status === entry.status);
    return {
      ...entry,
      quantidade: selected.length,
      valor: selected.reduce((acc, item) => acc + item.valor, 0),
    };
  });
}

function buildTipoResumo(items: TituloFinanceiro[]): FinanceiroTipoResumo[] {
  return [
    {
      tipo: 'pagar',
      label: 'Contas a pagar',
      descricao: 'Compromissos vindos de FOPAG, compras e fiscal com impacto em desembolso.',
      quantidade: items.filter((item) => item.tipo === 'pagar').length,
      valor: items.filter((item) => item.tipo === 'pagar').reduce((acc, item) => acc + item.valor, 0),
    },
    {
      tipo: 'receber',
      label: 'Contas a receber',
      descricao: 'Entradas previstas/realizadas ligadas a contratos, medições e ajustes financeiros.',
      quantidade: items.filter((item) => item.tipo === 'receber').length,
      valor: items.filter((item) => item.tipo === 'receber').reduce((acc, item) => acc + item.valor, 0),
    },
  ];
}

export function getMockTitulosFinanceiros(filters?: FinanceiroFiltersData): TituloFinanceiro[] {
  return titulos.filter((item) => matchesFilters(item, filters));
}

export function getMockFinanceiroDashboard(filters?: FinanceiroFiltersData): FinanceiroDashboardData {
  const filtered = getMockTitulosFinanceiros(filters);

  return {
    titulos: filtered,
    kpis: buildKpis(filtered),
    resumoCards: buildResumoCards(filtered),
    statusResumo: buildStatusResumo(filtered),
    tipoResumo: buildTipoResumo(filtered),
  };
}

export function getMockFluxoCaixa(filters?: FinanceiroFiltersData): FluxoCaixaItem[] {
  const filtered = filters?.competencia
    ? fluxoCaixa.filter((item) => item.periodo.startsWith(filters.competencia))
    : fluxoCaixa;

  return filtered;
}

export function getMockTituloFinanceiroById(tituloId: string): TituloFinanceiroDetalhe | undefined {
  const titulo = titulos.find((item) => item.id === tituloId);
  if (!titulo) return undefined;

  return {
    titulo,
    timeline: [
      {
        id: 'evt-1',
        label: 'Título gerado',
        descricao: `Título criado a partir da origem ${titulo.origem.toUpperCase()} na competência ${formatCompetencia(titulo.competencia)}.`,
        data: titulo.emissao,
      },
      {
        id: 'evt-2',
        label: 'Programação financeira',
        descricao: 'Título incorporado à programação de caixa da obra e do centro de custo.',
        data: titulo.pagamentoRecebimentoPrevisto,
      },
      {
        id: 'evt-3',
        label: 'Rastreabilidade operacional',
        descricao: `Origem conectada a ${titulo.origem === 'medicoes' ? 'Medições/Faturamento' : titulo.origem.charAt(0).toUpperCase() + titulo.origem.slice(1)} para acompanhamento cruzado.`,
        data: titulo.vencimento,
      },
    ],
    integracoes: [
      {
        modulo: 'Obras',
        descricao: `Obra vinculada: ${titulo.obraNome}.`,
        href: `/obras/${titulo.obraId}`,
      },
      {
        modulo: 'FOPAG',
        descricao: 'Previsões de folha devem refletir programação de desembolso quando a origem for FOPAG.',
        href: titulo.origem === 'fopag' ? '/fopag' : undefined,
      },
      {
        modulo: 'Compras',
        descricao: 'Pedidos de compra e recebimentos fiscais retroalimentam o comprometido do caixa.',
        href: titulo.origem === 'compras' ? '/compras/pedidos' : '/compras',
      },
      {
        modulo: 'Fiscal',
        descricao: 'Documentos e obrigações fiscais influenciam liberação, retenção e vencimentos.',
        href: titulo.documentoNumero ? '/fiscal' : undefined,
      },
    ],
  };
}
