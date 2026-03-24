import type { HoraExtraTipo, HoraExtraStatus, HoraExtraOrigem } from './horas-extras.types';

export interface HoraExtraAprovacaoResumoCard {
  id: string;
  titulo: string;
  descricao: string;
  itens: { label: string; valor: string; destaque?: boolean }[];
}

export interface HoraExtraAprovacaoItem {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  matricula: string;
  cargo: string;
  obraId: string;
  obraNome: string;
  competencia: string;
  dataLancamento: string;
  quantidadeHoras: number;
  valorCalculado: number;
  tipo: HoraExtraTipo;
  status: HoraExtraStatus;
  origem: HoraExtraOrigem;
  prioridade: 'alta' | 'media' | 'baixa';
  gestorResponsavel: string;
  integracaoDestino: 'fopag' | 'financeiro' | 'obra';
  observacao?: string;
}

export interface HoraExtraHistoricoItem {
  id: string;
  horaExtraId: string;
  competencia: string;
  funcionarioNome: string;
  obraNome: string;
  evento: 'lancada' | 'aprovada' | 'rejeitada' | 'fechada_para_fopag' | 'enviada_para_fopag' | 'paga';
  dataEvento: string;
  responsavel: string;
  destino: 'rh' | 'obra' | 'horas_extras' | 'fopag' | 'financeiro';
  descricao: string;
}

export interface HorasExtrasAprovacaoData {
  kpis: {
    pendentes: number;
    emRisco: number;
    valorPendente: number;
    obrasImpactadas: number;
  };
  resumoCards: HoraExtraAprovacaoResumoCard[];
  aprovacoes: HoraExtraAprovacaoItem[];
  historico: HoraExtraHistoricoItem[];
}
