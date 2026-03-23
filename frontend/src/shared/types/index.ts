// Tipos globais compartilhados do ERP JOGAB

/** Status padronizados usados em telas transacionais */
export type StatusGeral =
  | 'ativo'
  | 'inativo'
  | 'pendente'
  | 'aprovado'
  | 'rejeitado'
  | 'cancelado'
  | 'fechado'
  | 'concluido';

/** Contexto global ativo do sistema */
export interface ContextoGlobal {
  empresaId: string | null;
  filialId: string | null;
  obraId: string | null;
  competencia: string | null; // formato YYYY-MM
  periodoInicio: string | null;
  periodoFim: string | null;
  centroCustoId: string | null;
}

/** Opção genérica para selects */
export interface SelectOption {
  value: string;
  label: string;
}

export interface ContextOption extends SelectOption {
  empresaId?: string;
  filialId?: string;
  obraId?: string;
}

/** Empresa */
export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
}

/** Filial */
export interface Filial {
  id: string;
  empresaId: string;
  nome: string;
  cnpj: string;
}

/** Obra resumida (para listagens e selects) */
export interface ObraResumo {
  id: string;
  codigo: string;
  nome: string;
  status: StatusGeral;
  filialId: string;
}

/** Centro de Custo */
export interface CentroCusto {
  id: string;
  codigo: string;
  descricao: string;
  obraId: string;
}

/** Resposta paginada padrão da API */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Parâmetros de paginação */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Usuário autenticado */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  permissoes: string[];
  empresaId: string;
  filialId: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  usuario: Usuario;
}

export interface ContextOptionsResponse {
  empresas: ContextOption[];
  filiais: ContextOption[];
  obras: ContextOption[];
  centrosCusto: ContextOption[];
  competencias: SelectOption[];
}

export interface ContextBootstrapData {
  options: ContextOptionsResponse;
  contexto: ContextoGlobal;
}

/** Item de navegação da sidebar */
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
  requiredPermission?: Permissao;
}

/**
 * Permissões do sistema — granulares por módulo.
 * Formato: módulo:ação (e.g. 'obras:read', 'fopag:write').
 */
export type Permissao =
  | 'dashboard:read'
  | 'obras:read'
  | 'obras:write'
  | 'rh:read'
  | 'rh:write'
  | 'horas-extras:read'
  | 'horas-extras:write'
  | 'horas-extras:approve'
  | 'fopag:read'
  | 'fopag:write'
  | 'fopag:approve'
  | 'compras:read'
  | 'compras:write'
  | 'compras:approve'
  | 'fiscal:read'
  | 'fiscal:write'
  | 'financeiro:read'
  | 'financeiro:write'
  | 'financeiro:approve'
  | 'estoque:read'
  | 'estoque:write'
  | 'medicoes:read'
  | 'medicoes:write'
  | 'medicoes:approve'
  | 'documentos:read'
  | 'documentos:write'
  | 'relatorios:read'
  | 'admin:read'
  | 'admin:write';

/** Papel do usuário no sistema */
export type PapelUsuario = 'admin' | 'gestor' | 'operador' | 'visualizador';

export * from './relationships';
