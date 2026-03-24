/**
 * Service do módulo Obras.
 *
 * Usa a camada HTTP compartilhada com fallback controlado para mocks locais.
 * Quando a API estiver estável, basta desligar o fallback por configuração.
 */
import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import type {
  Obra,
  ObraCreatePayload,
  ObraDetailResponse,
  ObraFiltersData,
  ObraMutationResponse,
  ObraResumoBloco,
  ObraUpdatePayload,
  ObraVisaoGeralKpis,
  ObrasListResponse,
} from '../types';
import {
  mockObras,
  normalizeObra,
  toObraListItem,
  calcularObrasKpis,
  calcularObraVisaoGeralKpis,
  gerarResumoBlocos,
} from '../data/obras.mock';

export const OBRAS_API_ENDPOINTS = {
  list: '/obras',
  detail: (obraId: string) => `/obras/${obraId}`,
  create: '/obras',
  update: (obraId: string) => `/obras/${obraId}`,
} as const;

export interface ObrasApiContract {
  list: {
    filters?: ObraFiltersData;
    response: ObrasListResponse;
  };
  detail: {
    obraId: string;
    response: ObraDetailResponse;
  };
  create: {
    payload: ObraCreatePayload;
    response: ObraMutationResponse;
  };
  update: {
    obraId: string;
    payload: ObraUpdatePayload;
    response: ObraMutationResponse;
  };
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildObraId() {
  return `obra-${mockObras.length + 1}`;
}

function dedupeBy<T extends string>(items: T[]) {
  return [...new Set(items.filter(Boolean))];
}

function getClienteNomeById(clienteId: string) {
  return mockObras.find((obra) => obra.clienteId === clienteId)?.clienteNome ?? `Cliente ${clienteId.toUpperCase()}`;
}

function getResponsavelNomeById(responsavelId: string) {
  return mockObras.find((obra) => obra.responsavelId === responsavelId)?.responsavelNome ?? `Responsável ${responsavelId.toUpperCase()}`;
}

function getFilialNomeById(filialId: string) {
  return mockObras.find((obra) => obra.filialId === filialId)?.filialNome ?? `Filial ${filialId.toUpperCase()}`;
}

function buildEmpresaIdByFilialId(filialId: string) {
  return mockObras.find((obra) => obra.filialId === filialId)?.empresaId ?? 'emp-1';
}

function validateObraPayload(payload: ObraCreatePayload | ObraUpdatePayload, currentId?: string) {
  const duplicateCodigo = mockObras.find(
    (obra) => obra.codigo.toLowerCase() === payload.codigo?.toLowerCase() && obra.id !== currentId,
  );

  if (duplicateCodigo) {
    throw new Error(`Já existe uma obra cadastrada com o código ${payload.codigo}.`);
  }
}

export function getObraFormReferenceData() {
  return {
    clientes: dedupeBy(mockObras.map((obra) => obra.clienteId)).map((id) => ({
      value: id,
      label: getClienteNomeById(id),
    })),
    responsaveis: dedupeBy(mockObras.map((obra) => obra.responsavelId)).map((id) => ({
      value: id,
      label: getResponsavelNomeById(id),
    })),
    filiais: dedupeBy(mockObras.map((obra) => obra.filialId)).map((id) => ({
      value: id,
      label: getFilialNomeById(id),
    })),
  };
}

async function fetchObrasMock(filters?: ObraFiltersData): Promise<ObrasListResponse> {
  await delay();

  let resultado = [...mockObras];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    resultado = resultado.filter(
      (o) =>
        o.nome.toLowerCase().includes(term) ||
        o.codigo.toLowerCase().includes(term) ||
        o.clienteNome.toLowerCase().includes(term),
    );
  }

  if (filters?.status) {
    resultado = resultado.filter((o) => o.status === filters.status);
  }

  if (filters?.tipo) {
    resultado = resultado.filter((o) => o.tipo === filters.tipo);
  }

  if (filters?.filialId) {
    resultado = resultado.filter((o) => o.filialId === filters.filialId);
  }

  if (filters?.responsavelId) {
    resultado = resultado.filter((o) => o.responsavelId === filters.responsavelId);
  }

  const kpis = calcularObrasKpis(resultado);
  const data = resultado.map(toObraListItem);

  return { data, kpis, total: data.length };
}

async function fetchObraByIdMock(obraId: string): Promise<Obra | null> {
  await delay(200);
  const obra = mockObras.find((o) => o.id === obraId);
  return obra ? normalizeObra(obra) : null;
}

async function fetchObraVisaoGeralKpisMock(obraId: string): Promise<ObraVisaoGeralKpis | null> {
  await delay(150);
  const obra = mockObras.find((o) => o.id === obraId);
  if (!obra) return null;
  return calcularObraVisaoGeralKpis(normalizeObra(obra));
}

async function fetchObraResumoBlocosMock(obraId: string): Promise<ObraResumoBloco[]> {
  await delay(200);
  const obra = mockObras.find((o) => o.id === obraId);
  if (!obra) return [];
  return gerarResumoBlocos(normalizeObra(obra));
}

