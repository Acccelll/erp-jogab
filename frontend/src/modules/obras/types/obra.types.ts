import type { ObraFormData } from './obra.schema';

/**
 * Tipos do módulo Obras — entidade central do ERP JOGAB.
 *
 * Referência: docs/03-banco-de-dados.md, docs/06-arquitetura-de-telas.md
 */

/** Status de uma obra */
export type ObraStatus =
  | 'planejamento'
  | 'em_andamento'
  | 'paralisada'
  | 'concluida'
  | 'cancelada';

/** Tipo de obra */
export type ObraTipo =
  | 'residencial'
  | 'comercial'
  | 'industrial'
  | 'infraestrutura'
  | 'reforma'
  | 'outros';

/** Obra completa — usada no workspace/detalhe */
export interface Obra {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  status: ObraStatus;
  tipo: ObraTipo;
  clienteNome: string;
  clienteId: string;
  responsavelNome: string;
  responsavelId: string;
  filialId: string;
  filialNome: string;
  empresaId: string;
  endereco: string;
  cidade: string;
  uf: string;
  dataInicio: string;       // ISO date
  dataPrevisaoFim: string;  // ISO date
  dataFimReal: string | null;
  percentualConcluido: number; // 0-100
  orcamentoPrevisto: number;
  custoRealizado: number;
  custoComprometido: number;
  totalFuncionarios: number;
  totalContratos: number;
  createdAt: string;
  updatedAt: string;
}

/** Obra resumida — usada na listagem */
export interface ObraListItem {
  id: string;
  codigo: string;
  nome: string;
  status: ObraStatus;
  tipo: ObraTipo;
  clienteNome: string;
  responsavelNome: string;
  filialNome: string;
  cidade: string;
  uf: string;
  dataInicio: string;
  dataPrevisaoFim: string;
  percentualConcluido: number;
  orcamentoPrevisto: number;
  custoRealizado: number;
  totalFuncionarios: number;
}

/** KPIs da listagem de obras */
export interface ObrasKpis {
  totalObras: number;
  obrasAtivas: number;
  obrasConcluidas: number;
  obrasParalisadas: number;
  orcamentoTotal: number;
  custoRealizadoTotal: number;
}

/** KPIs resumidos da visão geral de uma obra */
export interface ObraVisaoGeralKpis {
  orcamentoPrevisto: number;
  custoRealizado: number;
  custoComprometido: number;
  saldoDisponivel: number;
  percentualConcluido: number;
  diasRestantes: number;
  totalFuncionarios: number;
  totalContratos: number;
}

/** Bloco de resumo na visão geral da obra */
export interface ObraResumoBloco {
  titulo: string;
  itens: ObraResumoItem[];
}

export interface ObraResumoItem {
  label: string;
  valor: string;
  destaque?: boolean;
}

/** Contrato de resposta para listagem de obras. */
export interface ObrasListResponse {
  data: ObraListItem[];
  kpis: ObrasKpis;
  total: number;
}

/** Contrato de resposta para detalhe de obra/workspace. */
export interface ObraDetailResponse {
  obra: Obra | null;
  kpis: ObraVisaoGeralKpis | null;
  resumoBlocos: ObraResumoBloco[];
}

/** Payload esperado para criação de obra. */
export type ObraCreatePayload = ObraFormData;

/** Payload esperado para edição parcial de obra. */
export interface ObraUpdatePayload extends Partial<ObraFormData> {
  id: string;
}

/** Labels para status de obra */
export const OBRA_STATUS_LABELS: Record<ObraStatus, string> = {
  planejamento: 'Planejamento',
  em_andamento: 'Em Andamento',
  paralisada: 'Paralisada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

/** Variantes visuais para status de obra */
export const OBRA_STATUS_VARIANTS: Record<ObraStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  planejamento: 'info',
  em_andamento: 'success',
  paralisada: 'warning',
  concluida: 'default',
  cancelada: 'error',
};

/** Labels para tipo de obra */
export const OBRA_TIPO_LABELS: Record<ObraTipo, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  industrial: 'Industrial',
  infraestrutura: 'Infraestrutura',
  reforma: 'Reforma',
  outros: 'Outros',
};
