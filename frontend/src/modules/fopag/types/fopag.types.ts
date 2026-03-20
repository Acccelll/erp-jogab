export type FopagCompetenciaStatus =
  | 'aberta'
  | 'em_consolidacao'
  | 'pronta_para_rateio'
  | 'fechada_prevista'
  | 'conciliada';

export type FopagEventoOrigem = 'rh' | 'horas_extras' | 'beneficios' | 'provisoes' | 'ajuste_manual';

export interface FopagCompetenciaListItem {
  id: string;
  competencia: string;
  status: FopagCompetenciaStatus;
  totalFuncionarios: number;
  totalObras: number;
  totalEventos: number;
  valorPrevisto: number;
  valorRealizado: number;
  valorHorasExtras: number;
  updatedAt: string;
}

export interface FopagCompetenciasKpis {
  totalCompetencias: number;
  emConsolidacao: number;
  prontasParaRateio: number;
  valorPrevistoTotal: number;
  valorRealizadoTotal: number;
}

export interface FopagFuncionarioCompetencia {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  matricula: string;
  cargo: string;
  obraPrincipalId: string;
  obraPrincipalNome: string;
  salarioBase: number;
  horasExtrasValor: number;
  beneficiosValor: number;
  descontosValor: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface FopagObraCompetencia {
  id: string;
  obraId: string;
  obraNome: string;
  totalFuncionarios: number;
  valorPrevisto: number;
  valorRealizado: number;
  valorHorasExtras: number;
  percentualParticipacao: number;
}

export interface FopagEventoCompetencia {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'provento' | 'desconto' | 'encargo';
  origem: FopagEventoOrigem;
  quantidadeLancamentos: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface FopagRateioItem {
  id: string;
  centroCustoNome: string;
  obraNome: string;
  criterio: string;
  percentual: number;
  valorPrevisto: number;
}

export interface FopagFinanceiroResumo {
  valorPrevistoDesembolso: number;
  valorRealizadoDesembolso: number;
  valorEncargos: number;
  valorBeneficios: number;
  valorHorasExtrasIntegradas: number;
  principalSaida: string;
}

export interface FopagPrevistoRealizadoItem {
  id: string;
  categoria: string;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface FopagResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface FopagCompetenciaDetalhe {
  competencia: FopagCompetenciaListItem;
  resumoCards: FopagResumoCard[];
  funcionarios: FopagFuncionarioCompetencia[];
  obras: FopagObraCompetencia[];
  eventos: FopagEventoCompetencia[];
  rateios: FopagRateioItem[];
  financeiro: FopagFinanceiroResumo;
  previstoRealizado: FopagPrevistoRealizadoItem[];
}

export const FOPAG_STATUS_LABELS: Record<FopagCompetenciaStatus, string> = {
  aberta: 'Aberta',
  em_consolidacao: 'Em Consolidação',
  pronta_para_rateio: 'Pronta para Rateio',
  fechada_prevista: 'Fechada Prevista',
  conciliada: 'Conciliada',
};

export const FOPAG_STATUS_VARIANTS: Record<
  FopagCompetenciaStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  aberta: 'default',
  em_consolidacao: 'warning',
  pronta_para_rateio: 'info',
  fechada_prevista: 'success',
  conciliada: 'success',
};
