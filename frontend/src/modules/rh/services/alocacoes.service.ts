import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import {
  createAlocacao as createAlocacaoMockRecord,
  encerrarAlocacao as encerrarAlocacaoMockRecord,
  getAlocacaoById,
  getAlocacoesByFuncionarioId,
  getAlocacoesByObraId,
  getAlocacoesAtivasByFuncionarioId,
  getCentroCustoById,
  updateAlocacao as updateAlocacaoMockRecord,
} from '@/shared/lib/erpRelations';
import type {
  AlocacaoCreatePayload,
  AlocacaoMutationResponse,
  AlocacaoResumo,
  AlocacaoUpdatePayload,
} from '@/shared/types';
import { mockObras } from '@/modules/obras/data/obras.mock';
import { mockFuncionarios } from '../data/funcionarios.mock';
import type { FuncionarioWorkspaceResumoCard, FuncionarioWorkspaceTabData } from '../types';
import type { ObraWorkspaceResumoCard, ObraWorkspaceTabData } from '@/modules/obras/types';

export const ALOCACOES_API_ENDPOINTS = {
  byFuncionario: (funcionarioId: string) => `/rh/funcionarios/${funcionarioId}/alocacoes`,
  byObra: (obraId: string) => `/obras/${obraId}/alocacoes`,
  create: '/rh/alocacoes',
  update: (alocacaoId: string) => `/rh/alocacoes/${alocacaoId}`,
  end: (alocacaoId: string) => `/rh/alocacoes/${alocacaoId}/encerrar`,
} as const;

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFuncionarioById(funcionarioId: string) {
  return mockFuncionarios.find((funcionario) => funcionario.id === funcionarioId) ?? null;
}

function getObraById(obraId: string) {
  return mockObras.find((obra) => obra.id === obraId) ?? null;
}

function buildFuncionarioResumoCards(items: AlocacaoResumo[]): FuncionarioWorkspaceResumoCard[] {
  if (items.length === 0) {
    return [
      {
        id: 'alocacoes-resumo',
        titulo: 'Alocação por obra',
        descricao: 'Sem histórico de alocação vinculado ao funcionário.',
        itens: [{ label: 'Status', valor: 'Sem registros para este funcionário' }],
      },
    ];
  }

  return [
    {
      id: 'alocacoes-resumo',
      titulo: 'Alocação por obra',
      descricao: 'Histórico e planejamento de alocação do funcionário em obras e centros de custo.',
      itens: [
        { label: 'Ativas', valor: String(items.filter((item) => item.status === 'ativa').length), destaque: true },
        { label: 'Planejadas', valor: String(items.filter((item) => item.status === 'planejada').length) },
        { label: 'Obras distintas', valor: String(new Set(items.map((item) => item.obraId)).size) },
        { label: 'Centros de custo', valor: String(new Set(items.map((item) => item.centroCustoId)).size) },
      ],
    },
  ];
}

function buildObraResumoCards(items: AlocacaoResumo[]): ObraWorkspaceResumoCard[] {
  return [
    {
      id: 'equipe-alocacao',
      titulo: 'Alocação de equipe',
      descricao: 'Pessoas-chave, centros de custo e status atual da frente operacional da obra.',
      itens: [
        { label: 'Alocados', valor: String(items.filter((item) => item.status === 'ativa').length), destaque: true },
        { label: 'Planejados', valor: String(items.filter((item) => item.status === 'planejada').length) },
        { label: 'Centros de custo', valor: String(new Set(items.map((item) => item.centroCustoId)).size) },
      ],
    },
  ];
}

function syncFuncionarioPrimaryAllocation(funcionarioId: string) {
  const funcionario = getFuncionarioById(funcionarioId);
  if (!funcionario) return;

  const primaryActive = getAlocacoesAtivasByFuncionarioId(funcionarioId)[0] ?? null;

  if (!primaryActive) {
    funcionario.obraAlocadoId = null;
    funcionario.obraAlocadoNome = null;
    funcionario.centroCustoId = null;
    funcionario.centroCustoNome = null;
    funcionario.updatedAt = new Date().toISOString();
    return;
  }

  funcionario.obraAlocadoId = primaryActive.obraId;
  funcionario.obraAlocadoNome = primaryActive.obraNome;
  funcionario.centroCustoId = primaryActive.centroCustoId;
  funcionario.centroCustoNome = primaryActive.centroCustoNome;
  funcionario.updatedAt = new Date().toISOString();
}

function validateAlocacaoPayload(payload: AlocacaoCreatePayload | AlocacaoUpdatePayload) {
  const funcionario = getFuncionarioById(payload.funcionarioId);
  if (!funcionario) {
    throw new Error('Funcionário não encontrado para a alocação.');
  }

  const obra = getObraById(payload.obraId ?? '');
  if (!obra) {
    throw new Error('Obra não encontrada para a alocação.');
  }

  const centroCusto = getCentroCustoById(payload.centroCustoId ?? null);
  if (!centroCusto || centroCusto.obraId !== obra.id) {
    throw new Error('O centro de custo informado não pertence à obra selecionada.');
  }

  const periodoInicio = payload.periodoInicio ?? null;
  const periodoFim = payload.periodoFim ?? null;

  if (periodoInicio && periodoFim && periodoFim < periodoInicio) {
    throw new Error('A vigência final da alocação não pode ser anterior ao início.');
  }

  const status = payload.status ?? 'ativa';
  if (status === 'encerrada' && !periodoFim) {
    throw new Error('Informe a data final para encerrar a alocação.');
  }

  const percentual = payload.percentual ?? 0;
  if (percentual <= 0 || percentual > 100) {
    throw new Error('O percentual da alocação deve estar entre 1% e 100%.');
  }

  if (status === 'ativa') {
    const totalAlocado = getAlocacoesAtivasByFuncionarioId(payload.funcionarioId)
      .filter((item) => ('id' in payload ? item.id !== payload.id : true))
      .reduce((acc, item) => acc + item.percentual, 0);

    if (totalAlocado + percentual > 100) {
      throw new Error('A soma das alocações ativas do funcionário excede 100%.');
    }
  }

  return { funcionario, obra, centroCusto };
}

