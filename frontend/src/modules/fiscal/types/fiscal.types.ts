import type {
  FiscalDocumentoTipo,
  FiscalIntegracaoStatus,
  FiscalStatus,
  FiscalTipoOperacao,
} from './fiscal.schema';

export type {
  FiscalDocumentoTipo,
  FiscalIntegracaoStatus,
  FiscalStatus,
  FiscalTipoOperacao,
} from './fiscal.schema';
export type { FiscalFiltersData } from './fiscal-filters.schema';

export interface FiscalImpostos {
  baseCalculo: number;
  valorIcms?: number;
  valorIss?: number;
  valorPis?: number;
  valorCofins?: number;
  valorRetencoes?: number;
  valorTotalImpostos: number;
}

export interface FiscalVinculos {
  compraCodigo?: string;
  pedidoCompraHref?: string;
  obraId?: string;
  obraNome?: string;
  estoqueMovimentacaoResumo?: string;
  estoqueStatus: FiscalIntegracaoStatus;
  tituloFinanceiroCodigo?: string;
  tituloFinanceiroHref?: string;
  financeiroStatus: FiscalIntegracaoStatus;
}

export interface DocumentoFiscal {
  id: string;
  codigo: string;
  numero: string;
  serie?: string;
  tipoOperacao: FiscalTipoOperacao;
  documentoTipo: FiscalDocumentoTipo;
  status: FiscalStatus;
  emitenteNome: string;
  destinatarioNome: string;
  obraId?: string;
  obraNome?: string;
  competencia: string;
  emissao: string;
  lancamento: string;
  vencimento?: string;
  valorDocumento: number;
  chaveAcesso?: string;
  resumo: string;
  impostos: FiscalImpostos;
  vinculos: FiscalVinculos;
}

export interface DocumentoFiscalTimelineItem {
  id: string;
  label: string;
  descricao: string;
  data: string;
}

export interface DocumentoFiscalDetalheData {
  documento: DocumentoFiscal;
  timeline: DocumentoFiscalTimelineItem[];
  observacoes: string[];
}

export interface FiscalKpis {
  totalDocumentos: number;
  totalEntradas: number;
  totalSaidas: number;
  valorEntradas: number;
  valorSaidas: number;
  validando: number;
  comErro: number;
}

export interface FiscalResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface FiscalStatusResumo {
  status: FiscalStatus;
  label: string;
  quantidade: number;
  descricao: string;
}

export interface FiscalDashboardData {
  documentos: DocumentoFiscal[];
  kpis: FiscalKpis;
  resumoCards: FiscalResumoCardData[];
  statusResumo: FiscalStatusResumo[];
}

export const FISCAL_TIPO_OPERACAO_LABELS: Record<FiscalTipoOperacao, string> = {
  entrada: 'Entrada',
  saida: 'Saída',
};

export const FISCAL_DOCUMENTO_TIPO_LABELS: Record<FiscalDocumentoTipo, string> = {
  nfe: 'NF-e',
  nfse: 'NFS-e',
  cte: 'CT-e',
  guia: 'Guia',
};

export const FISCAL_STATUS_LABELS: Record<FiscalStatus, string> = {
  pendente: 'Pendente',
  em_validacao: 'Em validação',
  validado: 'Validado',
  integrado_estoque: 'Integrado ao estoque',
  integrado_financeiro: 'Integrado ao financeiro',
  faturado: 'Faturado',
  erro: 'Erro',
  cancelado: 'Cancelado',
};

export const FISCAL_STATUS_VARIANTS: Record<
  FiscalStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  pendente: 'default',
  em_validacao: 'warning',
  validado: 'success',
  integrado_estoque: 'info',
  integrado_financeiro: 'info',
  faturado: 'success',
  erro: 'error',
  cancelado: 'default',
};

export const FISCAL_INTEGRACAO_STATUS_LABELS: Record<FiscalIntegracaoStatus, string> = {
  nao_aplicavel: 'Não aplicável',
  pendente: 'Pendente',
  integrado: 'Integrado',
  erro: 'Erro',
};
