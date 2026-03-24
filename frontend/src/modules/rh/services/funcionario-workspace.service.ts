import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type {
  FuncionarioAlocacaoItem,
  FuncionarioContratoData,
  FuncionarioDecimoTerceiroItem,
  FuncionarioDocumentoItem,
  FuncionarioFeriasItem,
  FuncionarioFopagItem,
  FuncionarioHistoricoSalarialItem,
  FuncionarioHorasExtrasItem,
  FuncionarioProvisaoItem,
  FuncionarioWorkspaceTabData,
} from '../types';
import {
  getFuncionarioAlocacoesWorkspace,
  getFuncionarioContratoWorkspace,
  getFuncionarioDecimoTerceiroWorkspace,
  getFuncionarioDocumentosWorkspace,
  getFuncionarioFeriasWorkspace,
  getFuncionarioFopagWorkspace,
  getFuncionarioHistoricoSalarialWorkspace,
  getFuncionarioHorasExtrasWorkspace,
  getFuncionarioProvisoesWorkspace,
} from '../data/funcionario-workspace.mock';

export const FUNCIONARIO_WORKSPACE_API_ENDPOINTS = {
  contrato: (funcId: string) => `/rh/funcionarios/${funcId}/contrato`,
  alocacoes: (funcId: string) => `/rh/funcionarios/${funcId}/alocacoes`,
  provisoes: (funcId: string) => `/rh/funcionarios/${funcId}/provisoes`,
  horasExtras: (funcId: string) => `/rh/funcionarios/${funcId}/horas-extras`,
  fopag: (funcId: string) => `/rh/funcionarios/${funcId}/fopag`,
  historicoSalarial: (funcId: string) => `/rh/funcionarios/${funcId}/historico-salarial`,
  documentos: (funcId: string) => `/rh/funcionarios/${funcId}/documentos`,
  ferias: (funcId: string) => `/rh/funcionarios/${funcId}/ferias`,
  decimoTerceiro: (funcId: string) => `/rh/funcionarios/${funcId}/decimo-terceiro`,
} as const;

const MOCK_DELAY_MS = 180;

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveFuncionarioWorkspace<T>(
  funcId: string,
  resolver: (currentFuncId: string) => FuncionarioWorkspaceTabData<T>,
): Promise<FuncionarioWorkspaceTabData<T>> {
  await delay();
  return resolver(funcId);
}

async function resolveFuncionarioContrato(
  funcId: string,
): Promise<FuncionarioContratoData | null> {
  await delay();
  return getFuncionarioContratoWorkspace(funcId);
}

export function fetchFuncionarioContrato(
  funcId: string,
): Promise<FuncionarioContratoData | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.contrato(funcId));
      return unwrapApiResponse<FuncionarioContratoData | null>(response.data);
    },
    () => resolveFuncionarioContrato(funcId),
  );
}

export function fetchFuncionarioAlocacoes(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioAlocacaoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.alocacoes(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioAlocacaoItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioAlocacoesWorkspace),
  );
}

export function fetchFuncionarioProvisoes(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioProvisaoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.provisoes(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioProvisaoItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioProvisoesWorkspace),
  );
}

export function fetchFuncionarioHorasExtras(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioHorasExtrasItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.horasExtras(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioHorasExtrasItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioHorasExtrasWorkspace),
  );
}

export function fetchFuncionarioFopag(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioFopagItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.fopag(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioFopagItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioFopagWorkspace),
  );
}

export function fetchFuncionarioHistoricoSalarial(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioHistoricoSalarialItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.historicoSalarial(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioHistoricoSalarialItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioHistoricoSalarialWorkspace),
  );
}

export function fetchFuncionarioDocumentos(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioDocumentoItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.documentos(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioDocumentoItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioDocumentosWorkspace),
  );
}

export function fetchFuncionarioFerias(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioFeriasItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.ferias(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioFeriasItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioFeriasWorkspace),
  );
}

export function fetchFuncionarioDecimoTerceiro(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioDecimoTerceiroItem>> {
  return withApiFallback(
    async () => {
      const response = await api.get(FUNCIONARIO_WORKSPACE_API_ENDPOINTS.decimoTerceiro(funcId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<FuncionarioDecimoTerceiroItem>>(response.data);
    },
    () => resolveFuncionarioWorkspace(funcId, getFuncionarioDecimoTerceiroWorkspace),
  );
}
