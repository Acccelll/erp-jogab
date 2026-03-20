import type { CompraCategoria, CompraPrioridade, CompraStatus } from './compra.schema';

export type { CompraCategoria, CompraOrigem, CompraPrioridade, CompraStatus } from './compra.schema';
export type { CompraFiltersData } from './compra-filters.schema';

export interface SolicitacaoCompra {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  solicitanteNome: string;
  obraId: string;
  obraNome: string;
  centroCustoNome: string;
  competencia: string;
  categoria: CompraCategoria;
  prioridade: CompraPrioridade;
  status: CompraStatus;
  valorEstimado: number;
  itens: number;
  createdAt: string;
  prazoNecessidade: string;
  integracaoFiscal: boolean;
  integracaoFinanceiro: boolean;
}

export interface CotacaoCompra {
  id: string;
  solicitacaoId: string;
  codigo: string;
  objeto: string;
  obraId: string;
  obraNome: string;
  competencia: string;
  categoria: CompraCategoria;
  prioridade: CompraPrioridade;
  fornecedorPrincipal: string;
  quantidadeFornecedores: number;
  valorCotado: number;
  melhorPrazoEntrega: string;
  status: CompraStatus;
  createdAt: string;
}

export interface PedidoCompra {
  id: string;
  codigo: string;
  solicitacaoId: string;
  cotacaoId: string | null;
  fornecedorId: string;
  fornecedorNome: string;
  obraId: string;
  obraNome: string;
  centroCustoNome: string;
  competencia: string;
  categoria: CompraCategoria;
  prioridade: CompraPrioridade;
  status: CompraStatus;
  valorPedido: number;
  valorComprometidoFinanceiro: number;
  previsaoEntrega: string;
  fiscalStatus: 'nao_iniciado' | 'aguardando_documentos' | 'validado';
  financeiroStatus: 'nao_programado' | 'previsto' | 'programado';
  itens: number;
  createdAt: string;
}

export interface PedidoCompraItem {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  obraAplicacao: string;
}

export interface PedidoCompraTimelineItem {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
}

export interface PedidoCompraDetalhe {
  pedido: PedidoCompra;
  solicitacao: SolicitacaoCompra | null;
  cotacao: CotacaoCompra | null;
  itens: PedidoCompraItem[];
  timeline: PedidoCompraTimelineItem[];
  observacoes: string[];
}

export interface ComprasKpis {
  totalSolicitacoes: number;
  solicitacoesPendentes: number;
  cotacoesEmAberto: number;
  pedidosEmitidos: number;
  valorComprometido: number;
  valorAguardandoFiscal: number;
}

export interface ComprasResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface ComprasStatusResumo {
  status: CompraStatus;
  label: string;
  quantidade: number;
  valor: number;
  descricao: string;
}

export interface ComprasDashboardData {
  solicitacoes: SolicitacaoCompra[];
  cotacoes: CotacaoCompra[];
  pedidos: PedidoCompra[];
  kpis: ComprasKpis;
  resumoCards: ComprasResumoCard[];
  statusResumo: ComprasStatusResumo[];
}

export const COMPRA_STATUS_LABELS: Record<CompraStatus, string> = {
  rascunho: 'Rascunho',
  pendente_aprovacao: 'Pendente de Aprovação',
  em_cotacao: 'Em Cotação',
  cotada: 'Cotada',
  pedido_emitido: 'Pedido Emitido',
  aguardando_fiscal: 'Aguardando Fiscal',
  recebimento_parcial: 'Recebimento Parcial',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export const COMPRA_STATUS_VARIANTS: Record<CompraStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  rascunho: 'default',
  pendente_aprovacao: 'warning',
  em_cotacao: 'info',
  cotada: 'info',
  pedido_emitido: 'success',
  aguardando_fiscal: 'warning',
  recebimento_parcial: 'info',
  concluida: 'success',
  cancelada: 'error',
};

export const COMPRA_CATEGORIA_LABELS: Record<CompraCategoria, string> = {
  material_obra: 'Material de Obra',
  equipamento: 'Equipamento',
  servico: 'Serviço',
  administrativo: 'Administrativo',
};

export const COMPRA_PRIORIDADE_LABELS: Record<CompraPrioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};
