import type {
  RelatorioCategoria,
  RelatorioCategoriaData,
  RelatorioCategoriaResumo,
  RelatorioCoberturaModulo,
  RelatorioItem,
  RelatorioResumoCardData,
  RelatorioSaidaOperacional,
  RelatoriosDashboardData,
  RelatoriosFiltersData,
  RelatoriosResumoExecutivo,
} from '../types';
import {
  RELATORIO_CATEGORIA_DESCRICOES,
  RELATORIO_CATEGORIA_LABELS,
} from '../types';

const relatorios: RelatorioItem[] = [
  {
    id: 'rel-obras-001',
    codigo: 'REL-OBR-001',
    nome: 'Resumo físico-financeiro por obra',
    categoria: 'obras',
    disponibilidade: 'disponivel',
    descricao: 'Acompanha avanço, custo, medição e posição financeira da obra.',
    origemDados: ['Obras', 'Financeiro', 'Medições'],
    output: {
      formatos: ['pdf', 'xlsx', 'dashboard'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'dashboard',
      tempoEstimado: 'até 20s',
      recorrenciaSugerida: 'Semanal',
    },
    ultimaAtualizacaoEm: '2026-03-21',
  },
  {
    id: 'rel-rh-001',
    codigo: 'REL-RH-001',
    nome: 'Funcionários por obra e status',
    categoria: 'rh',
    disponibilidade: 'disponivel',
    descricao: 'Lista funcionários, alocações e situação documental por obra.',
    origemDados: ['RH', 'Documentos', 'Obras'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'xlsx',
      tempoEstimado: 'até 15s',
      recorrenciaSugerida: 'Quinzenal',
    },
    ultimaAtualizacaoEm: '2026-03-20',
  },
  {
    id: 'rel-he-001',
    codigo: 'REL-HE-001',
    nome: 'Fechamento de horas extras por competência',
    categoria: 'horas-extras',
    disponibilidade: 'disponivel',
    descricao: 'Consolida horas extras aprovadas por obra, equipe e competência.',
    origemDados: ['Horas Extras', 'RH', 'FOPAG'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'xlsx',
      tempoEstimado: 'até 18s',
      recorrenciaSugerida: 'Mensal',
    },
    ultimaAtualizacaoEm: '2026-03-19',
  },
  {
    id: 'rel-fop-001',
    codigo: 'REL-FOP-001',
    nome: 'Previsto x realizado da FOPAG',
    categoria: 'fopag',
    disponibilidade: 'disponivel',
    descricao: 'Compara folha prevista, eventos e reflexos financeiros.',
    origemDados: ['FOPAG', 'Financeiro', 'RH'],
    output: {
      formatos: ['pdf', 'xlsx', 'dashboard'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'dashboard',
      tempoEstimado: 'até 25s',
      recorrenciaSugerida: 'Mensal',
    },
    ultimaAtualizacaoEm: '2026-03-18',
  },
  {
    id: 'rel-com-001',
    codigo: 'REL-COM-001',
    nome: 'Pedidos e comprometido por obra',
    categoria: 'compras',
    disponibilidade: 'disponivel',
    descricao: 'Relaciona solicitações, pedidos e impacto no custo comprometido.',
    origemDados: ['Compras', 'Fiscal', 'Financeiro'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'xlsx',
      tempoEstimado: 'até 16s',
      recorrenciaSugerida: 'Semanal',
    },
    ultimaAtualizacaoEm: '2026-03-21',
  },
  {
    id: 'rel-fis-001',
    codigo: 'REL-FIS-001',
    nome: 'Compliance fiscal e retenções',
    categoria: 'fiscal',
    disponibilidade: 'em_preparacao',
    descricao: 'Mapeia documentos fiscais, retenções e pendências de validação.',
    origemDados: ['Fiscal', 'Compras', 'Financeiro'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: false,
      permiteComparativo: false,
      formatoPrincipal: 'pdf',
      tempoEstimado: 'até 30s',
      recorrenciaSugerida: 'Mensal',
    },
    ultimaAtualizacaoEm: '2026-03-17',
  },
  {
    id: 'rel-fin-001',
    codigo: 'REL-FIN-001',
    nome: 'Fluxo consolidado por obra e origem',
    categoria: 'financeiro',
    disponibilidade: 'disponivel',
    descricao: 'Consolida pagar, receber, medição, folha e compras por obra.',
    origemDados: ['Financeiro', 'FOPAG', 'Compras', 'Medições'],
    output: {
      formatos: ['pdf', 'xlsx', 'dashboard'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'dashboard',
      tempoEstimado: 'até 20s',
      recorrenciaSugerida: 'Diária',
    },
    ultimaAtualizacaoEm: '2026-03-21',
  },
  {
    id: 'rel-est-001',
    codigo: 'REL-EST-001',
    nome: 'Consumo de estoque por obra',
    categoria: 'estoque',
    disponibilidade: 'disponivel',
    descricao: 'Acompanha movimentações, saldos e consumo com vínculo de custo.',
    origemDados: ['Estoque', 'Compras', 'Obras'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'xlsx',
      tempoEstimado: 'até 14s',
      recorrenciaSugerida: 'Semanal',
    },
    ultimaAtualizacaoEm: '2026-03-20',
  },
  {
    id: 'rel-med-001',
    codigo: 'REL-MED-001',
    nome: 'Pipeline de medições e faturamento',
    categoria: 'medicoes',
    disponibilidade: 'disponivel',
    descricao: 'Mostra status de aprovação, faturamento e recebimento por contrato.',
    origemDados: ['Medições', 'Financeiro', 'Obras'],
    output: {
      formatos: ['pdf', 'xlsx', 'dashboard'],
      agendavel: true,
      permiteComparativo: true,
      formatoPrincipal: 'dashboard',
      tempoEstimado: 'até 18s',
      recorrenciaSugerida: 'Semanal',
    },
    ultimaAtualizacaoEm: '2026-03-21',
  },
  {
    id: 'rel-doc-001',
    codigo: 'REL-DOC-001',
    nome: 'Vencimentos e compliance documental',
    categoria: 'documentos',
    disponibilidade: 'planejado',
    descricao: 'Consolida documentos a vencer por obra, funcionário e fornecedor.',
    origemDados: ['Documentos', 'RH', 'Obras', 'Compras'],
    output: {
      formatos: ['pdf', 'xlsx'],
      agendavel: false,
      permiteComparativo: false,
      formatoPrincipal: 'pdf',
      tempoEstimado: 'até 35s',
      recorrenciaSugerida: 'Mensal',
    },
    ultimaAtualizacaoEm: '2026-03-16',
  },
  {
    id: 'rel-hos-001',
    codigo: 'REL-HOS-001',
    nome: 'Dossiê Técnico Hospital da Luz',
    categoria: 'obras',
    disponibilidade: 'disponivel',
    descricao: 'Relatório consolidado de instalações e equipamentos especiais para OBR-007.',
    origemDados: ['Obras', 'Compras', 'Fiscal'],
    output: {
      formatos: ['pdf'],
      agendavel: false,
      permiteComparativo: false,
      formatoPrincipal: 'pdf',
      tempoEstimado: 'até 10s',
      recorrenciaSugerida: 'Sob demanda',
    },
    ultimaAtualizacaoEm: '2026-03-20',
  },
];

function matchesFilters(item: RelatorioItem, filters?: RelatoriosFiltersData) {
  if (!filters) {
    return true;
  }

  const search = filters.search?.trim().toLowerCase();

  if (search) {
    const haystack = [
      item.codigo,
      item.nome,
      item.descricao,
      ...item.origemDados,
    ]
      .join(' ')
      .toLowerCase();

    if (!haystack.includes(search)) {
      return false;
    }
  }

  if (filters.categoria && item.categoria !== filters.categoria) {
    return false;
  }

  if (filters.disponibilidade && item.disponibilidade !== filters.disponibilidade) {
    return false;
  }

  if (filters.formato && !item.output.formatos.includes(filters.formato)) {
    return false;
  }

  return true;
}

export function getMockRelatorios(filters?: RelatoriosFiltersData): RelatorioItem[] {
  return relatorios.filter((item) => matchesFilters(item, filters));
}

function buildCategorias(items: RelatorioItem[]): RelatorioCategoriaResumo[] {
  const categorias = Array.from(
    new Set(relatorios.map((item) => item.categoria)),
  ) as RelatorioCategoria[];

  return categorias.map((categoria) => {
    const categoriaItems = items.filter((item) => item.categoria === categoria);

    return {
      categoria,
      titulo: RELATORIO_CATEGORIA_LABELS[categoria],
      descricao: RELATORIO_CATEGORIA_DESCRICOES[categoria],
      quantidade: categoriaItems.length,
      disponiveis: categoriaItems.filter(
        (item) => item.disponibilidade === 'disponivel',
      ).length,
      formatos: Array.from(
        new Set(categoriaItems.flatMap((item) => item.output.formatos)),
      ),
      modulosRelacionados: Array.from(
        new Set(categoriaItems.flatMap((item) => item.origemDados)),
      ),
    };
  });
}

function buildResumo(items: RelatorioItem[]): RelatoriosResumoExecutivo {
  return {
    totalRelatorios: items.length,
    categoriasAtivas: new Set(items.map((item) => item.categoria)).size,
    disponiveis: items.filter((item) => item.disponibilidade === 'disponivel').length,
    planejados: items.filter((item) => item.disponibilidade === 'planejado').length,
    exportaveis: items.filter((item) =>
      item.output.formatos.some((formato) => ['pdf', 'xlsx', 'csv'].includes(formato)),
    ).length,
  };
}

function buildResumoCards(items: RelatorioItem[]): RelatorioResumoCardData[] {
  const dashboards = items.filter((item) =>
    item.output.formatos.includes('dashboard'),
  ).length;
  const agendaveis = items.filter((item) => item.output.agendavel).length;
  const comparativos = items.filter((item) => item.output.permiteComparativo).length;

  return [
    {
      id: 'operacao',
      titulo: 'Operação do catálogo',
      descricao: 'Leitura de disponibilidade, automação e tempo de resposta da camada gerencial.',
      itens: [
        { label: 'Disponíveis', valor: String(items.filter((item) => item.disponibilidade === 'disponivel').length), destaque: true },
        { label: 'Em preparação', valor: String(items.filter((item) => item.disponibilidade === 'em_preparacao').length) },
        { label: 'Planejados', valor: String(items.filter((item) => item.disponibilidade === 'planejado').length) },
      ],
    },
    {
      id: 'saidas',
      titulo: 'Saídas e distribuição',
      descricao: 'Formatos prontos para uso operacional e distribuição recorrente aos times.',
      itens: [
        { label: 'Dashboards', valor: String(dashboards) },
        { label: 'Agendáveis', valor: String(agendaveis), destaque: true },
        { label: 'Comparativos', valor: String(comparativos) },
      ],
    },
  ];
}

function buildSaidasOperacionais(items: RelatorioItem[]): RelatorioSaidaOperacional[] {
  return items.map((item) => ({
    id: `saida-${item.id}`,
    relatorioId: item.id,
    titulo: item.nome,
    descricao: item.descricao,
    formatoPrincipal: item.output.formatoPrincipal,
    formatosSecundarios: item.output.formatos.filter(
      (formato) => formato !== item.output.formatoPrincipal,
    ),
    destinoPadrao: item.output.formatoPrincipal === 'dashboard'
      ? 'Painel executivo / acompanhamento contínuo'
      : 'Download e distribuição por e-mail interno',
    tempoEstimado: item.output.tempoEstimado,
    agendamento: item.output.agendavel
      ? `Sugestão: ${item.output.recorrenciaSugerida}`
      : 'Execução manual recomendada',
    disponibilidade: item.disponibilidade,
  }));
}

function buildCoberturaModulos(items: RelatorioItem[]): RelatorioCoberturaModulo[] {
  const modulos = Array.from(new Set(items.flatMap((item) => item.origemDados)));

  return modulos.map((modulo) => {
    const quantidadeRelatorios = items.filter((item) => item.origemDados.includes(modulo)).length;
    const status = quantidadeRelatorios >= 2 ? 'coberto' : quantidadeRelatorios === 1 ? 'parcial' : 'planejado';

    return {
      modulo,
      descricao: 'Módulo conectado ao domínio Relatórios para leitura gerencial, exportação e comparação entre contextos.',
      quantidadeRelatorios,
      status,
    };
  });
}

export function getMockRelatoriosDashboard(
  filters?: RelatoriosFiltersData,
): RelatoriosDashboardData {
  const itens = getMockRelatorios(filters);

  return {
    itens,
    categorias: buildCategorias(itens),
    resumo: buildResumo(itens),
    resumoCards: buildResumoCards(itens),
    saidasOperacionais: buildSaidasOperacionais(itens),
    coberturaModulos: buildCoberturaModulos(itens),
  };
}

function buildCategoriaResumoCards(
  categoria: RelatorioCategoria,
  itens: RelatorioItem[],
): RelatorioResumoCardData[] {
  return [
    {
      id: `${categoria}-catalogo`,
      titulo: 'Catálogo da categoria',
      descricao: 'Leitura do portfólio disponível para a categoria selecionada.',
      itens: [
        { label: 'Relatórios', valor: String(itens.length), destaque: true },
        { label: 'Disponíveis', valor: String(itens.filter((item) => item.disponibilidade === 'disponivel').length) },
        { label: 'Formatos', valor: String(new Set(itens.flatMap((item) => item.output.formatos)).size) },
      ],
    },
    {
      id: `${categoria}-integracao`,
      titulo: 'Integração conceitual',
      descricao: 'Origem dos dados consumidos para compor a análise gerencial dessa categoria.',
      itens: [
        { label: 'Módulos fonte', valor: String(new Set(itens.flatMap((item) => item.origemDados)).size) },
        { label: 'Agendáveis', valor: String(itens.filter((item) => item.output.agendavel).length), destaque: true },
        { label: 'Comparativos', valor: String(itens.filter((item) => item.output.permiteComparativo).length) },
      ],
    },
  ];
}

export function getMockRelatorioCategoria(
  categoria: RelatorioCategoria,
  filters?: RelatoriosFiltersData,
): RelatorioCategoriaData {
  const itens = getMockRelatorios({ search: '', ...(filters ?? {}), categoria });

  return {
    categoria,
    itens,
    resumoCards: buildCategoriaResumoCards(categoria, itens),
    saidasOperacionais: buildSaidasOperacionais(itens),
    coberturaModulos: buildCoberturaModulos(itens),
  };
}
