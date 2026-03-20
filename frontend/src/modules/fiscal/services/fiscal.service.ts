import type { FiscalDashboardData, FiscalDocumento, FiscalDocumentoDetalhe, FiscalFiltersData } from '../types';
import { applyFiscalFilters, buildFiscalDashboard, mockDocumentoFiscalDetalhes, mockDocumentosFiscais } from '../data/fiscal.mock';

function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFiscal(filters?: FiscalFiltersData): Promise<FiscalDashboardData> {
  await delay();
  return buildFiscalDashboard(applyFiscalFilters(mockDocumentosFiscais, filters));
}

export async function fetchDocumentosFiscaisEntrada(filters?: FiscalFiltersData): Promise<FiscalDocumento[]> {
  await delay();
  return applyFiscalFilters(mockDocumentosFiscais, { ...filters, fluxo: 'entrada' });
}

export async function fetchDocumentosFiscaisSaida(filters?: FiscalFiltersData): Promise<FiscalDocumento[]> {
  await delay();
  return applyFiscalFilters(mockDocumentosFiscais, { ...filters, fluxo: 'saida' });
}

export async function fetchDocumentoFiscalById(id: string): Promise<FiscalDocumentoDetalhe | null> {
  await delay(180);
  return mockDocumentoFiscalDetalhes[id] ?? null;
}
