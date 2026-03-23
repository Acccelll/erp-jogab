export interface CentroCustoResumo {
  id: string;
  codigo: string;
  nome: string;
  obraId: string;
  obraNome: string;
  filialId: string;
}

export type AlocacaoStatus = 'ativa' | 'planejada' | 'encerrada';

export interface AlocacaoResumo {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  obraId: string;
  obraNome: string;
  centroCustoId: string;
  centroCustoNome: string;
  funcao: string;
  equipe: string;
  jornada: string;
  percentual: number;
  departamento: string;
  periodoInicio: string;
  periodoFim?: string;
  status: AlocacaoStatus;
}

export interface ApiListResponse<TData, TKpis> {
  data: TData[];
  kpis: TKpis;
  total: number;
}
