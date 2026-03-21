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
  return resolveFuncionarioContrato(funcId);
}

export function fetchFuncionarioAlocacoes(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioAlocacaoItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioAlocacoesWorkspace);
}

export function fetchFuncionarioProvisoes(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioProvisaoItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioProvisoesWorkspace);
}

export function fetchFuncionarioHorasExtras(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioHorasExtrasItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioHorasExtrasWorkspace);
}

export function fetchFuncionarioFopag(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioFopagItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioFopagWorkspace);
}

export function fetchFuncionarioHistoricoSalarial(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioHistoricoSalarialItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioHistoricoSalarialWorkspace);
}

export function fetchFuncionarioDocumentos(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioDocumentoItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioDocumentosWorkspace);
}

export function fetchFuncionarioFerias(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioFeriasItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioFeriasWorkspace);
}

export function fetchFuncionarioDecimoTerceiro(
  funcId: string,
): Promise<FuncionarioWorkspaceTabData<FuncionarioDecimoTerceiroItem>> {
  return resolveFuncionarioWorkspace(funcId, getFuncionarioDecimoTerceiroWorkspace);
}
