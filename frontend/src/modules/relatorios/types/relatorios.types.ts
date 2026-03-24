import type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida } from './relatorios.schema';

export type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida } from './relatorios.schema';
export type { RelatoriosFiltersData } from './relatorios-filters.schema';

export interface RelatorioOutputConfig {
  formatos: RelatorioSaida[];
  agendavel: boolean;
  permiteComparativo: boolean;
  formatoPrincipal: RelatorioSaida;
  tempoEstimado: string;
  recorrenciaSugerida: string;
}

export interface RelatorioItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: RelatorioCategoria;
  disponibilidade: RelatorioDisponibilidade;
  descricao: string;
  origemDados: string[];
  output: RelatorioOutputConfig;
  ultimaAtualizacaoEm: string;
}

export interface RelatorioCategoriaResumo {
  categoria: RelatorioCategoria;
  titulo: string;
  descricao: string;
  quantidade: number;
  disponiveis: number;
  formatos: RelatorioSaida[];
  modulosRelacionados: string[];
}

export interface RelatoriosResumoExecutivo {
  totalRelatorios: number;
  categoriasAtivas: number;
  disponiveis: number;
  planejados: number;
  exportaveis: number;
}

export interface RelatorioResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: Array<{
    label: string;
    valor: string;
    destaque?: boolean;
  }>;
}

export interface RelatorioSaidaOperacional {
  id: string;
  relatorioId: string;
  titulo: string;
  descricao: string;
  formatoPrincipal: RelatorioSaida;
  formatosSecundarios: RelatorioSaida[];
  destinoPadrao: string;
  tempoEstimado: string;
  agendamento: string;
  disponibilidade: RelatorioDisponibilidade;
}

export interface RelatorioCoberturaModulo {
  modulo: string;
  descricao: string;
  quantidadeRelatorios: number;
  status: 'coberto' | 'parcial' | 'planejado';
}

export interface RelatoriosDashboardData {
  itens: RelatorioItem[];
  categorias: RelatorioCategoriaResumo[];
  resumo: RelatoriosResumoExecutivo;
  resumoCards: RelatorioResumoCardData[];
  saidasOperacionais: RelatorioSaidaOperacional[];
  coberturaModulos: RelatorioCoberturaModulo[];
}

export interface RelatorioCategoriaData {
  categoria: RelatorioCategoria;
  itens: RelatorioItem[];
  resumoCards: RelatorioResumoCardData[];
  saidasOperacionais: RelatorioSaidaOperacional[];
  coberturaModulos: RelatorioCoberturaModulo[];
}

export const RELATORIO_CATEGORIA_LABELS: Record<RelatorioCategoria, string> = {
  obras: 'Obras',
  rh: 'RH',
  'horas-extras': 'Horas Extras',
  fopag: 'FOPAG',
  compras: 'Compras',
  fiscal: 'Fiscal',
  financeiro: 'Financeiro',
  estoque: 'Estoque',
  medicoes: 'Medições',
  documentos: 'Documentos',
};

export const RELATORIO_CATEGORIA_DESCRICOES: Record<RelatorioCategoria, string> = {
  obras: 'Indicadores físico-financeiros e consolidados por obra.',
  rh: 'Base cadastral, alocações e provisões de pessoas.',
  'horas-extras': 'Fechamentos, aprovações e impactos operacionais.',
  fopag: 'Folha prevista, rateios e visões por competência.',
  compras: 'Solicitações, cotações, pedidos e comprometido.',
  fiscal: 'Entradas, saídas, retenções e compliance documental.',
  financeiro: 'Caixa, títulos, previsto x realizado e recebíveis.',
  estoque: 'Saldos, consumo, movimentações e cobertura.',
  medicoes: 'Medições, aprovação, faturamento e recebimento.',
  documentos: 'Vencimentos, pendências, compliance e alertas.',
};

export const RELATORIO_DISPONIBILIDADE_LABELS: Record<RelatorioDisponibilidade, string> = {
  disponivel: 'Disponível',
  em_preparacao: 'Em preparação',
  planejado: 'Planejado',
};

export const RELATORIO_DISPONIBILIDADE_VARIANTS: Record<
  RelatorioDisponibilidade,
  'success' | 'warning' | 'default'
> = {
  disponivel: 'success',
  em_preparacao: 'warning',
  planejado: 'default',
};

export const RELATORIO_FORMATO_LABELS: Record<RelatorioSaida, string> = {
  pdf: 'PDF',
  xlsx: 'Excel',
  csv: 'CSV',
  dashboard: 'Dashboard',
};
