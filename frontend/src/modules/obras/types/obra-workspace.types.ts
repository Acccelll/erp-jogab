export interface ObraCronogramaItem {
  id: string;
  etapa: string;
  responsavel: string;
  inicioPrevisto: string;
  fimPrevisto: string;
  percentual: number;
  status: 'em_dia' | 'atencao' | 'atrasada' | 'concluida';
}

export interface ObraEquipeItem {
  id: string;
  nome: string;
  funcao: string;
  equipe: string;
  status: 'alocado' | 'ferias' | 'desmobilizando';
  jornada: string;
  funcionarioId: string;
  funcionarioNome: string;
  centroCustoNome: string;
  percentual: number;
}

export interface ObraComprasItem {
  id: string;
  codigo: string;
  objeto: string;
  fornecedor: string;
  status: 'em_cotacao' | 'pedido_emitido' | 'aguardando_fiscal' | 'recebimento_parcial';
  valor: number;
  previsaoEntrega: string;
}

export interface ObraFinanceiroItem {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'pagar' | 'receber';
  status: 'programado' | 'previsto' | 'pago' | 'recebido' | 'vencido';
  competencia: string;
  valor: number;
}

export interface ObraDocumentoItem {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  status: 'vigente' | 'a_vencer' | 'vencido' | 'em_analise';
  responsavel: string;
  vencimento?: string;
}

export interface ObraContratoItem {
  id: string;
  codigo: string;
  objeto: string;
  contratado: string;
  tipo: 'cliente' | 'fornecedor' | 'subcontrato';
  valorContrato: number;
  valorAditivos: number;
  dataInicio: string;
  dataFim: string;
  status: 'ativo' | 'em_negociacao' | 'suspenso' | 'encerrado';
}

export interface ObraEstoqueItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  saldoAtual: number;
  consumoMes: number;
  status: 'disponivel' | 'critico' | 'esgotado';
  almoxarife: string;
}

export interface ObraMedicaoItem {
  id: string;
  codigo: string;
  descricao: string;
  competencia: string;
  percentualMedido: number;
  valorMedido: number;
  responsavel: string;
  status: 'prevista' | 'em_apuracao' | 'aprovada' | 'faturada';
}

export interface ObraRiscoItem {
  id: string;
  codigo: string;
  titulo: string;
  categoria: string;
  probabilidade: 'baixa' | 'media' | 'alta';
  impacto: 'baixo' | 'medio' | 'alto';
  responsavel: string;
  status: 'identificado' | 'em_mitigacao' | 'mitigado' | 'materializado';
}

export interface ObraWorkspaceResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface ObraWorkspaceTabData<T> {
  items: T[];
  resumoCards: ObraWorkspaceResumoCard[];
}
