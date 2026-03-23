import type { AlocacaoResumo } from '@/shared/types';

export interface ObraContratoItem {
  id: string;
  codigo: string;
  objeto: string;
  contratado: string;
  tipo: 'cliente' | 'fornecedor' | 'subcontrato';
  status: 'ativo' | 'em_negociacao' | 'suspenso' | 'encerrado';
  valorContrato: number;
  valorAditivos: number;
  dataInicio: string;
  dataFim: string;
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
  status: 'prevista' | 'em_apuracao' | 'aprovada' | 'faturada';
  responsavel: string;
}

export interface ObraRiscoItem {
  id: string;
  codigo: string;
  titulo: string;
  categoria: string;
  probabilidade: 'baixa' | 'media' | 'alta';
  impacto: 'baixo' | 'medio' | 'alto';
  status: 'identificado' | 'em_mitigacao' | 'mitigado' | 'materializado';
  responsavel: string;
  prazoResposta: string;
}

export interface ObraCronogramaItem {
  id: string;
  etapa: string;
  responsavel: string;
  inicioPrevisto: string;
  fimPrevisto: string;
  percentual: number;
  status: 'em_dia' | 'atencao' | 'atrasada' | 'concluida';
}

export type ObraEquipeItem = AlocacaoResumo;

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
  status: 'programado' | 'previsto' | 'pago' | 'recebido' | 'vencido' | 'aguardando_documentos' | 'em_aprovacao';
  competencia: string;
  etapa: string;
  status: 'em_preparacao' | 'em_aprovacao' | 'faturada';
  valor: number;
  origem?: 'fopag' | 'horas_extras' | 'compras' | 'fiscal' | 'medicoes' | 'manual';
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
