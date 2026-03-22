import type { ApiListResponse } from '@/shared/types';
import type { FuncionarioFormData } from './funcionario.schema';

/**
 * Tipos do módulo RH — gestão de funcionários do ERP JOGAB.
 *
 * Referência: docs/03-banco-de-dados.md, docs/06-arquitetura-de-telas.md
 */

/** Status do vínculo do funcionário */
export type FuncionarioStatus =
  | 'ativo'
  | 'afastado'
  | 'ferias'
  | 'desligado'
  | 'admissao_pendente';

/** Tipo de contrato */
export type TipoContrato = 'clt' | 'pj' | 'temporario' | 'estagio' | 'aprendiz';

/** Funcionário completo — usado no detalhe */
export interface Funcionario {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  status: FuncionarioStatus;
  tipoContrato: TipoContrato;
  cargo: string;
  funcao: string;
  departamento: string;
  filialId: string;
  filialNome: string;
  empresaId: string;
  obraAlocadoId: string | null;
  obraAlocadoNome: string | null;
  centroCustoId: string | null;
  centroCustoNome: string | null;
  dataAdmissao: string;         // ISO date
  dataDesligamento: string | null;
  salarioBase: number;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  gestorNome: string | null;
  gestorId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Funcionário resumido — usado na listagem */
export interface FuncionarioListItem {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  status: FuncionarioStatus;
  tipoContrato: TipoContrato;
  cargo: string;
  funcao: string;
  departamento: string;
  filialNome: string;
  obraAlocadoNome: string | null;
  dataAdmissao: string;
  salarioBase: number;
}

/** KPIs da listagem de funcionários */
export interface FuncionariosKpis {
  totalFuncionarios: number;
  ativos: number;
  afastados: number;
  ferias: number;
  desligados: number;
  custoFolhaEstimado: number;
}

/** Bloco de resumo no detalhe do funcionário */
export interface FuncionarioResumoBloco {
  titulo: string;
  itens: FuncionarioResumoItem[];
}

export interface FuncionarioResumoItem {
  label: string;
  valor: string;
  destaque?: boolean;
}

/** Contrato de resposta para listagem de funcionários. */
export type FuncionariosListResponse = ApiListResponse<FuncionarioListItem, FuncionariosKpis>;

/** Contrato de resposta para detalhe do funcionário. */
export interface FuncionarioDetailResponse {
  funcionario: Funcionario | null;
  resumoBlocos: FuncionarioResumoBloco[];
}

/** Payload esperado para criação de funcionário. */
export type FuncionarioCreatePayload = FuncionarioFormData;

/** Payload esperado para edição parcial de funcionário. */
export interface FuncionarioUpdatePayload extends Partial<FuncionarioFormData> {
  id: string;
}

/** Labels para status de funcionário */
export const FUNCIONARIO_STATUS_LABELS: Record<FuncionarioStatus, string> = {
  ativo: 'Ativo',
  afastado: 'Afastado',
  ferias: 'Em Férias',
  desligado: 'Desligado',
  admissao_pendente: 'Admissão Pendente',
};

/** Variantes visuais para status de funcionário */
export const FUNCIONARIO_STATUS_VARIANTS: Record<
  FuncionarioStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  ativo: 'success',
  afastado: 'warning',
  ferias: 'info',
  desligado: 'default',
  admissao_pendente: 'info',
};

/** Labels para tipo de contrato */
export const TIPO_CONTRATO_LABELS: Record<TipoContrato, string> = {
  clt: 'CLT',
  pj: 'PJ',
  temporario: 'Temporário',
  estagio: 'Estágio',
  aprendiz: 'Aprendiz',
};
