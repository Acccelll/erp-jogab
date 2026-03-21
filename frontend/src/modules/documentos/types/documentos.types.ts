import type { DocumentoAlerta, DocumentoEntidade, DocumentoStatus, DocumentoTipo } from './documentos.schema';

export type { DocumentoTipo, DocumentoEntidade, DocumentoStatus, DocumentoAlerta } from './documentos.schema';
export type { DocumentosFiltersData } from './documentos-filters.schema';

export interface DocumentoVencimento {
  dataEmissao?: string;
  dataVencimento?: string;
  diasParaVencer?: number;
  alerta: DocumentoAlerta;
}

export interface Documento {
  id: string;
  codigo: string;
  titulo: string;
  tipo: DocumentoTipo;
  entidade: DocumentoEntidade;
  status: DocumentoStatus;
  obraId?: string;
  obraNome?: string;
  entidadeId: string;
  entidadeNome: string;
  competencia?: string;
  contratoCodigo?: string;
  fornecedorNome?: string;
  responsavelNome: string;
  versao: string;
  vencimento: DocumentoVencimento;
  ultimaAtualizacaoEm: string;
}

export interface DocumentoHistoricoItem {
  id: string;
  label: string;
  descricao: string;
  data: string;
}

export interface DocumentoDetalheData {
  documento: Documento;
  integracoes: { modulo: string; descricao: string; href?: string }[];
  historico: DocumentoHistoricoItem[];
  observacoes: string[];
}

export interface DocumentosKpis {
  totalDocumentos: number;
  vigentes: number;
  aVencer: number;
  vencidos: number;
  entidadesCobertas: number;
  alertasCriticos: number;
}

export interface DocumentosResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface DocumentosStatusResumo {
  status: DocumentoStatus;
  label: string;
  quantidade: number;
  descricao: string;
}

export interface DocumentosVencimentoResumo {
  alerta: DocumentoAlerta;
  label: string;
  quantidade: number;
  descricao: string;
}

export interface DocumentosDashboardData {
  documentos: Documento[];
  kpis: DocumentosKpis;
  resumoCards: DocumentosResumoCardData[];
  statusResumo: DocumentosStatusResumo[];
  vencimentoResumo: DocumentosVencimentoResumo[];
}

export const DOCUMENTO_TIPO_LABELS: Record<DocumentoTipo, string> = {
  contrato: 'Contrato',
  certidao: 'Certidão',
  aso: 'ASO',
  fiscal: 'Fiscal',
  fornecedor: 'Fornecedor',
  seguranca: 'Segurança',
  licenca: 'Licença',
};

export const DOCUMENTO_ENTIDADE_LABELS: Record<DocumentoEntidade, string> = {
  obra: 'Obra',
  funcionario: 'Funcionário',
  fornecedor: 'Fornecedor',
  contrato: 'Contrato',
  empresa: 'Empresa',
};

export const DOCUMENTO_STATUS_LABELS: Record<DocumentoStatus, string> = {
  vigente: 'Vigente',
  a_vencer: 'A vencer',
  vencido: 'Vencido',
  pendente_envio: 'Pendente envio',
  em_analise: 'Em análise',
  arquivado: 'Arquivado',
};

export const DOCUMENTO_STATUS_VARIANTS: Record<DocumentoStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  vigente: 'success',
  a_vencer: 'warning',
  vencido: 'error',
  pendente_envio: 'default',
  em_analise: 'info',
  arquivado: 'default',
};

export const DOCUMENTO_ALERTA_LABELS: Record<DocumentoAlerta, string> = {
  sem_alerta: 'Sem alerta',
  atencao: 'Atenção',
  critico: 'Crítico',
};
