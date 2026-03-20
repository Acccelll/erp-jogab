import type { FiscalDocumentoStatus, FiscalDocumentoTipo, FiscalFluxo } from './fiscal.schema';

export type { FiscalDocumentoStatus, FiscalDocumentoTipo, FiscalFluxo } from './fiscal.schema';
export type { FiscalFiltersData } from './fiscal-filters.schema';

export interface FiscalDocumentoImpostos {
  baseCalculo: number;
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
  iss: number;
  retencoes: number;
}

export interface FiscalDocumentoItem {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  centroCustoNome: string;
}

export interface FiscalDocumento {
  id: string;
  numero: string;
  serie: string;
  chaveAcesso: string;
  fluxo: FiscalFluxo;
  tipo: FiscalDocumentoTipo;
  status: FiscalDocumentoStatus;
  emitenteNome: string;
  emitenteDocumento: string;
  destinatarioNome: string;
  destinatarioDocumento: string;
  obraId: string;
  obraNome: string;
  competencia: string;
  pedidoCompraId: string | null;
  financeiroTituloId: string | null;
  origemResumo: string;
  dataEmissao: string;
  dataLancamento: string;
  valorTotal: number;
  valorLiquido: number;
  impostos: FiscalDocumentoImpostos;
}

export interface FiscalDocumentoDetalhe {
  documento: FiscalDocumento;
  itens: FiscalDocumentoItem[];
  observacoes: string[];
  timeline: { id: string; titulo: string; descricao: string; data: string }[];
}

export interface FiscalKpis {
  totalDocumentos: number;
  entradas: number;
  saidas: number;
  aguardandoValidacao: number;
  aguardandoFinanceiro: number;
  valorTotal: number;
}

export interface FiscalResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface FiscalStatusResumo {
  status: FiscalDocumentoStatus;
  label: string;
  quantidade: number;
  valor: number;
  descricao: string;
}

export interface FiscalTipoResumo {
  tipo: FiscalDocumentoTipo;
  label: string;
  quantidade: number;
  valor: number;
}

export interface FiscalDashboardData {
  documentos: FiscalDocumento[];
  kpis: FiscalKpis;
  resumoCards: FiscalResumoCard[];
  statusResumo: FiscalStatusResumo[];
  tipoResumo: FiscalTipoResumo[];
}

export const FISCAL_STATUS_LABELS: Record<FiscalDocumentoStatus, string> = {
  pendente_escrituracao: 'Pendente de Escrituração',
  aguardando_validacao: 'Aguardando Validação',
  aguardando_financeiro: 'Aguardando Financeiro',
  escriturado: 'Escriturado',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado',
};

export const FISCAL_STATUS_VARIANTS: Record<
  FiscalDocumentoStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  pendente_escrituracao: 'default',
  aguardando_validacao: 'warning',
  aguardando_financeiro: 'info',
  escriturado: 'success',
  rejeitado: 'error',
  cancelado: 'default',
};

export const FISCAL_TIPO_LABELS: Record<FiscalDocumentoTipo, string> = {
  nfe_entrada: 'NF-e Entrada',
  nfse_entrada: 'NFS-e Entrada',
  cte_entrada: 'CT-e Entrada',
  nfe_saida: 'NF-e Saída',
  nfse_saida: 'NFS-e Saída',
};
