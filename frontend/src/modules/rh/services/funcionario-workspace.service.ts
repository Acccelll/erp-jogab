import {
  getFuncionarioAlocacoesWorkspace,
  getFuncionarioContratoWorkspace,
  getFuncionarioFopagWorkspace,
  getFuncionarioHorasExtrasWorkspace,
  getFuncionarioProvisoesWorkspace,
} from '../data/funcionario-workspace.mock';

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFuncionarioContrato(funcId: string) {
  await delay();
  return getFuncionarioContratoWorkspace(funcId);
}

export async function fetchFuncionarioAlocacoes(funcId: string) {
  await delay();
  return getFuncionarioAlocacoesWorkspace(funcId);
}

export async function fetchFuncionarioProvisoes(funcId: string) {
  await delay();
  return getFuncionarioProvisoesWorkspace(funcId);
}

export async function fetchFuncionarioHorasExtras(funcId: string) {
  await delay();
  return getFuncionarioHorasExtrasWorkspace(funcId);
}

export async function fetchFuncionarioFopag(funcId: string) {
  await delay();
  return getFuncionarioFopagWorkspace(funcId);
}
