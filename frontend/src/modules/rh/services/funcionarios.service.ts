/**
 * Service do módulo RH.
 *
 * Usa a camada HTTP compartilhada com fallback controlado para mocks locais.
 * Quando a API estiver estável, basta desligar o fallback por configuração.
 */
import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { getAlocacaoAtivaByFuncionarioId, getAlocacoesByFuncionarioId, getCentroCustoById, clearFuncionarioAlocacaoAtiva, upsertFuncionarioAlocacaoAtiva } from '@/shared/lib/erpRelations';
import { mockObras } from '@/modules/obras/data/obras.mock';
import type {
  Funcionario,
  FuncionarioCreatePayload,
  FuncionarioDetailResponse,
  FuncionarioFiltersData,
  FuncionarioMutationResponse,
  FuncionariosListResponse,
  FuncionarioResumoBloco,
  FuncionarioUpdatePayload,
} from '../types';
import {
  mockFuncionarios,
  toFuncionarioListItem,
  calcularFuncionariosKpis,
  gerarFuncionarioResumoBlocos,
} from '../data/funcionarios.mock';

export const RH_API_ENDPOINTS = {
  list: '/rh/funcionarios',
  detail: (funcionarioId: string) => `/rh/funcionarios/${funcionarioId}`,
  create: '/rh/funcionarios',
  update: (funcionarioId: string) => `/rh/funcionarios/${funcionarioId}`,
} as const;

export interface RhApiContract {
  list: {
    filters?: FuncionarioFiltersData;
    response: FuncionariosListResponse;
  };
  detail: {
    funcionarioId: string;
    response: FuncionarioDetailResponse;
  };
  create: {
    payload: FuncionarioCreatePayload;
    response: FuncionarioMutationResponse;
  };
  update: {
    funcionarioId: string;
    payload: FuncionarioUpdatePayload;
    response: FuncionarioMutationResponse;
  };
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFuncionarioId() {
  return `func-${mockFuncionarios.length + 1}`;
}

function dedupeBy<T extends string>(items: T[]) {
  return [...new Set(items.filter(Boolean))];
}

function getFilialNomeById(filialId: string) {
  return mockFuncionarios.find((funcionario) => funcionario.filialId === filialId)?.filialNome ?? `Filial ${filialId.toUpperCase()}`;
}

function getEmpresaIdByFilialId(filialId: string) {
  return mockFuncionarios.find((funcionario) => funcionario.filialId === filialId)?.empresaId ?? 'emp-1';
}

function getGestorNomeById(gestorId: string | null | undefined) {
  if (!gestorId) return null;
  return mockFuncionarios.find((funcionario) => funcionario.id === gestorId)?.nome ?? `Gestor ${gestorId.toUpperCase()}`;
}

function getObraById(obraId: string | null | undefined) {
  return obraId ? mockObras.find((obra) => obra.id === obraId) ?? null : null;
}

function syncFuncionarioAllocation(funcionario: Funcionario) {
  if (!funcionario.obraAlocadoId || !funcionario.centroCustoId) {
    clearFuncionarioAlocacaoAtiva(funcionario.id);
    funcionario.obraAlocadoNome = null;
    funcionario.centroCustoNome = null;
    return;
  }

  const obra = getObraById(funcionario.obraAlocadoId);
  const centro = getCentroCustoById(funcionario.centroCustoId);

  if (!obra) {
    throw new Error('A obra selecionada para o funcionário não foi encontrada.');
  }

  if (!centro || centro.obraId !== obra.id) {
    throw new Error('O centro de custo informado não pertence à obra selecionada.');
  }

  funcionario.obraAlocadoNome = obra.nome;
  funcionario.centroCustoNome = centro.nome;

  upsertFuncionarioAlocacaoAtiva({
    funcionarioId: funcionario.id,
    funcionarioNome: funcionario.nome,
    obraId: obra.id,
    obraNome: obra.nome,
    centroCustoId: centro.id,
    centroCustoNome: centro.nome,
    funcao: funcionario.funcao,
    departamento: funcionario.departamento,
  });
}

function validateFuncionarioPayload(payload: FuncionarioCreatePayload | FuncionarioUpdatePayload, currentId?: string) {
  const duplicateMatricula = mockFuncionarios.find(
    (funcionario) => funcionario.matricula.toLowerCase() === payload.matricula?.toLowerCase() && funcionario.id !== currentId,
  );

  if (duplicateMatricula) {
    throw new Error(`Já existe um funcionário cadastrado com a matrícula ${payload.matricula}.`);
  }

  const duplicateCpf = mockFuncionarios.find(
    (funcionario) => funcionario.cpf === payload.cpf && funcionario.id !== currentId,
  );

  if (duplicateCpf) {
    throw new Error('Já existe um funcionário cadastrado com este CPF.');
  }

  if (payload.centroCustoId && !payload.obraAlocadoId) {
    throw new Error('Selecione uma obra antes de informar o centro de custo.');
  }
}

export function getFuncionarioFormReferenceData() {
  return {
    filiais: dedupeBy(mockFuncionarios.map((funcionario) => funcionario.filialId)).map((id) => ({
      value: id,
      label: getFilialNomeById(id),
    })),
    obras: mockObras.map((obra) => ({ value: obra.id, label: `${obra.codigo} — ${obra.nome}` })),
    gestores: mockFuncionarios.map((funcionario) => ({ value: funcionario.id, label: funcionario.nome })),
  };
}

async function fetchFuncionariosMock(filters?: FuncionarioFiltersData): Promise<FuncionariosListResponse> {
  await delay();

  let resultado = [...mockFuncionarios];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    resultado = resultado.filter(
      (f) =>
        f.nome.toLowerCase().includes(term) ||
        f.matricula.toLowerCase().includes(term) ||
        f.cpf.includes(term) ||
        f.cargo.toLowerCase().includes(term),
    );
  }

