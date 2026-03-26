import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { adminFiltersSchema } from '../types';
import type {
  AdminDashboardData,
  AdminFiltersData,
  AdminIntegracao,
  AdminLog,
  AdminParametro,
  AdminPerfil,
  AdminPermissao,
  AdminResumoExecutivo,
  AdminUsuario,
} from '../types';
import {
  adminIntegracoes,
  adminLogs,
  adminParametros,
  adminPerfis,
  adminPermissoes,
  adminUsuarios,
  filterByAdmin,
  getMockAdminDashboard,
} from '../data/admin.mock';

export const ADMIN_API_ENDPOINTS = {
  dashboard: '/admin/dashboard',
  usuarios: '/admin/usuarios',
  usuarioDetail: (id: string) => `/admin/usuarios/${id}`,
  perfis: '/admin/perfis',
  perfilDetail: (id: string) => `/admin/perfis/${id}`,
  permissoes: '/admin/permissoes',
  permissaoDetail: (id: string) => `/admin/permissoes/${id}`,
  parametros: '/admin/parametros',
  logs: '/admin/logs',
  integracoes: '/admin/integracoes',
} as const;

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: AdminFiltersData) {
  return adminFiltersSchema.parse(filters ?? {});
}

const EMPTY_RESUMO: AdminResumoExecutivo = {
  totalUsuarios: 0,
  totalPerfis: 0,
  totalPermissoes: 0,
  parametrosAtivos: 0,
  logsRecentes: 0,
  integracoesAtivas: 0,
};

/** Ensures the API payload always conforms to a complete AdminDashboardData. */
export function normalizeAdminDashboardData(
  payload: Partial<AdminDashboardData> | null | undefined,
): AdminDashboardData {
  return {
    resumo: payload?.resumo ? { ...EMPTY_RESUMO, ...payload.resumo } : EMPTY_RESUMO,
    categorias: Array.isArray(payload?.categorias) ? payload.categorias : [],
    usuarios: Array.isArray(payload?.usuarios) ? payload.usuarios : [],
    perfis: Array.isArray(payload?.perfis) ? payload.perfis : [],
    permissoes: Array.isArray(payload?.permissoes) ? payload.permissoes : [],
    parametros: Array.isArray(payload?.parametros) ? payload.parametros : [],
    logs: Array.isArray(payload?.logs) ? payload.logs : [],
    integracoes: Array.isArray(payload?.integracoes) ? payload.integracoes : [],
  };
}

/** Ensures payload is always a valid AdminUsuario[]. */
export function normalizeAdminUsuarios(payload: unknown): AdminUsuario[] {
  return Array.isArray(payload) ? payload : [];
}

/** Ensures payload is always a valid AdminPerfil[]. */
export function normalizeAdminPerfis(payload: unknown): AdminPerfil[] {
  return Array.isArray(payload) ? payload : [];
}

/** Ensures payload is always a valid AdminPermissao[]. */
export function normalizeAdminPermissoes(payload: unknown): AdminPermissao[] {
  return Array.isArray(payload) ? payload : [];
}

/** Ensures payload is always a valid AdminParametro[]. */
export function normalizeAdminParametros(payload: unknown): AdminParametro[] {
  return Array.isArray(payload) ? payload : [];
}

/** Ensures payload is always a valid AdminLog[]. */
export function normalizeAdminLogs(payload: unknown): AdminLog[] {
  return Array.isArray(payload) ? payload : [];
}

/** Ensures payload is always a valid AdminIntegracao[]. */
export function normalizeAdminIntegracoes(payload: unknown): AdminIntegracao[] {
  return Array.isArray(payload) ? payload : [];
}

async function fetchAdminDashboardMock(filters?: AdminFiltersData) {
  await wait();
  return getMockAdminDashboard(normalizeFilters(filters));
}

