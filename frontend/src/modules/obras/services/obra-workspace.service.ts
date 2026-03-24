import type {
  ObraComprasItem,
  ObraCronogramaItem,
  ObraDocumentoItem,
  ObraEquipeItem,
  ObraFinanceiroItem,
  ObraWorkspaceTabData,
} from '../types';
import {
  getComprasWorkspace,
  getCronogramaWorkspace,
  getDocumentosWorkspace,
  getEquipeWorkspace,
  getFinanceiroWorkspace,
} from '../data/obra-workspace.mock';

const MOCK_DELAY_MS = 180;

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveObraWorkspace<T>(
  obraId: string,
  resolver: (currentObraId: string) => ObraWorkspaceTabData<T>,
): Promise<ObraWorkspaceTabData<T>> {
  await delay();
  return resolver(obraId);
}

export function fetchObraCronograma(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraCronogramaItem>> {
  return resolveObraWorkspace(obraId, getCronogramaWorkspace);
}

export function fetchObraEquipe(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEquipeItem>> {
  return resolveObraWorkspace(obraId, getEquipeWorkspace);
}

export function fetchObraCompras(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraComprasItem>> {
  return resolveObraWorkspace(obraId, getComprasWorkspace);
}

export function fetchObraFinanceiro(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraFinanceiroItem>> {
  return resolveObraWorkspace(obraId, getFinanceiroWorkspace);
}

export function fetchObraDocumentos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraDocumentoItem>> {
  return resolveObraWorkspace(obraId, getDocumentosWorkspace);
}
