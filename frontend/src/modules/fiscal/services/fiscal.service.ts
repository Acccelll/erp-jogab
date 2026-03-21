import { getMockDocumentoFiscalById, getMockFiscalDashboard } from '../data/fiscal.mock';
import { fiscalFiltersSchema } from '../types';
import type { FiscalFiltersData } from '../types';

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

function normalizeFilters(filters?: FiscalFiltersData) {
  return fiscalFiltersSchema.parse(filters ?? {});
}

export async function fetchFiscalDashboard(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard(normalizeFilters(filters));
}

export async function fetchFiscalEntradas(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard({ ...normalizeFilters(filters), tipoOperacao: 'entrada' });
}

export async function fetchFiscalSaidas(filters?: FiscalFiltersData) {
  await wait();
  return getMockFiscalDashboard({ ...normalizeFilters(filters), tipoOperacao: 'saida' });
}

export async function fetchDocumentoFiscalById(documentoId: string) {
  await wait();
  const result = getMockDocumentoFiscalById(documentoId);

  if (!result) {
    throw new Error('Documento fiscal não encontrado.');
  }

  return result;
}