async function fetchUsuariosMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminUsuarios,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.email} ${item.perfilNome}`,
  );
}

async function fetchPerfisMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(adminPerfis, normalizeFilters(filters), (item) => `${item.nome} ${item.descricao}`);
}

async function fetchPermissoesMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminPermissoes,
    normalizeFilters(filters),
    (item) => `${item.modulo} ${item.recurso} ${item.perfilNome}`,
  );
}

async function fetchParametrosMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminParametros,
    normalizeFilters(filters),
    (item) => `${item.chave} ${item.descricao} ${item.escopo}`,
  );
}

async function fetchLogsMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminLogs,
    normalizeFilters(filters),
    (item) => `${item.usuarioNome} ${item.acao} ${item.modulo} ${item.entidade}`,
  );
}

async function fetchIntegracoesMock(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(adminIntegracoes, normalizeFilters(filters), (item) => `${item.nome} ${item.descricao}`);
}

export async function fetchAdminDashboard(filters?: AdminFiltersData): Promise<AdminDashboardData> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.dashboard, { params: filters });
      const raw = unwrapApiResponse<AdminDashboardData>(response.data);
      return normalizeAdminDashboardData(raw);
    },
    () => fetchAdminDashboardMock(filters),
  );
}

export async function fetchUsuarios(filters?: AdminFiltersData): Promise<AdminUsuario[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.usuarios, { params: filters });
      return normalizeAdminUsuarios(unwrapApiResponse<AdminUsuario[]>(response.data));
    },
    () => fetchUsuariosMock(filters),
  );
}

export async function fetchPerfis(filters?: AdminFiltersData): Promise<AdminPerfil[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.perfis, { params: filters });
      return normalizeAdminPerfis(unwrapApiResponse<AdminPerfil[]>(response.data));
    },
    () => fetchPerfisMock(filters),
  );
}

export async function fetchPermissoes(filters?: AdminFiltersData): Promise<AdminPermissao[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.permissoes, { params: filters });
      return normalizeAdminPermissoes(unwrapApiResponse<AdminPermissao[]>(response.data));
    },
    () => fetchPermissoesMock(filters),
  );
}

export async function fetchParametros(filters?: AdminFiltersData): Promise<AdminParametro[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.parametros, { params: filters });
      return normalizeAdminParametros(unwrapApiResponse<AdminParametro[]>(response.data));
    },
    () => fetchParametrosMock(filters),
  );
}

export async function fetchLogs(filters?: AdminFiltersData): Promise<AdminLog[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.logs, { params: filters });
      return normalizeAdminLogs(unwrapApiResponse<AdminLog[]>(response.data));
    },
    () => fetchLogsMock(filters),
  );
}

export async function fetchIntegracoes(filters?: AdminFiltersData): Promise<AdminIntegracao[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.integracoes, { params: filters });
      return normalizeAdminIntegracoes(unwrapApiResponse<AdminIntegracao[]>(response.data));
    },
    () => fetchIntegracoesMock(filters),
  );
}

// ---------------------------------------------------------------------------
// Mutation payload types
// ---------------------------------------------------------------------------

export interface CreateUsuarioPayload {
  nome: string;
  email: string;
  perfilNome: string;
  obraEscopo?: string;
}

export interface UpdateUsuarioPayload {
  nome?: string;
  email?: string;
  perfilNome?: string;
  status?: AdminUsuario['status'];
  obraEscopo?: string;
}

export interface CreatePerfilPayload {
  nome: string;
  descricao: string;
}

export interface UpdatePerfilPayload {
  nome?: string;
  descricao?: string;
  status?: AdminPerfil['status'];
}

export interface UpdatePermissaoPayload {
  nivel?: AdminPermissao['nivel'];
  status?: AdminPermissao['status'];
}

// ---------------------------------------------------------------------------
// Mutation mock helpers
// ---------------------------------------------------------------------------

async function createUsuarioMock(payload: CreateUsuarioPayload): Promise<AdminUsuario> {
  await wait();
  return {
    id: `usuario-mock-${Date.now()}`,
    nome: payload.nome,
    email: payload.email,
    perfilNome: payload.perfilNome,
    status: 'ativo',
    obraEscopo: payload.obraEscopo,
    ultimoAcessoEm: new Date().toISOString(),
  };
}

async function updateUsuarioMock(id: string, payload: UpdateUsuarioPayload): Promise<AdminUsuario> {
  await wait();
  const found = adminUsuarios.find((u) => u.id === id);
  if (!found) throw new Error('Usuário não encontrado.');
  return { ...found, ...payload };
}

async function createPerfilMock(payload: CreatePerfilPayload): Promise<AdminPerfil> {
  await wait();
  return {
    id: `perfil-mock-${Date.now()}`,
    nome: payload.nome,
    descricao: payload.descricao,
    usuarios: 0,
    status: 'ativo',
  };
}

async function updatePerfilMock(id: string, payload: UpdatePerfilPayload): Promise<AdminPerfil> {
  await wait();
  const found = adminPerfis.find((p) => p.id === id);
  if (!found) throw new Error('Perfil não encontrado.');
  return { ...found, ...payload };
}

async function updatePermissaoMock(id: string, payload: UpdatePermissaoPayload): Promise<AdminPermissao> {
  await wait();
  const found = adminPermissoes.find((p) => p.id === id);
  if (!found) throw new Error('Permissão não encontrada.');
  return { ...found, ...payload };
}

// ---------------------------------------------------------------------------
// Mutations — CRUD
// ---------------------------------------------------------------------------

export async function createUsuario(payload: CreateUsuarioPayload): Promise<AdminUsuario> {
  return withApiFallback(
    async () => {
      const response = await api.post(ADMIN_API_ENDPOINTS.usuarios, payload);
      return unwrapApiResponse<AdminUsuario>(response.data);
    },
    () => createUsuarioMock(payload),
  );
}

export async function updateUsuario(id: string, payload: UpdateUsuarioPayload): Promise<AdminUsuario> {
  return withApiFallback(
    async () => {
      const response = await api.put(ADMIN_API_ENDPOINTS.usuarioDetail(id), payload);
      return unwrapApiResponse<AdminUsuario>(response.data);
    },
    () => updateUsuarioMock(id, payload),
  );
}

export async function createPerfil(payload: CreatePerfilPayload): Promise<AdminPerfil> {
  return withApiFallback(
    async () => {
      const response = await api.post(ADMIN_API_ENDPOINTS.perfis, payload);
      return unwrapApiResponse<AdminPerfil>(response.data);
    },
    () => createPerfilMock(payload),
  );
}

export async function updatePerfil(id: string, payload: UpdatePerfilPayload): Promise<AdminPerfil> {
  return withApiFallback(
    async () => {
      const response = await api.put(ADMIN_API_ENDPOINTS.perfilDetail(id), payload);
      return unwrapApiResponse<AdminPerfil>(response.data);
    },
    () => updatePerfilMock(id, payload),
  );
}

export async function updatePermissao(id: string, payload: UpdatePermissaoPayload): Promise<AdminPermissao> {
  return withApiFallback(
    async () => {
      const response = await api.put(ADMIN_API_ENDPOINTS.permissaoDetail(id), payload);
      return unwrapApiResponse<AdminPermissao>(response.data);
    },
    () => updatePermissaoMock(id, payload),
  );
}
