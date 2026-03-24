import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { adminFiltersSchema } from '../types';
import type { AdminFiltersData } from '../types';
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
  perfis: '/admin/perfis',
  permissoes: '/admin/permissoes',
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
  return filterByAdmin(
    adminPerfis,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.descricao}`,
  );
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
  return filterByAdmin(
    adminIntegracoes,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.descricao}`,
  );
}

export async function fetchAdminDashboard(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.dashboard, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchAdminDashboardMock>>>(response.data);
    },
    () => fetchAdminDashboardMock(filters),
  );
}

export async function fetchUsuarios(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.usuarios, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchUsuariosMock>>>(response.data);
    },
    () => fetchUsuariosMock(filters),
  );
}

export async function fetchPerfis(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.perfis, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchPerfisMock>>>(response.data);
    },
    () => fetchPerfisMock(filters),
  );
}

export async function fetchPermissoes(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.permissoes, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchPermissoesMock>>>(response.data);
    },
    () => fetchPermissoesMock(filters),
  );
}

export async function fetchParametros(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.parametros, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchParametrosMock>>>(response.data);
    },
    () => fetchParametrosMock(filters),
  );
}

export async function fetchLogs(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.logs, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchLogsMock>>>(response.data);
    },
    () => fetchLogsMock(filters),
  );
}

export async function fetchIntegracoes(filters?: AdminFiltersData) {
  return withApiFallback(
    async () => {
      const response = await api.get(ADMIN_API_ENDPOINTS.integracoes, { params: filters });
      return unwrapApiResponse<Awaited<ReturnType<typeof fetchIntegracoesMock>>>(response.data);
    },
    () => fetchIntegracoesMock(filters),
  );
}
