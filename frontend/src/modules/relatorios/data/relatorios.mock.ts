import { buildExecutiveManagementSnapshot, buildRelatorioGerencialRows } from '@/shared/lib/executiveInsights';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import type {
  RelatorioCategoria,
  RelatorioCategoriaData,
  RelatorioCategoriaResumo,
  RelatorioGerencialCard,
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
  { id: 'rel-obras-001', codigo: 'REL-OBR-001', nome: 'Resumo físico-financeiro por obra', categoria: 'obras', disponibilidade: 'disponivel', descricao: 'Acompanha avanço, custo, FOPAG, horas extras e posição financeira da obra.', origemDados: ['Obras', 'Financeiro', 'FOPAG', 'Horas Extras'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-rh-001', codigo: 'REL-RH-001', nome: 'Funcionários por obra e status', categoria: 'rh', disponibilidade: 'disponivel', descricao: 'Lista funcionários, alocações e situação gerencial por obra e centro de custo.', origemDados: ['RH', 'Obras', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-20' },
  { id: 'rel-he-001', codigo: 'REL-HE-001', nome: 'Fechamento de horas extras por competência', categoria: 'horas-extras', disponibilidade: 'disponivel', descricao: 'Consolida horas extras aprovadas por obra, equipe, centro de custo e competência.', origemDados: ['Horas Extras', 'RH', 'FOPAG', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-19' },
  { id: 'rel-fop-001', codigo: 'REL-FOP-001', nome: 'Previsto x realizado da FOPAG', categoria: 'fopag', disponibilidade: 'disponivel', descricao: 'Compara folha prevista, eventos, rateios e reflexos financeiros.', origemDados: ['FOPAG', 'Financeiro', 'RH', 'Horas Extras'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-18' },
  { id: 'rel-com-001', codigo: 'REL-COM-001', nome: 'Pedidos e comprometido por obra', categoria: 'compras', disponibilidade: 'disponivel', descricao: 'Relaciona solicitações, pedidos e impacto no custo comprometido.', origemDados: ['Compras', 'Fiscal', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
  { id: 'rel-fis-001', codigo: 'REL-FIS-001', nome: 'Compliance fiscal e retenções', categoria: 'fiscal', disponibilidade: 'em_preparacao', descricao: 'Mapeia documentos fiscais, retenções e pendências de validação.', origemDados: ['Fiscal', 'Compras', 'Financeiro'], output: { formatos: ['pdf', 'xlsx'], agendavel: false, permiteComparativo: false }, ultimaAtualizacaoEm: '2026-03-17' },
  { id: 'rel-fin-001', codigo: 'REL-FIN-001', nome: 'Fluxo consolidado por obra e origem', categoria: 'financeiro', disponibilidade: 'disponivel', descricao: 'Consolida pagar, receber, folha, horas extras e previsto x realizado por obra.', origemDados: ['Financeiro', 'FOPAG', 'Horas Extras', 'Obras'], output: { formatos: ['pdf', 'xlsx', 'dashboard'], agendavel: true, permiteComparativo: true }, ultimaAtualizacaoEm: '2026-03-21' },
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
    destaques: buildDestaques(filters),
  };
}

export function getMockRelatorioCategoria(categoria: RelatorioCategoria, filters?: RelatoriosFiltersData): RelatorioItem[] {
  return getMockRelatorios({ search: '', ...(filters ?? {}), categoria });
}

export function getMockRelatorioCategoriaData(categoria: RelatorioCategoria, filters?: RelatoriosFiltersData): RelatorioCategoriaData {
  return buildCategoriaResumo(categoria, filters);
}


function buildDestaques(filters?: RelatoriosFiltersData): RelatorioGerencialCard[] {
  const competencia = filters?.competencia ?? '2026-03';
  const snapshot = buildExecutiveManagementSnapshot(competencia);
  const maiorObra = snapshot.pessoal.porObra[0];
  const maiorCentro = snapshot.pessoal.porCentroCusto[0];

  return [
    {
      id: 'rel-geral-pessoal',
      titulo: `Leitura gerencial · ${formatCompetencia(competencia)}`,
      descricao: 'Resumo executivo reaproveitando os dados já estruturados de Obras, RH, Horas Extras, FOPAG e Financeiro.',
      itens: [
        { label: 'Custo pessoal previsto', valor: formatCurrency(snapshot.pessoal.valorPrevisto), destaque: true },
        { label: 'Custo pessoal realizado', valor: formatCurrency(snapshot.pessoal.valorRealizado) },
        { label: 'Horas extras', valor: `${snapshot.horasExtras.totalHoras.toFixed(1)} h` },
        { label: 'FOPAG consolidada', valor: formatCurrency(snapshot.fopag.competencia.valorPrevisto) },
      ],
    },
    {
      id: 'rel-geral-obra',
      titulo: 'Obra e centro de custo com maior exposição',
      descricao: 'Ponto de partida para relatórios comparativos e filtros avançados futuros.',
      itens: [
        { label: 'Obra', valor: maiorObra?.obraNome ?? '—', destaque: true },
        { label: 'Centro', valor: maiorCentro?.centroCustoNome ?? '—' },
        { label: 'Previsto da obra', valor: formatCurrency(maiorObra?.valorPrevisto ?? 0) },
        { label: 'Realizado da obra', valor: formatCurrency(maiorObra?.valorRealizado ?? 0) },
      ],
    },
  ];
}

function buildCategoriaResumo(categoria: RelatorioCategoria, filters?: RelatoriosFiltersData): RelatorioCategoriaData {
  const competencia = filters?.competencia ?? '2026-03';
  const rows = ['obras', 'rh', 'horas-extras', 'fopag', 'financeiro'].includes(categoria)
    ? buildRelatorioGerencialRows(categoria as 'obras' | 'rh' | 'horas-extras' | 'fopag' | 'financeiro', competencia)
    : [];
  const itens = getMockRelatorioCategoria(categoria, filters);
  const snapshot = buildExecutiveManagementSnapshot(competencia);

  const resumoCards: RelatorioGerencialCard[] = categoria === 'obras'
    ? [
        { id: 'cat-obras-1', titulo: 'Custos por obra', descricao: 'Comparativo resumido de custo de pessoal, avanço e custo realizado.', itens: [
          { label: 'Obras impactadas', valor: String(snapshot.pessoal.totalObras), destaque: true },
          { label: 'Maior obra', valor: snapshot.pessoal.porObra[0]?.obraNome ?? '—' },
          { label: 'Previsto total', valor: formatCurrency(snapshot.pessoal.valorPrevisto) },
          { label: 'Realizado total', valor: formatCurrency(snapshot.pessoal.valorRealizado) },
        ] },
      ]
    : categoria === 'rh'
      ? [
          { id: 'cat-rh-1', titulo: 'Equipe por obra', descricao: 'Visão gerencial de funcionários, alocação e vínculo com centro de custo.', itens: [
            { label: 'Funcionários', valor: String(snapshot.rh.totalFuncionarios) },
            { label: 'Ativos', valor: String(snapshot.rh.ativos), destaque: true },
            { label: 'Alocados', valor: String(snapshot.rh.alocadosEmObra) },
            { label: 'Maior obra', valor: snapshot.rh.maiorObra ?? '—' },
          ] },
        ]
      : categoria === 'horas-extras'
        ? [
            { id: 'cat-he-1', titulo: 'Horas extras por competência', descricao: 'Fechamento operacional com impacto financeiro e futuro reflexo em relatórios comparativos.', itens: [
              { label: 'Total de horas', valor: `${snapshot.horasExtras.totalHoras.toFixed(1)} h`, destaque: true },
              { label: 'Pendentes', valor: String(snapshot.horasExtras.pendentesAprovacao) },
              { label: 'Fechadas p/ FOPAG', valor: String(snapshot.horasExtras.fechadasParaFopag) },
              { label: 'Valor total', valor: formatCurrency(snapshot.horasExtras.valorTotal) },
            ] },
          ]
        : categoria === 'fopag'
          ? [
              { id: 'cat-fopag-1', titulo: 'FOPAG por obra', descricao: 'Consolidação prevista x realizada preparada para leitura executiva e relatórios futuros.', itens: [
                { label: 'Previsto', valor: formatCurrency(snapshot.fopag.competencia.valorPrevisto), destaque: true },
                { label: 'Realizado', valor: formatCurrency(snapshot.fopag.competencia.valorRealizado) },
                { label: 'Horas extras integradas', valor: formatCurrency(snapshot.fopag.financeiro.valorHorasExtrasIntegradas) },
                { label: 'Obras', valor: String(snapshot.fopag.obras.length) },
              ] },
            ]
          : categoria == 'financeiro'
            ? [
                { id: 'cat-fin-1', titulo: 'Financeiro de pessoal', descricao: 'Leitura por centro de custo e previsto x realizado sobre a competência ativa.', itens: [
                  { label: 'Previsto', valor: formatCurrency(snapshot.pessoal.valorPrevisto), destaque: true },
                  { label: 'Realizado', valor: formatCurrency(snapshot.pessoal.valorRealizado) },
                  { label: 'Variação', valor: formatCurrency(snapshot.pessoal.variacao) },
                  { label: 'Centros', valor: String(snapshot.pessoal.totalCentrosCusto) },
                ] },
              ]
            : [];

  return { itens, resumoCards, linhas: rows };
}