  if (filters?.status) {
    resultado = resultado.filter((f) => f.status === filters.status);
  }

  if (filters?.tipoContrato) {
    resultado = resultado.filter((f) => f.tipoContrato === filters.tipoContrato);
  }

  if (filters?.filialId) {
    resultado = resultado.filter((f) => f.filialId === filters.filialId);
  }

  if (filters?.obraId) {
    resultado = resultado.filter((f) => getAlocacoesByFuncionarioId(f.id).some((alocacao) => alocacao.obraId === filters.obraId));
  }

  if (filters?.centroCustoId) {
    resultado = resultado.filter((f) => {
      const alocacaoAtiva = getAlocacaoAtivaByFuncionarioId(f.id);
      return (alocacaoAtiva?.centroCustoId ?? f.centroCustoId) === filters.centroCustoId;
    });
  }

  if (filters?.departamento) {
    resultado = resultado.filter((f) => f.departamento === filters.departamento);
  }

  const kpis = calcularFuncionariosKpis(resultado);
  const data = resultado.map(toFuncionarioListItem);

  return { data, kpis, total: data.length };
}

async function fetchFuncionarioByIdMock(funcId: string): Promise<Funcionario | null> {
  await delay(200);
  return mockFuncionarios.find((f) => f.id === funcId) ?? null;
}

async function fetchFuncionarioResumoBlocosMock(funcId: string): Promise<FuncionarioResumoBloco[]> {
  await delay(200);
  const func = mockFuncionarios.find((f) => f.id === funcId);
  if (!func) return [];
  return gerarFuncionarioResumoBlocos(func);
}

async function fetchFuncionarioDetailMock(funcId: string): Promise<FuncionarioDetailResponse> {
  const [funcionario, resumoBlocos] = await Promise.all([
    fetchFuncionarioByIdMock(funcId),
    fetchFuncionarioResumoBlocosMock(funcId),
  ]);

  return {
    funcionario,
    resumoBlocos,
  };
}

