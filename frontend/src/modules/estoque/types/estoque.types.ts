import type {
  EstoqueMovimentacaoTipo,
  EstoqueOrigem,
  EstoqueStatus,
  EstoqueTipoItem,
} from './estoque.schema';

export type { EstoqueStatus, EstoqueTipoItem, EstoqueMovimentacaoTipo, EstoqueOrigem } from './estoque.schema';
export type { EstoqueFiltersData } from './estoque-filters.schema';

export interface EstoqueSaldo {
  quantidadeAtual: number;
  quantidadeReservada: number;
  quantidadeDisponivel: number;
  quantidadeMinima: number;
  quantidadeMaxima?: number;
  custoMedioUnitario: number;
  valorTotal: number;
  coberturaDias: number;
}

export interface EstoqueItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  tipo: EstoqueTipoItem;
  status: EstoqueStatus;
  obraId: string;
  obraNome: string;
  localId: string;
  localNome: string;
  centroCusto: string;
  competencia: string;
  fornecedorPrincipal?: string;
  documentoFiscal?: string;
  pedidoCompraCodigo?: string;
  tituloFinanceiroCodigo?: string;
  saldo: EstoqueSaldo;
  consumoMedioMensal: number;
  ultimaMovimentacaoEm: string;
}

export interface EstoqueMovimentacao {
  id: string;
  itemId: string;
  itemCodigo: string;
  itemDescricao: string;
  tipo: EstoqueMovimentacaoTipo;
  status: EstoqueStatus;
  origem: EstoqueOrigem;
  obraId: string;
  obraNome: string;
  localId: string;
  localNome: string;
  centroCusto: string;
  competencia: string;
  quantidade: number;
  unidade: string;
  valorMovimento: number;
  saldoAposMovimento: number;
  documentoReferencia?: string;
  pedidoCompraCodigo?: string;
  tituloFinanceiroCodigo?: string;
  responsavelNome: string;
  observacao: string;
  dataMovimentacao: string;
}

export interface EstoqueConsumoObra {
  obraId: string;
  obraNome: string;
  centroCusto: string;
  quantidadeConsumida: number;
  valorConsumido: number;
  ultimaLeituraEm: string;
}

export interface EstoqueResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface EstoqueKpis {
  totalItens: number;
  itensCriticos: number;
  locaisAtivos: number;
  valorEstocado: number;
  valorReservado: number;
  consumoMensal: number;
  entradasPendentes: number;
}

export interface EstoqueStatusResumo {
  status: EstoqueStatus;
  label: string;
  quantidade: number;
  valor: number;
  descricao: string;
}

export interface EstoqueLocalResumo {
  localId: string;
  localNome: string;
  quantidadeItens: number;
  valor: number;
  descricao: string;
}

export interface EstoqueTipoResumo {
  tipo: EstoqueTipoItem;
  label: string;
  quantidade: number;
  valor: number;
}

export interface EstoqueDashboardData {
  itens: EstoqueItem[];
  movimentacoes: EstoqueMovimentacao[];
  kpis: EstoqueKpis;
  resumoCards: EstoqueResumoCardData[];
  statusResumo: EstoqueStatusResumo[];
  localResumo: EstoqueLocalResumo[];
  tipoResumo: EstoqueTipoResumo[];
}

export interface EstoqueItemDetailData {
  item: EstoqueItem;
  movimentacoes: EstoqueMovimentacao[];
  consumoPorObra: EstoqueConsumoObra[];
  observacoes: string[];
}

export const ESTOQUE_STATUS_LABELS: Record<EstoqueStatus, string> = {
  disponivel: 'Disponível',
  baixo: 'Baixo',
  reservado: 'Reservado',
  aguardando_recebimento: 'Aguardando recebimento',
  em_transferencia: 'Em transferência',
  bloqueado: 'Bloqueado',
  sem_saldo: 'Sem saldo',
};

export const ESTOQUE_STATUS_VARIANTS: Record<EstoqueStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  disponivel: 'success',
  baixo: 'warning',
  reservado: 'info',
  aguardando_recebimento: 'info',
  em_transferencia: 'info',
  bloqueado: 'error',
  sem_saldo: 'error',
};

export const ESTOQUE_TIPO_LABELS: Record<EstoqueTipoItem, string> = {
  material: 'Material',
  equipamento: 'Equipamento',
  epi: 'EPI',
  ferramenta: 'Ferramenta',
  combustivel: 'Combustível',
};

export const ESTOQUE_MOVIMENTACAO_TIPO_LABELS: Record<EstoqueMovimentacaoTipo, string> = {
  entrada_compra: 'Entrada de compra',
  saida_consumo: 'Saída para consumo',
  transferencia_envio: 'Envio de transferência',
  transferencia_recebimento: 'Recebimento de transferência',
  ajuste: 'Ajuste',
  devolucao: 'Devolução',
};

export const ESTOQUE_ORIGEM_LABELS: Record<EstoqueOrigem, string> = {
  compras: 'Compras',
  fiscal: 'Fiscal',
  obra: 'Obra',
  financeiro: 'Financeiro',
  manual: 'Manual',
};
