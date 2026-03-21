import type {
  MedicaoAprovacaoStatus,
  MedicaoFaturamentoStatus,
  MedicaoOrigem,
  MedicaoStatus,
} from './medicoes.schema';

export type {
  MedicaoStatus,
  MedicaoOrigem,
  MedicaoFaturamentoStatus,
  MedicaoAprovacaoStatus,
} from './medicoes.schema';
export type { MedicoesFiltersData } from './medicoes-filters.schema';

export interface MedicaoResumoFinanceiro {
  valorMedido: number;
  valorRetido: number;
  valorLiberadoFaturamento: number;
  valorFaturado: number;
  valorRecebido: number;
  tituloFinanceiroCodigo?: string;
}

export interface Medicao {
  id: string;
  codigo: string;
  numeroMedicao: number;
  obraId: string;
  obraNome: string;
  contratoId: string;
  contratoCodigo: string;
  clienteNome: string;
  competencia: string;
  periodoInicio: string;
  periodoFim: string;
  status: MedicaoStatus;
  origem: MedicaoOrigem;
  aprovacaoStatus: MedicaoAprovacaoStatus;
  faturamentoStatus: MedicaoFaturamentoStatus;
  percentualAvanco: number;
  valorContrato: number;
  resumoFinanceiro: MedicaoResumoFinanceiro;
  centroCusto: string;
  responsavelNome: string;
  updatedAt: string;
}

export interface MedicaoItem {
  id: string;
  descricao: string;
  etapa: string;
  unidade: string;
  quantidadeContratada: number;
  quantidadeAnterior: number;
  quantidadePeriodo: number;
  quantidadeAcumulada: number;
  percentualExecutado: number;
  valorUnitario: number;
  valorPeriodo: number;
}

export interface MedicaoTimelineItem {
  id: string;
  label: string;
  descricao: string;
  data: string;
}

export interface MedicaoDetalheData {
  medicao: Medicao;
  itens: MedicaoItem[];
  timeline: MedicaoTimelineItem[];
  integracoes: { modulo: string; descricao: string; href?: string }[];
  observacoes: string[];
}

export interface MedicoesKpis {
  totalMedicoes: number;
  medicoesEmAprovacao: number;
  medicoesAprovadas: number;
  valorMedido: number;
  valorFaturado: number;
  valorReceber: number;
}

export interface MedicoesResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface MedicoesStatusResumo {
  status: MedicaoStatus;
  label: string;
  quantidade: number;
  valor: number;
  descricao: string;
}

export interface MedicoesCompetenciaResumo {
  competencia: string;
  quantidade: number;
  valorMedido: number;
  valorFaturado: number;
}

export interface MedicoesDashboardData {
  medicoes: Medicao[];
  kpis: MedicoesKpis;
  resumoCards: MedicoesResumoCardData[];
  statusResumo: MedicoesStatusResumo[];
  competenciaResumo: MedicoesCompetenciaResumo[];
}

export const MEDICAO_STATUS_LABELS: Record<MedicaoStatus, string> = {
  em_elaboracao: 'Em elaboração',
  em_aprovacao: 'Em aprovação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  faturada_parcial: 'Faturada parcial',
  faturada: 'Faturada',
};

export const MEDICAO_STATUS_VARIANTS: Record<MedicaoStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  em_elaboracao: 'default',
  em_aprovacao: 'warning',
  aprovada: 'success',
  rejeitada: 'error',
  faturada_parcial: 'info',
  faturada: 'success',
};

export const MEDICAO_APROVACAO_LABELS: Record<MedicaoAprovacaoStatus, string> = {
  pendente_engenharia: 'Pendente engenharia',
  pendente_cliente: 'Pendente cliente',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
};

export const MEDICAO_FATURAMENTO_LABELS: Record<MedicaoFaturamentoStatus, string> = {
  nao_iniciado: 'Não iniciado',
  preparado: 'Preparado',
  emitido: 'Emitido',
  recebido: 'Recebido',
};

export const MEDICAO_ORIGEM_LABELS: Record<MedicaoOrigem, string> = {
  obra: 'Obra',
  contrato: 'Contrato',
  aditivo: 'Aditivo',
  ajuste: 'Ajuste',
};
