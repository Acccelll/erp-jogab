import type {
  ObraComprasItem,
  ObraContratoItem,
  ObraCronogramaItem,
  ObraDocumentoItem,
  ObraEquipeItem,
  ObraEstoqueItem,
  ObraFinanceiroItem,
  ObraMedicaoItem,
  ObraRiscoItem,
  ObraWorkspaceTabData,
} from '../types';
import {
  getComprasWorkspace,
  getContratosWorkspace,
  getCronogramaWorkspace,
  getDocumentosWorkspace,
  getEquipeWorkspace,
  getEstoqueWorkspace,
  getFinanceiroWorkspace,
  getMedicoesWorkspace,
  getRhWorkspace,
  getRiscosWorkspace,
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

export function fetchObraContratos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraContratoItem>> {
  return resolveObraWorkspace(obraId, getContratosWorkspace);
}

export function fetchObraEstoque(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEstoqueItem>> {
  return resolveObraWorkspace(obraId, getEstoqueWorkspace);
}

export function fetchObraMedicoes(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraMedicaoItem>> {
  return resolveObraWorkspace(obraId, getMedicoesWorkspace);
}

export function fetchObraRh(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEquipeItem>> {
  return resolveObraWorkspace(obraId, getRhWorkspace);
}

export function fetchObraRiscos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraRiscoItem>> {
  return resolveObraWorkspace(obraId, getRiscosWorkspace);
}
