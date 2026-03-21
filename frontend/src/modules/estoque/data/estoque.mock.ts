import { formatCurrency } from '@/shared/lib/utils';
import type {
  EstoqueConsumoObra,
  EstoqueDashboardData,
  EstoqueFiltersData,
  EstoqueItem,
  EstoqueItemDetailData,
  EstoqueKpis,
  EstoqueLocalResumo,
  EstoqueMovimentacao,
  EstoqueResumoCardData,
  EstoqueStatusResumo,
  EstoqueTipoResumo,
} from '../types';
import { ESTOQUE_STATUS_LABELS, ESTOQUE_TIPO_LABELS } from '../types';

const estoqueItens: EstoqueItem[] = [
  {
    id: 'item-001', codigo: 'MAT-CIM-001', descricao: 'Cimento CP II 50kg', unidade: 'SC', tipo: 'material', status: 'disponivel', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-OBR-EST', competencia: '2026-03', fornecedorPrincipal: 'Cimento Forte', documentoFiscal: 'NF-e 88731', pedidoCompraCodigo: 'PC-2401', tituloFinanceiroCodigo: 'TIT-2026-002', saldo: { quantidadeAtual: 480, quantidadeReservada: 120, quantidadeDisponivel: 360, quantidadeMinima: 180, quantidadeMaxima: 800, custoMedioUnitario: 39.9, valorTotal: 19152, coberturaDias: 24 }, consumoMedioMensal: 510, ultimaMovimentacaoEm: '2026-03-18',
  },
  {
    id: 'item-002', codigo: 'ACO-CA50-010', descricao: 'Aço CA-50 10mm', unidade: 'BR', tipo: 'material', status: 'baixo', obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', localId: 'almox-2', localNome: 'Base Operacional BR-101', centroCusto: 'CC-INF-MAT', competencia: '2026-03', fornecedorPrincipal: 'Metalúrgica Sul', documentoFiscal: 'NF-e 19213', pedidoCompraCodigo: 'PC-2412', tituloFinanceiroCodigo: 'TIT-2026-007', saldo: { quantidadeAtual: 95, quantidadeReservada: 40, quantidadeDisponivel: 55, quantidadeMinima: 120, quantidadeMaxima: 300, custoMedioUnitario: 84, valorTotal: 7980, coberturaDias: 9 }, consumoMedioMensal: 180, ultimaMovimentacaoEm: '2026-03-19',
  },
  {
    id: 'item-003', codigo: 'EPI-CAP-023', descricao: 'Capacete com jugular', unidade: 'UN', tipo: 'epi', status: 'reservado', obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', localId: 'almox-3', localNome: 'Almoxarifado Parque', centroCusto: 'CC-SEG-EPI', competencia: '2026-03', fornecedorPrincipal: 'SegPlus', saldo: { quantidadeAtual: 130, quantidadeReservada: 95, quantidadeDisponivel: 35, quantidadeMinima: 50, quantidadeMaxima: 200, custoMedioUnitario: 36.5, valorTotal: 4745, coberturaDias: 11 }, consumoMedioMensal: 115, ultimaMovimentacaoEm: '2026-03-17',
  },
  {
    id: 'item-004', codigo: 'EQP-BET-001', descricao: 'Betoneira 400L', unidade: 'UN', tipo: 'equipamento', status: 'em_transferencia', obraId: 'obra-3', obraNome: 'OBR-003 — Torre Empresarial', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-EQP-LOC', competencia: '2026-03', fornecedorPrincipal: 'MaqLoc Engenharia', pedidoCompraCodigo: 'PC-2388', saldo: { quantidadeAtual: 6, quantidadeReservada: 1, quantidadeDisponivel: 5, quantidadeMinima: 2, quantidadeMaxima: 8, custoMedioUnitario: 8450, valorTotal: 50700, coberturaDias: 45 }, consumoMedioMensal: 1.2, ultimaMovimentacaoEm: '2026-03-20',
  },
  {
    id: 'item-005', codigo: 'COM-DIE-200', descricao: 'Diesel S10', unidade: 'L', tipo: 'combustivel', status: 'aguardando_recebimento', obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', localId: 'almox-2', localNome: 'Base Operacional BR-101', centroCusto: 'CC-LOG-COMB', competencia: '2026-03', fornecedorPrincipal: 'Posto Rodovia', documentoFiscal: 'NF-e 20591', pedidoCompraCodigo: 'PC-2420', saldo: { quantidadeAtual: 2400, quantidadeReservada: 700, quantidadeDisponivel: 1700, quantidadeMinima: 1800, quantidadeMaxima: 5000, custoMedioUnitario: 6.48, valorTotal: 15552, coberturaDias: 13 }, consumoMedioMensal: 5400, ultimaMovimentacaoEm: '2026-03-19',
  },
  {
    id: 'item-006', codigo: 'FER-SER-014', descricao: 'Serra mármore portátil', unidade: 'UN', tipo: 'ferramenta', status: 'sem_saldo', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-OBR-FER', competencia: '2026-03', fornecedorPrincipal: 'Ferramentas Brasil', saldo: { quantidadeAtual: 0, quantidadeReservada: 0, quantidadeDisponivel: 0, quantidadeMinima: 2, quantidadeMaxima: 6, custoMedioUnitario: 690, valorTotal: 0, coberturaDias: 0 }, consumoMedioMensal: 1.5, ultimaMovimentacaoEm: '2026-03-14',
  },
];

