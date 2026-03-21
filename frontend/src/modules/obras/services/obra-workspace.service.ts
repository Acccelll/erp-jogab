import {
  getComprasWorkspace,
  getCronogramaWorkspace,
  getDocumentosWorkspace,
  getEquipeWorkspace,
  getFinanceiroWorkspace,
} from '../data/obra-workspace.mock';

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchObraCronograma(obraId: string) {
  await delay();
  return getCronogramaWorkspace(obraId);
}

export async function fetchObraEquipe(obraId: string) {
  await delay();
  return getEquipeWorkspace(obraId);
}

export async function fetchObraCompras(obraId: string) {
  await delay();
  return getComprasWorkspace(obraId);
}

export async function fetchObraFinanceiro(obraId: string) {
  await delay();
  return getFinanceiroWorkspace(obraId);
}

export async function fetchObraDocumentos(obraId: string) {
  await delay();
  return getDocumentosWorkspace(obraId);
}