function normalizeAlocacaoMutationPayload(payload: AlocacaoCreatePayload | AlocacaoUpdatePayload) {
  const { funcionario, obra, centroCusto } = validateAlocacaoPayload(payload);

  return {
    funcionario,
    obra,
    centroCusto,
    payload: {
      ...payload,
      obraId: obra.id,
      centroCustoId: centroCusto.id,
      funcao: payload.funcao ?? funcionario.funcao,
      equipe: payload.equipe ?? funcionario.departamento,
      jornada: payload.jornada ?? '44h semanais',
      percentual: payload.percentual ?? 100,
      departamento: payload.departamento ?? funcionario.departamento,
      periodoInicio: payload.periodoInicio ?? new Date().toISOString().slice(0, 10),
      periodoFim: payload.periodoFim ?? null,
      status: payload.status ?? 'ativa',
    },
  };
}

async function fetchFuncionarioAlocacoesWorkspaceMock(funcionarioId: string): Promise<FuncionarioWorkspaceTabData<AlocacaoResumo>> {
  await delay();
  const items = getAlocacoesByFuncionarioId(funcionarioId);
  return { items, resumoCards: buildFuncionarioResumoCards(items) };
}

async function fetchObraAlocacoesWorkspaceMock(obraId: string): Promise<ObraWorkspaceTabData<AlocacaoResumo>> {
  await delay();
  const items = getAlocacoesByObraId(obraId);
  return { items, resumoCards: buildObraResumoCards(items) };
}

async function createAlocacaoMock(payload: AlocacaoCreatePayload): Promise<AlocacaoMutationResponse> {
  await delay();
  const { funcionario, obra, centroCusto, payload: normalizedPayload } = normalizeAlocacaoMutationPayload(payload);

  const result = createAlocacaoMockRecord({
    ...normalizedPayload,
    funcionarioNome: funcionario.nome,
    obraNome: obra.nome,
    centroCustoNome: centroCusto.nome,
  });

  syncFuncionarioPrimaryAllocation(funcionario.id);
  return result;
}

async function updateAlocacaoMock(payload: AlocacaoUpdatePayload): Promise<AlocacaoMutationResponse> {
  await delay();
  const current = getAlocacaoById(payload.id);
  if (!current) {
    throw new Error('Alocação não encontrada para atualização.');
  }

  const { funcionario, obra, centroCusto, payload: normalizedPayload } = normalizeAlocacaoMutationPayload({
    ...current,
    ...payload,
    funcionarioId: payload.funcionarioId,
  });

  const result = updateAlocacaoMockRecord({
    ...normalizedPayload,
    id: payload.id,
    funcionarioNome: funcionario.nome,
    obraNome: obra.nome,
    centroCustoNome: centroCusto.nome,
  });

  syncFuncionarioPrimaryAllocation(funcionario.id);
  return result;
}

async function encerrarAlocacaoMock(alocacaoId: string): Promise<AlocacaoMutationResponse> {
  await delay();
  const alocacao = getAlocacaoById(alocacaoId);
  if (!alocacao) {
    throw new Error('Alocação não encontrada para encerramento.');
  }

  const result = encerrarAlocacaoMockRecord(alocacaoId);
  syncFuncionarioPrimaryAllocation(alocacao.funcionarioId);
  return result;
}

export async function fetchFuncionarioAlocacoesWorkspace(funcionarioId: string): Promise<FuncionarioWorkspaceTabData<AlocacaoResumo>> {
  return withApiFallback(
    async () => {
      const response = await api.get(ALOCACOES_API_ENDPOINTS.byFuncionario(funcionarioId));
      return unwrapApiResponse<FuncionarioWorkspaceTabData<AlocacaoResumo>>(response.data);
    },
    () => fetchFuncionarioAlocacoesWorkspaceMock(funcionarioId),
  );
}

export async function fetchObraAlocacoesWorkspace(obraId: string): Promise<ObraWorkspaceTabData<AlocacaoResumo>> {
  return withApiFallback(
    async () => {
      const response = await api.get(ALOCACOES_API_ENDPOINTS.byObra(obraId));
      return unwrapApiResponse<ObraWorkspaceTabData<AlocacaoResumo>>(response.data);
    },
    () => fetchObraAlocacoesWorkspaceMock(obraId),
  );
}

export async function createAlocacao(payload: AlocacaoCreatePayload): Promise<AlocacaoMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(ALOCACOES_API_ENDPOINTS.create, payload);
      return unwrapApiResponse<AlocacaoMutationResponse>(response.data);
    },
    () => createAlocacaoMock(payload),
  );
}

export async function updateAlocacao(payload: AlocacaoUpdatePayload): Promise<AlocacaoMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.put(ALOCACOES_API_ENDPOINTS.update(payload.id), payload);
      return unwrapApiResponse<AlocacaoMutationResponse>(response.data);
    },
    () => updateAlocacaoMock(payload),
  );
}

export async function encerrarAlocacao(alocacaoId: string): Promise<AlocacaoMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.patch(ALOCACOES_API_ENDPOINTS.end(alocacaoId));
      return unwrapApiResponse<AlocacaoMutationResponse>(response.data);
    },
    () => encerrarAlocacaoMock(alocacaoId),
  );
}
