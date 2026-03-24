import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
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

export const OBRA_WORKSPACE_API_ENDPOINTS = {
  cronograma: (obraId: string) => `/obras/${obraId}/cronograma`,
  equipe: (obraId: string) => `/obras/${obraId}/equipe`,
  compras: (obraId: string) => `/obras/${obraId}/compras`,
  financeiro: (obraId: string) => `/obras/${obraId}/financeiro`,
  documentos: (obraId: string) => `/obras/${obraId}/documentos`,
  contratos: (obraId: string) => `/obras/${obraId}/contratos`,
  estoque: (obraId: string) => `/obras/${obraId}/estoque`,
  medicoes: (obraId: string) => `/obras/${obraId}/medicoes`,
  rh: (obraId: string) => `/obras/${obraId}/rh`,
  riscos: (obraId: string) => `/obras/${obraId}/riscos`,
} as const;

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
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.cronograma(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraCronogramaItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getCronogramaWorkspace),
  );
}

export function fetchObraEquipe(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEquipeItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.equipe(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraEquipeItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getEquipeWorkspace),
  );
}

export function fetchObraCompras(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraComprasItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.compras(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraComprasItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getComprasWorkspace),
  );
}

export function fetchObraFinanceiro(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraFinanceiroItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.financeiro(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraFinanceiroItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getFinanceiroWorkspace),
  );
}

export function fetchObraDocumentos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraDocumentoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.documentos(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraDocumentoItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getDocumentosWorkspace),
  );
}

export function fetchObraContratos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraContratoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.contratos(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraContratoItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getContratosWorkspace),
  );
}

export function fetchObraEstoque(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEstoqueItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.estoque(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraEstoqueItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getEstoqueWorkspace),
  );
}

export function fetchObraMedicoes(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraMedicaoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.medicoes(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraMedicaoItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getMedicoesWorkspace),
  );
}

export function fetchObraRh(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraEquipeItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.rh(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraEquipeItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getRhWorkspace),
  );
}

export function fetchObraRiscos(
  obraId: string,
): Promise<ObraWorkspaceTabData<ObraRiscoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRA_WORKSPACE_API_ENDPOINTS.riscos(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<ObraRiscoItem>>(response.data);
    },
    () => resolveObraWorkspace(obraId, getRiscosWorkspace),
  );
}