async function fetchObraDetailMock(obraId: string): Promise<ObraDetailResponse> {
  const [obra, kpis, resumoBlocos] = await Promise.all([
    fetchObraByIdMock(obraId),
    fetchObraVisaoGeralKpisMock(obraId),
    fetchObraResumoBlocosMock(obraId),
  ]);

  return {
    obra,
    kpis,
    resumoBlocos,
  };
}

async function createObraMock(payload: ObraCreatePayload): Promise<ObraMutationResponse> {
  await delay(250);
  validateObraPayload(payload);

  const agora = new Date().toISOString();
  const obra: Obra = {
    id: buildObraId(),
    codigo: payload.codigo,
    nome: payload.nome,
    descricao: payload.descricao,
    status: payload.status,
    tipo: payload.tipo,
    clienteId: payload.clienteId,
    clienteNome: getClienteNomeById(payload.clienteId),
    responsavelId: payload.responsavelId,
    responsavelNome: getResponsavelNomeById(payload.responsavelId),
    filialId: payload.filialId,
    filialNome: getFilialNomeById(payload.filialId),
    empresaId: buildEmpresaIdByFilialId(payload.filialId),
    endereco: payload.endereco,
    cidade: payload.cidade,
    uf: payload.uf,
    dataInicio: payload.dataInicio,
    dataPrevisaoFim: payload.dataPrevisaoFim,
    dataFimReal: null,
    percentualConcluido: payload.status === 'concluida' ? 100 : 0,
    orcamentoPrevisto: payload.orcamentoPrevisto,
    custoRealizado: 0,
    custoComprometido: 0,
    totalFuncionarios: 0,
    totalContratos: 0,
    createdAt: agora,
    updatedAt: agora,
  };

  mockObras.unshift(obra);

  return {
    message: 'Obra criada com sucesso.',
    obra: normalizeObra(obra),
  };
}

async function updateObraMock(payload: ObraUpdatePayload): Promise<ObraMutationResponse> {
  await delay(250);
  const obra = mockObras.find((item) => item.id === payload.id);

  if (!obra) {
    throw new Error('Obra não encontrada para atualização.');
  }

  validateObraPayload(payload, payload.id);

  Object.assign(obra, {
    ...payload,
    clienteNome: payload.clienteId ? getClienteNomeById(payload.clienteId) : obra.clienteNome,
    responsavelNome: payload.responsavelId ? getResponsavelNomeById(payload.responsavelId) : obra.responsavelNome,
    filialNome: payload.filialId ? getFilialNomeById(payload.filialId) : obra.filialNome,
    empresaId: payload.filialId ? buildEmpresaIdByFilialId(payload.filialId) : obra.empresaId,
    dataFimReal: payload.status === 'concluida' ? obra.dataFimReal ?? new Date().toISOString().slice(0, 10) : null,
    updatedAt: new Date().toISOString(),
  });

  return {
    message: 'Obra atualizada com sucesso.',
    obra: normalizeObra(obra),
  };
}

export async function fetchObras(filters?: ObraFiltersData): Promise<ObrasListResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRAS_API_ENDPOINTS.list, { params: filters });
      return unwrapApiResponse<ObrasListResponse>(response.data);
    },
    () => fetchObrasMock(filters),
  );
}

export async function fetchObraById(obraId: string): Promise<Obra | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRAS_API_ENDPOINTS.detail(obraId));
      return unwrapApiResponse<Obra | null>(response.data);
    },
    () => fetchObraByIdMock(obraId),
  );
}

export async function fetchObraVisaoGeralKpis(obraId: string): Promise<ObraVisaoGeralKpis | null> {
  return withApiFallback(
    async () => {
      const response = await api.get(`${OBRAS_API_ENDPOINTS.detail(obraId)}/kpis`);
      return unwrapApiResponse<ObraVisaoGeralKpis | null>(response.data);
    },
    () => fetchObraVisaoGeralKpisMock(obraId),
  );
}

export async function fetchObraResumoBlocos(obraId: string): Promise<ObraResumoBloco[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(`${OBRAS_API_ENDPOINTS.detail(obraId)}/resumo-blocos`);
      return unwrapApiResponse<ObraResumoBloco[]>(response.data);
    },
    () => fetchObraResumoBlocosMock(obraId),
  );
}

export async function fetchObraDetail(obraId: string): Promise<ObraDetailResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(OBRAS_API_ENDPOINTS.detail(obraId));
      return unwrapApiResponse<ObraDetailResponse>(response.data);
    },
    () => fetchObraDetailMock(obraId),
  );
}

export async function createObra(payload: ObraCreatePayload): Promise<ObraMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.post(OBRAS_API_ENDPOINTS.create, payload);
      return unwrapApiResponse<ObraMutationResponse>(response.data);
    },
    () => createObraMock(payload),
  );
}

export async function updateObra(payload: ObraUpdatePayload): Promise<ObraMutationResponse> {
  return withApiFallback(
    async () => {
      const response = await api.put(OBRAS_API_ENDPOINTS.update(payload.id), payload);
      return unwrapApiResponse<ObraMutationResponse>(response.data);
    },
    () => updateObraMock(payload),
  );
}
