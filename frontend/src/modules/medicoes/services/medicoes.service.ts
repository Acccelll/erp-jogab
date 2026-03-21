import { medicoesFiltersSchema } from '../types';
import type { MedicoesFiltersData } from '../types';
import { getMockMedicaoById, getMockMedicoes, getMockMedicoesDashboard } from '../data/medicoes.mock';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: MedicoesFiltersData) {
  return medicoesFiltersSchema.parse(filters ?? {});
}

export async function fetchMedicoesDashboard(filters?: MedicoesFiltersData) {
  await wait();
  return getMockMedicoesDashboard(normalizeFilters(filters));
}

export async function fetchMedicoes(filters?: MedicoesFiltersData) {
  await wait();
  return getMockMedicoes(normalizeFilters(filters));
}

export async function fetchMedicaoById(medicaoId: string) {
  await wait();
  const result = getMockMedicaoById(medicaoId);

  if (!result) {
    throw new Error('Medição não encontrada.');
  }

  return result;
}
