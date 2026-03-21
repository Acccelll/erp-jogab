import { documentosFiltersSchema } from '../types';
import type { DocumentosFiltersData } from '../types';
import { getMockDocumentoById, getMockDocumentosDashboard } from '../data/documentos.mock';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: DocumentosFiltersData) {
  return documentosFiltersSchema.parse(filters ?? {});
}

export async function fetchDocumentosDashboard(filters?: DocumentosFiltersData) {
  await wait();
  return getMockDocumentosDashboard(normalizeFilters(filters));
}

export async function fetchDocumentoById(documentoId: string) {
  await wait();
  const result = getMockDocumentoById(documentoId);

  if (!result) {
    throw new Error('Documento não encontrado.');
  }

  return result;
}