const estoqueMovimentacoes: EstoqueMovimentacao[] = [
  { id: 'mov-001', itemId: 'item-001', itemCodigo: 'MAT-CIM-001', itemDescricao: 'Cimento CP II 50kg', tipo: 'entrada_compra', status: 'disponivel', origem: 'compras', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-OBR-EST', competencia: '2026-03', quantidade: 300, unidade: 'SC', valorMovimento: 11970, saldoAposMovimento: 480, documentoReferencia: 'NF-e 88731', pedidoCompraCodigo: 'PC-2401', tituloFinanceiroCodigo: 'TIT-2026-002', responsavelNome: 'Larissa Nogueira', observacao: 'Recebimento fiscal validado e disponível para consumo na obra.', dataMovimentacao: '2026-03-18' },
  { id: 'mov-002', itemId: 'item-001', itemCodigo: 'MAT-CIM-001', itemDescricao: 'Cimento CP II 50kg', tipo: 'saida_consumo', status: 'disponivel', origem: 'obra', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-OBR-EST', competencia: '2026-03', quantidade: 80, unidade: 'SC', valorMovimento: 3192, saldoAposMovimento: 400, responsavelNome: 'Carlos Mendes', observacao: 'Baixa de consumo para concretagem do bloco B.', dataMovimentacao: '2026-03-19' },
  { id: 'mov-003', itemId: 'item-002', itemCodigo: 'ACO-CA50-010', itemDescricao: 'Aço CA-50 10mm', tipo: 'saida_consumo', status: 'baixo', origem: 'obra', obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', localId: 'almox-2', localNome: 'Base Operacional BR-101', centroCusto: 'CC-INF-MAT', competencia: '2026-03', quantidade: 35, unidade: 'BR', valorMovimento: 2940, saldoAposMovimento: 95, responsavelNome: 'Renata Alves', observacao: 'Consumo direcionado à armação do trecho norte.', dataMovimentacao: '2026-03-19' },
  { id: 'mov-004', itemId: 'item-004', itemCodigo: 'EQP-BET-001', itemDescricao: 'Betoneira 400L', tipo: 'transferencia_envio', status: 'em_transferencia', origem: 'obra', obraId: 'obra-3', obraNome: 'OBR-003 — Torre Empresarial', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-EQP-LOC', competencia: '2026-03', quantidade: 1, unidade: 'UN', valorMovimento: 8450, saldoAposMovimento: 5, responsavelNome: 'Fernanda Cruz', observacao: 'Equipamento em trânsito para apoio à obra OBR-002.', dataMovimentacao: '2026-03-20' },
  { id: 'mov-005', itemId: 'item-005', itemCodigo: 'COM-DIE-200', itemDescricao: 'Diesel S10', tipo: 'entrada_compra', status: 'aguardando_recebimento', origem: 'fiscal', obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', localId: 'almox-2', localNome: 'Base Operacional BR-101', centroCusto: 'CC-LOG-COMB', competencia: '2026-03', quantidade: 1600, unidade: 'L', valorMovimento: 10368, saldoAposMovimento: 2400, documentoReferencia: 'NF-e 20591', pedidoCompraCodigo: 'PC-2420', responsavelNome: 'João Felipe', observacao: 'Recebimento pendente de conferência física e fechamento fiscal.', dataMovimentacao: '2026-03-19' },
  { id: 'mov-006', itemId: 'item-006', itemCodigo: 'FER-SER-014', itemDescricao: 'Serra mármore portátil', tipo: 'ajuste', status: 'sem_saldo', origem: 'manual', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', localId: 'almox-1', localNome: 'Almoxarifado Central SP', centroCusto: 'CC-OBR-FER', competencia: '2026-03', quantidade: -1, unidade: 'UN', valorMovimento: -690, saldoAposMovimento: 0, responsavelNome: 'Marcelo Prado', observacao: 'Ajuste após inventário e baixa por avaria irreversível.', dataMovimentacao: '2026-03-14' },
  { id: 'mov-007', itemId: 'item-003', itemCodigo: 'EPI-CAP-023', itemDescricao: 'Capacete com jugular', tipo: 'saida_consumo', status: 'reservado', origem: 'obra', obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', localId: 'almox-3', localNome: 'Almoxarifado Parque', centroCusto: 'CC-SEG-EPI', competencia: '2026-03', quantidade: 60, unidade: 'UN', valorMovimento: 2190, saldoAposMovimento: 130, responsavelNome: 'Aline Rocha', observacao: 'Distribuição para nova frente de trabalho e equipe terceirizada.', dataMovimentacao: '2026-03-17' },
];

const consumoPorItem: Record<string, EstoqueConsumoObra[]> = {
  'item-001': [
    { obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', centroCusto: 'CC-OBR-EST', quantidadeConsumida: 260, valorConsumido: 10374, ultimaLeituraEm: '2026-03-19' },
    { obraId: 'obra-3', obraNome: 'OBR-003 — Torre Empresarial', centroCusto: 'CC-CON-MAT', quantidadeConsumida: 42, valorConsumido: 1675.8, ultimaLeituraEm: '2026-03-12' },
  ],
  'item-002': [
    { obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', centroCusto: 'CC-INF-MAT', quantidadeConsumida: 125, valorConsumido: 10500, ultimaLeituraEm: '2026-03-19' },
  ],
  'item-003': [
    { obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', centroCusto: 'CC-SEG-EPI', quantidadeConsumida: 92, valorConsumido: 3358, ultimaLeituraEm: '2026-03-17' },
  ],
};

function matchesSearch(haystack: string, search?: string) {
  if (!search?.trim()) return true;
  return haystack.toLowerCase().includes(search.trim().toLowerCase());
}

export function applyEstoqueFilters<T extends EstoqueItem | EstoqueMovimentacao>(items: T[], filters?: EstoqueFiltersData): T[] {
  if (!filters) return items;

  return items.filter((item) => {
    const haystack = 'descricao' in item
      ? [item.codigo, item.descricao, item.obraNome, item.localNome, item.centroCusto, item.documentoFiscal, item.pedidoCompraCodigo, item.tituloFinanceiroCodigo].filter(Boolean).join(' ')
      : [item.itemCodigo, item.itemDescricao, item.obraNome, item.localNome, item.centroCusto, item.documentoReferencia, item.pedidoCompraCodigo, item.tituloFinanceiroCodigo, item.responsavelNome].filter(Boolean).join(' ');

    if (!matchesSearch(haystack, filters.search)) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.localId && item.localId !== filters.localId) return false;
    if (filters.competencia && item.competencia !== filters.competencia) return false;
    if (filters.obraId && item.obraId !== filters.obraId) return false;
    if ('tipo' in item) {
      if (filters.tipo && item.tipo !== filters.tipo) return false;
    } else {
      const movimentacao = item as EstoqueMovimentacao;
      if (filters.movimentacaoTipo && movimentacao.tipo !== filters.movimentacaoTipo) return false;
    }

    return true;
  });
}

export function calcularEstoqueKpis(items: EstoqueItem[], movimentacoes: EstoqueMovimentacao[]): EstoqueKpis {
  return {
    totalItens: items.length,
    itensCriticos: items.filter((item) => item.status === 'baixo' || item.status === 'sem_saldo').length,
    locaisAtivos: new Set(items.map((item) => item.localId)).size,
    valorEstocado: items.reduce((total, item) => total + item.saldo.valorTotal, 0),
    valorReservado: items.reduce((total, item) => total + (item.saldo.quantidadeReservada * item.saldo.custoMedioUnitario), 0),
    consumoMensal: items.reduce((total, item) => total + (item.consumoMedioMensal * item.saldo.custoMedioUnitario), 0),
    entradasPendentes: movimentacoes.filter((mov) => mov.status === 'aguardando_recebimento').length,
  };
}

export function gerarEstoqueResumoCards(items: EstoqueItem[], movimentacoes: EstoqueMovimentacao[]): EstoqueResumoCardData[] {
  const comprasPendentes = movimentacoes.filter((mov) => mov.tipo === 'entrada_compra' && mov.status === 'aguardando_recebimento');
  const transferencias = movimentacoes.filter((mov) => mov.tipo.includes('transferencia'));
  const itensFinanceiro = items.filter((item) => item.tituloFinanceiroCodigo);

  return [
    {
      id: 'integracao-compras-fiscal',
      titulo: 'Integração com Compras e Fiscal',
      descricao: 'Entradas aguardando conferência fiscal e pedidos de compra com reflexo direto no saldo por local.',
      itens: [
        { label: 'Entradas pendentes', valor: String(comprasPendentes.length) },
        { label: 'Pedidos vinculados', valor: String(items.filter((item) => item.pedidoCompraCodigo).length), destaque: true },
        { label: 'Docs fiscais rastreados', valor: String(items.filter((item) => item.documentoFiscal).length) },
      ],
    },
    {
      id: 'integracao-obra',
      titulo: 'Leitura de consumo por obra',
      descricao: 'Baixas operacionais apropriadas à obra e ao centro de custo para apoiar custo realizado e produtividade.',
      itens: [
        { label: 'Saídas para consumo', valor: String(movimentacoes.filter((mov) => mov.tipo === 'saida_consumo').length) },
        { label: 'Obras atendidas', valor: String(new Set(items.map((item) => item.obraId)).size), destaque: true },
        { label: 'Maior cobertura', valor: `${Math.max(...items.map((item) => item.saldo.coberturaDias), 0)} dias` },
      ],
    },
    {
      id: 'integracao-financeiro',
      titulo: 'Reflexo financeiro do estoque',
      descricao: 'Itens com título financeiro associado e valor estocado disponível para leitura de comprometido x realizado.',
      itens: [
        { label: 'Itens com financeiro', valor: String(itensFinanceiro.length) },
        { label: 'Valor em estoque', valor: formatCurrency(items.reduce((acc, item) => acc + item.saldo.valorTotal, 0)), destaque: true },
        { label: 'Transferências em curso', valor: String(transferencias.length) },
      ],
    },
  ];
}

export function gerarEstoqueStatusResumo(items: EstoqueItem[]): EstoqueStatusResumo[] {
  const statuses = Array.from(new Set(items.map((item) => item.status)));

  return statuses.map((status) => {
    const filtered = items.filter((item) => item.status === status);
    return {
      status,
      label: ESTOQUE_STATUS_LABELS[status],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.saldo.valorTotal, 0),
      descricao: status === 'baixo' || status === 'sem_saldo'
        ? 'Itens com risco imediato de ruptura ou necessidade de reposição.'
        : 'Itens acompanhados no estoque com rastreabilidade por status operacional.',
    };
  });
}

export function gerarEstoqueLocalResumo(items: EstoqueItem[]): EstoqueLocalResumo[] {
  return Array.from(new Set(items.map((item) => item.localId))).map((localId) => {
    const filtered = items.filter((item) => item.localId === localId);
    return {
      localId,
      localNome: filtered[0]?.localNome ?? localId,
      quantidadeItens: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.saldo.valorTotal, 0),
      descricao: `Leitura consolidada de ${filtered.length} item(ns) para o local com obra e centro de custo vinculados.`,
    };
  });
}

export function gerarEstoqueTipoResumo(items: EstoqueItem[]): EstoqueTipoResumo[] {
  return Array.from(new Set(items.map((item) => item.tipo))).map((tipo) => {
    const filtered = items.filter((item) => item.tipo === tipo);
    return {
      tipo,
      label: ESTOQUE_TIPO_LABELS[tipo],
      quantidade: filtered.length,
      valor: filtered.reduce((acc, item) => acc + item.saldo.valorTotal, 0),
    };
  });
}

export function getMockEstoqueDashboard(filters?: EstoqueFiltersData): EstoqueDashboardData {
  const itens = applyEstoqueFilters(estoqueItens, filters);
  const movimentacoes = applyEstoqueFilters(estoqueMovimentacoes, filters);

  return {
    itens,
    movimentacoes,
    kpis: calcularEstoqueKpis(itens, movimentacoes),
    resumoCards: gerarEstoqueResumoCards(itens, movimentacoes),
    statusResumo: gerarEstoqueStatusResumo(itens),
    localResumo: gerarEstoqueLocalResumo(itens),
    tipoResumo: gerarEstoqueTipoResumo(itens),
  };
}

export function getMockMovimentacoesEstoque(filters?: EstoqueFiltersData): EstoqueMovimentacao[] {
  return applyEstoqueFilters(estoqueMovimentacoes, filters)
    .slice()
    .sort((a, b) => b.dataMovimentacao.localeCompare(a.dataMovimentacao));
}

export function getMockItemEstoqueById(itemId: string): EstoqueItemDetailData | null {
  const item = estoqueItens.find((currentItem) => currentItem.id === itemId);
  if (!item) return null;

  return {
    item,
    movimentacoes: estoqueMovimentacoes.filter((mov) => mov.itemId === itemId).sort((a, b) => b.dataMovimentacao.localeCompare(a.dataMovimentacao)),
    consumoPorObra: consumoPorItem[itemId] ?? [],
    observacoes: [
      'Preparado para receber rastreabilidade por lote, série e inventário cíclico em fases futuras.',
      'Integração conceitual prevista com compras, fiscal, obra e financeiro preservando obra/competência/centro de custo.',
      'Leituras atuais utilizam mocks controlados até disponibilidade do backend real.',
    ],
  };
}
