import type { AlocacaoResumo } from '@/shared/types';

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

export interface ObraContratoItem {
  id: string;
  codigo: string;
  objeto: string;
  contratado: string;
  status: 'vigente' | 'em_aprovacao' | 'encerrado';
  valor: number;
  vencimento?: string;
}

export interface ObraRhItem {
  id: string;
  funcionarioNome: string;
  cargo: string;
  centroCustoNome: string;
  status: 'ativo' | 'ferias' | 'afastado' | 'admissao_pendente';
  salarioBase: number;
  custoPessoalPrevisto: number;
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
  status: 'programado' | 'previsto' | 'pago' | 'recebido' | 'vencido' | 'aguardando_documentos' | 'em_aprovacao';
  competencia: string;
  valor: number;
  origem?: 'fopag' | 'horas_extras' | 'compras' | 'fiscal' | 'medicoes' | 'manual';
}

export interface ObraEstoqueItem {
  id: string;
  item: string;
  categoria: string;
  status: 'disponivel' | 'baixo' | 'critico';
  saldo: number;
  custoTotal: number;
}

export interface ObraMedicaoItem {
  id: string;
  competencia: string;
  etapa: string;
  status: 'em_preparacao' | 'em_aprovacao' | 'faturada';
  valor: number;
  percentual: number;
}

export interface ObraRiscoItem {
  id: string;
  titulo: string;
  categoria: string;
  severidade: 'baixa' | 'media' | 'alta';
  status: 'aberto' | 'monitorado' | 'mitigado';
  responsavel: string;
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
