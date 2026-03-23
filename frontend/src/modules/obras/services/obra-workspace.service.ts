import { fetchObraAlocacoesWorkspace } from '@/modules/rh/services/alocacoes.service';
import {
  getComprasWorkspace,
  getCronogramaWorkspace,
  getDocumentosWorkspace,
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
  return fetchObraAlocacoesWorkspace(obraId);
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