async function createFuncionarioMock(payload: FuncionarioCreatePayload): Promise<FuncionarioMutationResponse> {
  await delay(250);
  validateFuncionarioPayload(payload);

  const agora = new Date().toISOString();
  const funcionario: Funcionario = {
    id: buildFuncionarioId(),
    matricula: payload.matricula,
    nome: payload.nome,
    cpf: payload.cpf,
    status: payload.status,
    tipoContrato: payload.tipoContrato,
    cargo: payload.cargo,
    funcao: payload.funcao,
    departamento: payload.departamento,
    filialId: payload.filialId,
    filialNome: getFilialNomeById(payload.filialId),
    empresaId: getEmpresaIdByFilialId(payload.filialId),
    obraAlocadoId: payload.obraAlocadoId ?? null,
    obraAlocadoNome: null,
    centroCustoId: payload.centroCustoId ?? null,
    centroCustoNome: null,
    dataAdmissao: payload.dataAdmissao,
    dataDesligamento: payload.status === 'desligado' ? new Date().toISOString().slice(0, 10) : null,
    salarioBase: payload.salarioBase,
    email: payload.email,
    telefone: payload.telefone,
    cidade: payload.cidade,
    uf: payload.uf,
    gestorNome: getGestorNomeById(payload.gestorId),
    gestorId: payload.gestorId ?? null,
    createdAt: agora,
    updatedAt: agora,
  };

  syncFuncionarioAllocation(funcionario);
  mockFuncionarios.unshift(funcionario);

  return {
    message: 'Funcionário criado com sucesso.',
    funcionario,
  };
}

async function updateFuncionarioMock(payload: FuncionarioUpdatePayload): Promise<FuncionarioMutationResponse> {
  await delay(250);
  const funcionario = mockFuncionarios.find((item) => item.id === payload.id);

  if (!funcionario) {
    throw new Error('Funcionário não encontrado para atualização.');
  }

  validateFuncionarioPayload(payload, payload.id);

  Object.assign(funcionario, {
    ...payload,
    filialNome: payload.filialId ? getFilialNomeById(payload.filialId) : funcionario.filialNome,
    empresaId: payload.filialId ? getEmpresaIdByFilialId(payload.filialId) : funcionario.empresaId,
    gestorNome: payload.gestorId !== undefined ? getGestorNomeById(payload.gestorId) : funcionario.gestorNome,
    dataDesligamento:
      payload.status === 'desligado'
        ? funcionario.dataDesligamento ?? new Date().toISOString().slice(0, 10)
        : payload.status
          ? null
          : funcionario.dataDesligamento,
    updatedAt: new Date().toISOString(),
  });

  syncFuncionarioAllocation(funcionario);

  return {
    message: 'Funcionário atualizado com sucesso.',
    funcionario,
  };
}

export async function fetchFuncionarios(filters?: FuncionarioFiltersData): Promise<FuncionariosListResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(RH_API_ENDPOINTS.list, { params: filters });
      return unwrapApiResponse<FuncionariosListResponse>(response.data);
    },
    () => fetchFuncionariosMock(filters),
  );
}

export async function fetchFuncionarioById(funcId: string): Promise<Funcionario | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(RH_API_ENDPOINTS.detail(funcId));
      return unwrapApiResponse<Funcionario | null>(response.data);
    },
    () => fetchFuncionarioByIdMock(funcId),
  );
}

export async function fetchFuncionarioResumoBlocos(funcId: string): Promise<FuncionarioResumoBloco[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(`${RH_API_ENDPOINTS.detail(funcId)}/resumo-blocos`);
      return unwrapApiResponse<FuncionarioResumoBloco[]>(response.data);
    },
    () => fetchFuncionarioResumoBlocosMock(funcId),
  );
}

export async function fetchFuncionarioDetail(funcId: string): Promise<FuncionarioDetailResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(RH_API_ENDPOINTS.detail(funcId));
      return unwrapApiResponse<FuncionarioDetailResponse>(response.data);
    },
    () => fetchFuncionarioDetailMock(funcId),
  );
}

export async function createFuncionario(payload: FuncionarioCreatePayload): Promise<FuncionarioMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(RH_API_ENDPOINTS.create, payload);
      return unwrapApiResponse<FuncionarioMutationResponse>(response.data);
    },
    () => createFuncionarioMock(payload),
  );
}

export async function updateFuncionario(payload: FuncionarioUpdatePayload): Promise<FuncionarioMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.put(RH_API_ENDPOINTS.update(payload.id), payload);
      return unwrapApiResponse<FuncionarioMutationResponse>(response.data);
    },
    () => updateFuncionarioMock(payload),
  );
}
