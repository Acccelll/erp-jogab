export interface FuncionarioContratoHistoricoItem {
  id: string;
  data: string;
  tipo: 'admissao' | 'aditivo' | 'reajuste' | 'renovacao';
  descricao: string;
  responsavel: string;
}

export interface FuncionarioContratoData {
  contratoId: string;
  tipoContrato: string;
  situacao: 'ativo' | 'em_renovacao' | 'encerrado';
  inicioVigencia: string;
  fimVigencia?: string;
  centroCusto: string;
  obraPrincipal?: { id: string; nome: string };
  gestor: string;
  resumoCards: FuncionarioWorkspaceResumoCard[];
  historico: FuncionarioContratoHistoricoItem[];
}

export interface FuncionarioAlocacaoItem {
  id: string;
  obraId: string;
  obraNome: string;
  funcao: string;
  periodoInicio: string;
  periodoFim?: string;
  percentual: number;
  centroCusto: string;
  status: 'ativa' | 'planejada' | 'encerrada';
}

export interface FuncionarioProvisaoItem {
  id: string;
  competencia: string;
  categoria: 'ferias' | 'decimo_terceiro' | 'fgts' | 'rescisao';
  status: 'prevista' | 'consolidada' | 'revertida';
  valor: number;
  observacao: string;
}

export interface FuncionarioHorasExtrasItem {
  id: string;
  competencia: string;
  obraId?: string;
  obraNome?: string;
  tipo: 'he_50' | 'he_100' | 'noturna' | 'domingo' | 'feriado';
  status: 'pendente_aprovacao' | 'aprovada' | 'fechada_para_fopag' | 'paga';
  quantidadeHoras: number;
  valorEstimado: number;
}

export interface FuncionarioFopagItem {
  id: string;
  competencia: string;
  evento: string;
  tipo: 'provento' | 'desconto' | 'base';
  origem: 'cadastro' | 'horas_extras' | 'provisao' | 'manual';
  status: 'previsto' | 'consolidado' | 'enviado_financeiro';
  valor: number;
}

export interface FuncionarioHistoricoSalarialItem {
  id: string;
  vigencia: string;
  salario: number;
  motivo: 'admissao' | 'reajuste' | 'promocao' | 'reenquadramento';
  cargo: string;
  responsavel: string;
}

export interface FuncionarioDocumentoItem {
  id: string;
  codigo: string;
  titulo: string;
  categoria: 'aso' | 'contrato' | 'certificado' | 'identificacao';
  status: 'vigente' | 'a_vencer' | 'vencido' | 'em_analise';
  responsavel: string;
  vencimento?: string;
}

export interface FuncionarioFeriasItem {
  id: string;
  periodoAquisitivo: string;
  saldoDias: number;
  inicioGozo?: string;
  fimGozo?: string;
  status: 'planejada' | 'em_gozo' | 'concluida';
  abono: boolean;
}

export interface FuncionarioDecimoTerceiroItem {
  id: string;
  competencia: string;
  etapa: 'adiantamento' | 'parcela_final' | 'encargos';
  status: 'previsto' | 'provisionado' | 'pago';
  valor: number;
  origem: 'folha' | 'provisao' | 'financeiro';
}

export interface FuncionarioWorkspaceResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface FuncionarioWorkspaceTabData<T> {
  resumoCards: FuncionarioWorkspaceResumoCard[];
  items: T[];
}
