import { buildWorkforceFinancialSummary } from '@/shared/lib/workforceCost';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  FinanceiroDashboardData,
  FinanceiroFiltersData,
  FinanceiroKpis,
  FinanceiroPessoalDashboardData,
  FinanceiroPessoalPrevistoRealizadoItem,
  FinanceiroResumoCardData,
  FinanceiroStatusResumo,
  FinanceiroTipoResumo,
  FluxoCaixaItem,
  TituloFinanceiro,
  TituloFinanceiroDetalhe,
} from '../types';

const staticTitulos: TituloFinanceiro[] = [
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

function getCompetenciaFromFilters(filters?: FinanceiroFiltersData) {
  return filters?.competencia ?? '2026-03';
}

function buildWorkforceTitles(competencia: string): TituloFinanceiro[] {
  const summary = buildWorkforceFinancialSummary(competencia);
  const fopagStatus: TituloFinanceiro['status'] = summary.statusFechamento === 'fechada' ? 'pago' : 'programado';
  const horasExtrasStatus: TituloFinanceiro['status'] = summary.origemHorasExtras.totalLancamentosIntegrados > 0 ? 'programado' : 'previsto';

  const titles: TituloFinanceiro[] = summary.porObra.flatMap((obra, index) => {
    const folhaTitle: TituloFinanceiro = {
      id: `tit-pessoal-fopag-${obra.obraId}-${competencia}`,
      codigo: `FOPAG-${competencia.replace('-', '')}-${String(index + 1).padStart(2, '0')}`,
      tipo: 'pagar',
      status: fopagStatus,
      origem: 'fopag',
      descricao: `Folha e encargos da obra ${obra.obraNome}`,
      obraId: obra.obraId,
      obraNome: obra.obraNome,
      centroCusto: obra.totalCentrosCusto > 1 ? 'Rateio por centros de custo' : 'Centro principal da obra',
      competencia,
      fornecedorCliente: 'Colaboradores e encargos da competência',
      emissao: `${competencia}-01`,
      vencimento: `${competencia}-25`,
      pagamentoRecebimentoPrevisto: `${competencia}-25`,
      valor: Number(obra.valorFopagPrevisto.toFixed(2)),
      valorPagoRecebido: Number(obra.valorFopagRealizado.toFixed(2)),
      observacao: 'Título gerado a partir do snapshot de FOPAG com vínculo por obra e centro de custo.',
    };
    const horaExtraTitle: TituloFinanceiro = {
      id: `tit-pessoal-he-${obra.obraId}-${competencia}`,
      codigo: `HE-${competencia.replace('-', '')}-${String(index + 1).padStart(2, '0')}`,
      tipo: 'pagar',
      status: horasExtrasStatus,
      origem: 'horas_extras',
      descricao: `Horas extras integradas da obra ${obra.obraNome}`,
      obraId: obra.obraId,
      obraNome: obra.obraNome,
      centroCusto: obra.totalCentrosCusto > 1 ? 'Rateio por centros de custo' : 'Centro principal da obra',
      competencia,
      fornecedorCliente: 'Colaboradores com HE aprovada/fechada',
      emissao: `${competencia}-20`,
      vencimento: `${competencia}-28`,
      pagamentoRecebimentoPrevisto: `${competencia}-28`,
      valor: Number(obra.valorHorasExtrasPrevisto.toFixed(2)),
      valorPagoRecebido: Number(obra.valorHorasExtrasRealizado.toFixed(2)),
      observacao: 'Reflexo financeiro das horas extras aprovadas, fechadas e preparadas para compor a FOPAG.',
    };
    return [folhaTitle, horaExtraTitle];
  }).filter((item) => item.valor > 0);

  return titles;
}

function getAllTitulos(filters?: FinanceiroFiltersData) {
  const competencia = getCompetenciaFromFilters(filters);
  return [...buildWorkforceTitles(competencia), ...staticTitulos];
}

function buildFluxoCaixa(filters?: FinanceiroFiltersData): FluxoCaixaItem[] {
  const competencia = getCompetenciaFromFilters(filters);
  const summary = buildWorkforceFinancialSummary(competencia);
  const titulos = getAllTitulos(filters);
  const receber = titulos.filter((item) => item.tipo === 'receber');
  const pagar = titulos.filter((item) => item.tipo === 'pagar');

  return [
    {
      periodo: `${competencia}-22`,
      previstoEntrada: receber.filter((item) => item.competencia === competencia).reduce((acc, item) => acc + item.valor, 0),
      previstoSaida: Number((summary.valorPrevisto * 0.35).toFixed(2)),
      realizadoEntrada: receber.filter((item) => item.status === 'recebido').reduce((acc, item) => acc + item.valorPagoRecebido, 0),
      realizadoSaida: Number((summary.valorRealizado * 0.18).toFixed(2)),
      saldoProjetado: Number((receber.reduce((acc, item) => acc + item.valor, 0) - pagar.reduce((acc, item) => acc + item.valor, 0) + summary.variacao).toFixed(2)),
      status: 'atencao',
    },
    {
      periodo: `${competencia}-25`,
      previstoEntrada: 0,
      previstoSaida: Number(summary.valorFopagPrevisto.toFixed(2)),
      realizadoEntrada: 0,
      realizadoSaida: Number(summary.valorFopagRealizado.toFixed(2)),
      saldoProjetado: Number((-summary.valorFopagPrevisto).toFixed(2)),
      status: summary.statusFechamento === 'fechada' ? 'equilibrio' : 'atencao',
    },
    {
      periodo: `${competencia}-28`,
      previstoEntrada: 0,
      previstoSaida: Number(summary.valorHorasExtrasPrevisto.toFixed(2)),
      realizadoEntrada: 0,
      realizadoSaida: Number(summary.valorHorasExtrasRealizado.toFixed(2)),
      saldoProjetado: Number((-summary.valorHorasExtrasPrevisto).toFixed(2)),
      status: summary.origemHorasExtras.totalLancamentosIntegrados > 0 ? 'equilibrio' : 'atencao',
    },
  ];
}

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

function buildPessoalDashboard(filters?: FinanceiroFiltersData): FinanceiroPessoalDashboardData {
  const competencia = getCompetenciaFromFilters(filters);
  const summary = buildWorkforceFinancialSummary(competencia);
  const previstoRealizado: FinanceiroPessoalPrevistoRealizadoItem[] = [
    {
      id: 'pessoal-fopag',
      categoria: 'fopag',
      label: 'FOPAG e encargos',
      valorPrevisto: summary.valorFopagPrevisto,
      valorRealizado: summary.valorFopagRealizado,
      variacao: summary.valorFopagPrevisto - summary.valorFopagRealizado,
    },
    {
      id: 'pessoal-he',
      categoria: 'horas_extras',
      label: 'Horas Extras',
      valorPrevisto: summary.valorHorasExtrasPrevisto,
      valorRealizado: summary.valorHorasExtrasRealizado,
      variacao: summary.valorHorasExtrasPrevisto - summary.valorHorasExtrasRealizado,
    },
    {
      id: 'pessoal-total',
      categoria: 'custo_total',
      label: 'Custo total de pessoal',
      valorPrevisto: summary.valorPrevisto,
      valorRealizado: summary.valorRealizado,
      variacao: summary.variacao,
    },
  ];

  return {
    competencia: {
      competencia: summary.competencia,
      totalFuncionarios: summary.totalFuncionarios,
      totalObras: summary.totalObras,
      totalCentrosCusto: summary.totalCentrosCusto,
      valorHorasExtrasPrevisto: summary.valorHorasExtrasPrevisto,
      valorHorasExtrasRealizado: summary.valorHorasExtrasRealizado,
      valorFopagPrevisto: summary.valorFopagPrevisto,
      valorFopagRealizado: summary.valorFopagRealizado,
      valorPrevisto: summary.valorPrevisto,
      valorRealizado: summary.valorRealizado,
      variacao: summary.variacao,
      statusFechamento: summary.statusFechamento,
    },
    porObra: summary.porObra,
    porCentroCusto: summary.porCentroCusto,
    previstoRealizado,
    destaques: [
      {
        id: 'pessoal-competencia',
        titulo: `Custo de pessoal · ${formatCompetencia(summary.competencia)}`,
        descricao: 'Resumo financeiro do fluxo Horas Extras → FOPAG → Financeiro, com rastreabilidade por obra e centro de custo.',
        itens: [
          { label: 'Previsto', valor: formatCurrency(summary.valorPrevisto), destaque: true },
          { label: 'Realizado', valor: formatCurrency(summary.valorRealizado) },
          { label: 'Variação', valor: formatCurrency(summary.variacao) },
          { label: 'Status do fechamento', valor: summary.statusFechamento },
        ],
      },
      {
        id: 'pessoal-he',
        titulo: 'Horas Extras integradas',
        descricao: 'Lançamentos elegíveis e já refletidos financeiramente na competência.',
        itens: [
          { label: 'Lançamentos', valor: String(summary.origemHorasExtras.totalLancamentos) },
          { label: 'Elegíveis FOPAG', valor: String(summary.origemHorasExtras.totalLancamentosElegiveis), destaque: true },
          { label: 'Integrados', valor: String(summary.origemHorasExtras.totalLancamentosIntegrados) },
          { label: 'Valor realizado', valor: formatCurrency(summary.valorHorasExtrasRealizado) },
        ],
      },
      {
        id: 'pessoal-alocacao',
        titulo: 'Leitura gerencial por rateio',
        descricao: 'Base preparada para relatórios e comparativos futuros mantendo Obra como eixo central.',
        itens: [
          { label: 'Obras impactadas', valor: String(summary.totalObras) },
          { label: 'Centros de custo', valor: String(summary.totalCentrosCusto) },
          { label: 'Maior obra', valor: summary.porObra[0]?.obraNome ?? '—', destaque: true },
          { label: 'Maior centro', valor: summary.porCentroCusto[0]?.centroCustoNome ?? '—' },
        ],
      },
    ],
  };
}

function buildResumoCards(items: TituloFinanceiro[], pessoal: FinanceiroPessoalDashboardData): FinanceiroResumoCardData[] {
  const fopag = items.filter((item) => item.origem === 'fopag').reduce((acc, item) => acc + item.valor, 0);
  const horasExtras = items.filter((item) => item.origem === 'horas_extras').reduce((acc, item) => acc + item.valor, 0);
  const compras = items.filter((item) => item.origem === 'compras').reduce((acc, item) => acc + item.valor, 0);
  const medicoes = items.filter((item) => item.origem === 'medicoes').reduce((acc, item) => acc + item.valor, 0);
  const pagos = items.filter((item) => item.status === 'pago' || item.status === 'recebido').reduce((acc, item) => acc + item.valorPagoRecebido, 0);

  return [
    {
      id: 'origens',
      titulo: 'Integração entre módulos',
      descricao: 'Financeiro consolidando previsões e realizados vindos de FOPAG, Horas Extras, Compras, Fiscal e Medições.',
      itens: [
        { label: 'FOPAG', valor: formatCurrency(fopag) },
        { label: 'Horas Extras', valor: formatCurrency(horasExtras) },
        { label: 'Compras', valor: formatCurrency(compras) },
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
        { label: 'Custo pessoal previsto', valor: formatCurrency(pessoal.competencia.valorPrevisto) },
        { label: 'Custo pessoal realizado', valor: formatCurrency(pessoal.competencia.valorRealizado) },
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
        { label: 'Cenário pessoal', valor: pessoal.competencia.statusFechamento },
      ],
    },
  ];
}

function buildStatusResumo(items: TituloFinanceiro[]): FinanceiroStatusResumo[] {
  const statuses = new Map<string, { quantidade: number; valor: number }>();
  items.forEach((item) => {
    const current = statuses.get(item.status) ?? { quantidade: 0, valor: 0 };
    current.quantidade += 1;
    current.valor += item.valor;
    statuses.set(item.status, current);
  });

  return [...statuses.entries()].map(([status, data]) => ({
    status: status as FinanceiroStatusResumo['status'],
    label: status.replaceAll('_', ' '),
    descricao: `Títulos em status ${status.replaceAll('_', ' ')}.`,
    quantidade: data.quantidade,
    valor: data.valor,
  }));
}

function buildTipoResumo(items: TituloFinanceiro[]): FinanceiroTipoResumo[] {
  return ['pagar', 'receber'].map((tipo) => ({
    tipo: tipo as FinanceiroTipoResumo['tipo'],
    label: tipo === 'pagar' ? 'Contas a pagar' : 'Contas a receber',
    descricao: tipo === 'pagar' ? 'Saídas monitoradas no financeiro.' : 'Entradas previstas/realizadas.',
    quantidade: items.filter((item) => item.tipo === tipo).length,
    valor: items.filter((item) => item.tipo === tipo).reduce((acc, item) => acc + item.valor, 0),
  }));
}

export function getMockFinanceiroDashboard(filters?: FinanceiroFiltersData): FinanceiroDashboardData {
  const items = getAllTitulos(filters).filter((item) => matchesFilters(item, filters));
  const pessoal = buildPessoalDashboard(filters);
  return {
    titulos: items,
    kpis: buildKpis(items),
    resumoCards: buildResumoCards(items, pessoal),
    statusResumo: buildStatusResumo(items),
    tipoResumo: buildTipoResumo(items),
    pessoal,
  };
}

export function getMockFluxoCaixa(filters?: FinanceiroFiltersData): FluxoCaixaItem[] {
  return buildFluxoCaixa(filters);
}

export function getMockFinanceiroPessoal(filters?: FinanceiroFiltersData): FinanceiroPessoalDashboardData {
  return buildPessoalDashboard(filters);
}

export function getMockTituloFinanceiroById(tituloId: string): TituloFinanceiroDetalhe | null {
  const titulo = getAllTitulos().find((item) => item.id === tituloId);
  if (!titulo) return null;

  return {
    titulo,
    timeline: [
      { id: 'tl-1', label: 'Título originado', descricao: 'Origem do título registrada no módulo de origem.', data: titulo.emissao },
      { id: 'tl-2', label: 'Programação financeira', descricao: 'Título disponibilizado para leitura financeira por competência.', data: titulo.pagamentoRecebimentoPrevisto },
      { id: 'tl-3', label: 'Vencimento', descricao: 'Marco financeiro de pagamento/recebimento.', data: titulo.vencimento },
    ],
    integracoes: [
      { modulo: 'Obras', descricao: 'A obra permanece como eixo principal de custo e leitura gerencial.', href: `/obras/${titulo.obraId}/financeiro` },
      { modulo: 'FOPAG', descricao: 'Competência de folha e encargos relacionada ao custo de pessoal.', href: titulo.origem === 'fopag' ? `/fopag/${titulo.competencia}/financeiro` : undefined },
      { modulo: 'Horas Extras', descricao: 'Lançamentos aprovados/fechados alimentam a leitura financeira do pessoal.', href: titulo.origem === 'horas_extras' ? '/horas-extras' : undefined },
    ],
  };
}
