type StatusBadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export type FinanceiroStatus =
  | 'previsto'
  | 'programado'
  | 'aguardando_documentos'
  | 'em_aprovacao'
  | 'vencido'
  | 'pago'
  | 'recebido';

export type FinanceiroTipo = 'pagar' | 'receber';
export type FinanceiroOrigem = 'fopag' | 'horas_extras' | 'compras' | 'fiscal' | 'medicoes' | 'manual';
export type FluxoCaixaStatus = 'superavit' | 'equilibrio' | 'atencao';

export interface TituloFinanceiro {
  id: string;
  codigo: string;
  tipo: FinanceiroTipo;
  status: FinanceiroStatus;
  origem: FinanceiroOrigem;
  descricao: string;
  obraId: string;
  obraNome: string;
  centroCusto: string;
  competencia: string;
  documentoNumero?: string;
  fornecedorCliente: string;
  emissao: string;
  vencimento: string;
  pagamentoRecebimentoPrevisto: string;
  valor: number;
  valorPagoRecebido: number;
  observacao?: string;
}

export interface FluxoCaixaItem {
  periodo: string;
  previstoEntrada: number;
  previstoSaida: number;
  realizadoEntrada: number;
  realizadoSaida: number;
  saldoProjetado: number;
  status: FluxoCaixaStatus;
}

export interface FinanceiroFiltersData {
  search?: string;
  status?: FinanceiroStatus;
  tipo?: FinanceiroTipo;
  origem?: FinanceiroOrigem;
  competencia?: string;
  obraId?: string;
}

export interface FinanceiroKpis {
  totalTitulos: number;
  totalPagar: number;
  totalReceber: number;
  valorPagar: number;
  valorReceber: number;
  valorVencido: number;
  saldoProjetado: number;
}


export interface FinanceiroPessoalCompetenciaResumo {
  competencia: string;
  totalFuncionarios: number;
  totalObras: number;
  totalCentrosCusto: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
  variacao: number;
  statusFechamento: 'aberta' | 'parcial' | 'fechada';
}

export interface FinanceiroPessoalObraResumo {
  obraId: string;
  obraNome: string;
  totalFuncionarios: number;
  totalCentrosCusto: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface FinanceiroPessoalCentroCustoResumo {
  centroCustoId: string;
  centroCustoNome: string;
  obraId: string;
  obraNome: string;
  totalFuncionarios: number;
  valorHorasExtrasPrevisto: number;
  valorHorasExtrasRealizado: number;
  valorFopagPrevisto: number;
  valorFopagRealizado: number;
  valorPrevisto: number;
  valorRealizado: number;
}

export interface FinanceiroPessoalPrevistoRealizadoItem {
  id: string;
  categoria: 'fopag' | 'horas_extras' | 'custo_total';
  label: string;
  valorPrevisto: number;
  valorRealizado: number;
  variacao: number;
}

export interface FinanceiroPessoalDashboardData {
  competencia: FinanceiroPessoalCompetenciaResumo;
  porObra: FinanceiroPessoalObraResumo[];
  porCentroCusto: FinanceiroPessoalCentroCustoResumo[];
  previstoRealizado: FinanceiroPessoalPrevistoRealizadoItem[];
  destaques: FinanceiroResumoCardData[];
}

export interface FinanceiroResumoCardItem {
  label: string;
  valor: string;
  destaque?: boolean;
}

export interface FinanceiroResumoCardData {
  id: string;
  titulo: string;
  descricao: string;
  itens: FinanceiroResumoCardItem[];
}

export interface FinanceiroStatusResumo {
  status: FinanceiroStatus;
  label: string;
  descricao: string;
  quantidade: number;
  valor: number;
}

export interface FinanceiroTipoResumo {
  tipo: FinanceiroTipo;
  label: string;
  descricao: string;
  quantidade: number;
  valor: number;
}

export interface FinanceiroDashboardData {
  titulos: TituloFinanceiro[];
  kpis: FinanceiroKpis;
  resumoCards: FinanceiroResumoCardData[];
  statusResumo: FinanceiroStatusResumo[];
  tipoResumo: FinanceiroTipoResumo[];
  pessoal: FinanceiroPessoalDashboardData;
}

export interface TituloFinanceiroDetalhe {
  titulo: TituloFinanceiro;
  timeline: Array<{
    id: string;
    label: string;
    descricao: string;
    data: string;
  }>;
  integracoes: Array<{
    modulo: string;
    descricao: string;
    href?: string;
  }>;
}

export const FINANCEIRO_STATUS_LABELS: Record<FinanceiroStatus, string> = {
  previsto: 'Previsto',
  programado: 'Programado',
  aguardando_documentos: 'Aguardando documentos',
  em_aprovacao: 'Em aprovação',
  vencido: 'Vencido',
  pago: 'Pago',
  recebido: 'Recebido',
};

export const FINANCEIRO_STATUS_VARIANTS: Record<FinanceiroStatus, StatusBadgeVariant> = {
  previsto: 'info',
  programado: 'warning',
  aguardando_documentos: 'warning',
  em_aprovacao: 'info',
  vencido: 'error',
  pago: 'success',
  recebido: 'success',
};

export const FINANCEIRO_TIPO_LABELS: Record<FinanceiroTipo, string> = {
  pagar: 'Contas a pagar',
  receber: 'Contas a receber',
};

export const FINANCEIRO_ORIGEM_LABELS: Record<FinanceiroOrigem, string> = {
  fopag: 'FOPAG',
  horas_extras: 'Horas Extras',
  compras: 'Compras',
  fiscal: 'Fiscal',
  medicoes: 'Medições',
  manual: 'Manual',
};

export const FLUXO_CAIXA_STATUS_LABELS: Record<FluxoCaixaStatus, string> = {
  superavit: 'Superávit',
  equilibrio: 'Equilíbrio',
  atencao: 'Atenção',
};

export const defaultFinanceiroFilters: FinanceiroFiltersData = {
  search: '',
  status: undefined,
  tipo: undefined,
  origem: undefined,
  competencia: undefined,
  obraId: undefined,
};
