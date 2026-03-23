import type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida } from './relatorios.schema';

export type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida } from './relatorios.schema';
export type { RelatoriosFiltersData } from './relatorios-filters.schema';

export interface RelatorioOutputConfig {
  formatos: RelatorioSaida[];
  agendavel: boolean;
  permiteComparativo: boolean;
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
}

export interface RelatoriosResumoExecutivo {
  totalRelatorios: number;
  categoriasAtivas: number;
  disponiveis: number;
  planejados: number;
  exportaveis: number;
}

export interface RelatoriosDashboardData {
  itens: RelatorioItem[];
  categorias: RelatorioCategoriaResumo[];
  resumo: RelatoriosResumoExecutivo;
  destaques: RelatorioGerencialCard[];
}


export interface RelatorioGerencialCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface RelatorioGerencialLinha {
  id: string;
  label: string;
  obraNome?: string;
  centroCustoNome?: string;
  funcionarioNome?: string;
  competencia?: string;
  previsto?: number;
  realizado?: number;
  valor?: number;
  quantidade?: number;
  descricao?: string;
}

export interface RelatorioCategoriaData {
  itens: RelatorioItem[];
  resumoCards: RelatorioGerencialCard[];
  linhas: RelatorioGerencialLinha[];
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
