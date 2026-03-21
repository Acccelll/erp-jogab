import type {
  RelatorioCategoria,
  RelatorioCategoriaResumo,
  RelatorioItem,
  RelatoriosDashboardData,
  RelatoriosFiltersData,
  RelatoriosResumoExecutivo,
} from '../types';
import {
  RELATORIO_CATEGORIA_DESCRICOES,
  RELATORIO_CATEGORIA_LABELS,
} from '../types';

const relatorios: RelatorioItem[] = [
  { id: 'rel-obras-001', codigo: 'REL-OBR-001', nome: 'Resumo físico-financeiro por obra', categoria: 'obras', disponibilidade: 'disponivel', descricao: 'Acompanha avanço, custo, medição e posição financeira da obra.', origemDados: ['Obras', 'Financeiro', 'Medições'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-rh-001', codigo: 'REL-RH-001', nome: 'Funcionários por obra e status', categoria: 'rh', disponibilidade: 'disponivel', descricao: 'Lista funcionários, alocações e situação documental por obra.', origemDados: ['RH', 'Documentos', 'Obras'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-20' },
  { id: 'rel-he-001', codigo: 'REL-HE-001', nome: 'Fechamento de horas extras por competência', categoria: 'horas-extras', disponibilidade: 'disponivel', descricao: 'Consolida horas extras aprovadas por obra, equipe e competência.', origemDados: ['Horas Extras', 'RH', 'FOPAG'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-19' },
  { id: 'rel-fop-001', codigo: 'REL-FOP-001', nome: 'Previsto x realizado da FOPAG', categoria: 'fopag', disponibilidade: 'disponivel', descricao: 'Compara folha prevista, eventos e reflexos financeiros.', origemDados: ['FOPAG', 'Financeiro', 'RH'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-18' },
  { id: 'rel-com-001', codigo: 'REL-COM-001', nome: 'Pedidos e comprometido por obra', categoria: 'compras', disponibilidade: 'disponivel', descricao: 'Relaciona solicitações, pedidos e impacto no custo comprometido.', origemDados: ['Compras', 'Fiscal', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-fis-001', codigo: 'REL-FIS-001', nome: 'Compliance fiscal e retenções', categoria: 'fiscal', disponibilidade: 'em_preparacao', descricao: 'Mapeia documentos fiscais, retenções e pendências de validação.', origemDados: ['Fiscal', 'Compras', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: false, permiteComparativo: false }, ultimaAtualizacaoEm: '2026-03-17' },
  { id: 'rel-fin-001', codigo: 'REL-FIN-001', nome: 'Fluxo consolidado por obra e origem', categoria: 'financeiro', disponibilidade: 'disponivel', descricao: 'Consolida pagar, receber, medição, folha e compras por obra.', origemDados: ['Financeiro', 'FOPAG', 'Compras', 'Medições'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-est-001', codigo: 'REL-EST-001', nome: 'Consumo de estoque por obra', categoria: 'estoque', disponibilidade: 'disponivel', descricao: 'Acompanha movimentações, saldos e consumo com vínculo de custo.', origemDados: ['Estoque', 'Compras', 'Obras'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-20' },
  { id: 'rel-med-001', codigo: 'REL-MED-001', nome: 'Pipeline de medições e faturamento', categoria: 'medicoes', disponibilidade: 'disponivel', descricao: 'Mostra status de aprovação, faturamento e recebimento por contrato.', origemDados: ['Medições', 'Financeiro', 'Obras'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-doc-001', codigo: 'REL-DOC-001', nome: 'Vencimentos e compliance documental', categoria: 'documentos', disponibilidade: 'planejado', descricao: 'Consolida documentos a vencer por obra, funcionário e fornecedor.', origemDados: ['Documentos', 'RH', 'Obras', 'Compras'], output: { formatos: ['pdf', 'xlsx'], agendavel: false, permiteComparativo: false }, ultimaAtualizacaoEm: '2026-03-16' },
];

function matchesFilters(item: RelatorioItem, filters?: RelatoriosFiltersData) {
  if (!filters) return true;

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    const haystack = [item.codigo, item.nome, item.descricao, ...item.origemDados].join(' ').toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (filters.categoria && item.categoria !== filters.categoria) return false;
  if (filters.disponibilidade && item.disponibilidade !== filters.disponibilidade) return false;
  if (filters.formato && !item.output.formatos.includes(filters.formato)) return false;

  return true;
}

export function getMockRelatorios(filters?: RelatoriosFiltersData): RelatorioItem[] {
  return relatorios.filter((item) => matchesFilters(item, filters));
}

function buildCategorias(items: RelatorioItem[]): RelatorioCategoriaResumo[] {
  const categorias = Array.from(new Set(relatorios.map((item) => item.categoria))) as RelatorioCategoria[];
  return categorias.map((categoria) => {
    const categoriaItems = items.filter((item) => item.categoria === categoria);
    return {
      categoria,
      titulo: RELATORIO_CATEGORIA_LABELS[categoria],
      descricao: RELATORIO_CATEGORIA_DESCRICOES[categoria],
      quantidade: categoriaItems.length,
      disponiveis: categoriaItems.filter((item) => item.disponibilidade === 'disponivel').length,
    };
  });
}

function buildResumo(items: RelatorioItem[]): RelatoriosResumoExecutivo {
  return {
    totalRelatorios: items.length,
    categoriasAtivas: new Set(items.map((item) => item.categoria)).size,
    disponiveis: items.filter((item) => item.disponibilidade === 'disponivel').length,
    planejados: items.filter((item) => item.disponibilidade === 'planejado').length,
    exportaveis: items.filter((item) => item.output.formatos.includes('pdf') || item.output.formatos.includes('xlsx') || item.output.formatos.includes('csv')).length,
  };
}

export function getMockRelatoriosDashboard(filters?: RelatoriosFiltersData): RelatoriosDashboardData {
  const itens = getMockRelatorios(filters);
  return {
    itens,
    categorias: buildCategorias(itens),
    resumo: buildResumo(itens),
  };
}

export function getMockRelatorioCategoria(categoria: RelatorioCategoria, filters?: RelatoriosFiltersData): RelatorioItem[] {
  return getMockRelatorios({ search: '', ...(filters ?? {}), categoria });
}
