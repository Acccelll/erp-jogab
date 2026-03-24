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

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: AdminFiltersData) {
  return adminFiltersSchema.parse(filters ?? {});
}

export async function fetchAdminDashboard(filters?: AdminFiltersData) {
  await wait();
  return getMockAdminDashboard(normalizeFilters(filters));
}

export async function fetchUsuarios(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminUsuarios,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.email} ${item.perfilNome}`,
  );
}

export async function fetchPerfis(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminPerfis,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.descricao}`,
  );
}

export async function fetchPermissoes(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminPermissoes,
    normalizeFilters(filters),
    (item) => `${item.modulo} ${item.recurso} ${item.perfilNome}`,
  );
}

export async function fetchParametros(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminParametros,
    normalizeFilters(filters),
    (item) => `${item.chave} ${item.descricao} ${item.escopo}`,
  );
}

export async function fetchLogs(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminLogs,
    normalizeFilters(filters),
    (item) => `${item.usuarioNome} ${item.acao} ${item.modulo} ${item.entidade}`,
  );
}

export async function fetchIntegracoes(filters?: AdminFiltersData) {
  await wait();
  return filterByAdmin(
    adminIntegracoes,
    normalizeFilters(filters),
    (item) => `${item.nome} ${item.descricao}`,
  );
}
