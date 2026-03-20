export type HoraExtraTipo =
  | 'he_50'
  | 'he_100'
  | 'he_noturna'
  | 'adicional_noturno'
  | 'domingo'
  | 'feriado';

export type HoraExtraStatus =
  | 'digitada'
  | 'pendente_aprovacao'
  | 'aprovada'
  | 'rejeitada'
  | 'fechada_para_fopag'
  | 'enviada_para_fopag'
  | 'paga'
  | 'cancelada';

export type HoraExtraOrigem = 'obra' | 'rh' | 'integracao_ponto';

export interface HoraExtraRegra {
  id: string;
  codigo: string;
  nome: string;
  tipo: HoraExtraTipo;
  percentualAdicional: number;
  exigeAprovacao: boolean;
  integraFopag: boolean;
  integraFinanceiro: boolean;
}

export interface HoraExtraLancamento {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  matricula: string;
  cargo: string;
  obraId: string;
  obraNome: string;
  centroCustoId: string;
  centroCustoNome: string;
  filialId: string;
  filialNome: string;
  competencia: string;
  dataLancamento: string;
  quantidadeHoras: number;
  valorCalculado: number;
  tipo: HoraExtraTipo;
  status: HoraExtraStatus;
  origem: HoraExtraOrigem;
  aprovadorNome: string | null;
  regraId: string;
  observacao?: string;
}

export interface HoraExtraListItem {
  id: string;
  funcionarioNome: string;
  matricula: string;
  obraNome: string;
  competencia: string;
  dataLancamento: string;
  quantidadeHoras: number;
  valorCalculado: number;
  tipo: HoraExtraTipo;
  status: HoraExtraStatus;
  origem: HoraExtraOrigem;
}

export interface HorasExtrasKpis {
  totalLancamentos: number;
  pendentesAprovacao: number;
  aprovadas: number;
  fechadasParaFopag: number;
  horasTotais: number;
  valorTotal: number;
}

export interface FechamentoCompetencia {
  id: string;
  competencia: string;
  status: 'aberta' | 'em_apuracao' | 'pronta_para_fechamento' | 'fechada_para_fopag';
  totalLancamentos: number;
  pendentesAprovacao: number;
  horasTotais: number;
  valorTotal: number;
  obrasImpactadas: number;
  updatedAt: string;
}

export interface HoraExtraResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface HorasExtrasDashboardData {
  list: HoraExtraListItem[];
  kpis: HorasExtrasKpis;
  resumoCards: HoraExtraResumoCard[];
  fechamentoAtual: FechamentoCompetencia | null;
}

export const HORA_EXTRA_TIPO_LABELS: Record<HoraExtraTipo, string> = {
  he_50: 'HE 50%',
  he_100: 'HE 100%',
  he_noturna: 'HE Noturna',
  adicional_noturno: 'Adicional Noturno',
  domingo: 'Domingo',
  feriado: 'Feriado',
};

export const HORA_EXTRA_STATUS_LABELS: Record<HoraExtraStatus, string> = {
  digitada: 'Digitada',
  pendente_aprovacao: 'Pendente de Aprovação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  fechada_para_fopag: 'Fechada para FOPAG',
  enviada_para_fopag: 'Enviada para FOPAG',
  paga: 'Paga',
  cancelada: 'Cancelada',
};

export const HORA_EXTRA_STATUS_VARIANTS: Record<
  HoraExtraStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  digitada: 'default',
  pendente_aprovacao: 'warning',
  aprovada: 'success',
  rejeitada: 'error',
  fechada_para_fopag: 'info',
  enviada_para_fopag: 'info',
  paga: 'success',
  cancelada: 'default',
};

export const FECHAMENTO_STATUS_LABELS: Record<FechamentoCompetencia['status'], string> = {
  aberta: 'Aberta',
  em_apuracao: 'Em Apuração',
  pronta_para_fechamento: 'Pronta para Fechamento',
  fechada_para_fopag: 'Fechada para FOPAG',
};

export const FECHAMENTO_STATUS_VARIANTS: Record<
  FechamentoCompetencia['status'],
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  aberta: 'default',
  em_apuracao: 'warning',
  pronta_para_fechamento: 'info',
  fechada_para_fopag: 'success',
};
