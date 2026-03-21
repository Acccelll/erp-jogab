import type { AdminCategoria, AdminNivelPermissao, AdminStatus } from './admin.schema';

export type { AdminCategoria, AdminStatus, AdminNivelPermissao } from './admin.schema';
export type { AdminFiltersData } from './admin-filters.schema';

export interface AdminUsuario {
  id: string;
  nome: string;
  email: string;
  perfilNome: string;
  status: AdminStatus;
  obraEscopo?: string;
  ultimoAcessoEm: string;
}

export interface AdminPerfil {
  id: string;
  nome: string;
  descricao: string;
  usuarios: number;
  status: AdminStatus;
}

export interface AdminPermissao {
  id: string;
  modulo: string;
  recurso: string;
  nivel: AdminNivelPermissao;
  perfilNome: string;
  status: AdminStatus;
}

export interface AdminParametro {
  id: string;
  chave: string;
  descricao: string;
  valorAtual: string;
  escopo: string;
  status: AdminStatus;
}

export interface AdminLog {
  id: string;
  usuarioNome: string;
  acao: string;
  modulo: string;
  entidade: string;
  data: string;
  status: AdminStatus;
}

export interface AdminIntegracao {
  id: string;
  nome: string;
  descricao: string;
  status: AdminStatus;
  ultimaSincronizacaoEm?: string;
}

export interface AdminCategoriaCardData {
  categoria: AdminCategoria;
  titulo: string;
  descricao: string;
  quantidade: number;
  ativos: number;
}

export interface AdminResumoExecutivo {
  totalUsuarios: number;
  totalPerfis: number;
  totalPermissoes: number;
  parametrosAtivos: number;
  logsRecentes: number;
  integracoesAtivas: number;
}

export interface AdminDashboardData {
  resumo: AdminResumoExecutivo;
  categorias: AdminCategoriaCardData[];
  usuarios: AdminUsuario[];
  perfis: AdminPerfil[];
  permissoes: AdminPermissao[];
  parametros: AdminParametro[];
  logs: AdminLog[];
  integracoes: AdminIntegracao[];
}

export const ADMIN_CATEGORIA_LABELS: Record<AdminCategoria, string> = {
  usuarios: 'Usuários',
  perfis: 'Perfis',
  permissoes: 'Permissões',
  parametros: 'Parâmetros',
  logs: 'Logs',
  integracoes: 'Integrações',
};

export const ADMIN_CATEGORIA_DESCRICOES: Record<AdminCategoria, string> = {
  usuarios: 'Gestão de acesso, escopo e status de usuários administrativos.',
  perfis: 'Perfis funcionais com governança de acesso por responsabilidade.',
  permissoes: 'Matriz de permissões por módulo, recurso e nível.',
  parametros: 'Parâmetros globais e configuráveis do ERP.',
  logs: 'Rastreabilidade e auditoria de operações administrativas.',
  integracoes: 'Integrações sistêmicas e saúde de sincronização.',
};

export const ADMIN_STATUS_LABELS: Record<AdminStatus, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  pendente: 'Pendente',
  erro: 'Erro',
  sincronizado: 'Sincronizado',
};

export const ADMIN_STATUS_VARIANTS: Record<AdminStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  ativo: 'success',
  inativo: 'default',
  pendente: 'warning',
  erro: 'error',
  sincronizado: 'info',
};
