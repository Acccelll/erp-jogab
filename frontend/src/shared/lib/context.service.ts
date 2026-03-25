import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { getCentrosCustoByObraId } from '@/shared/lib/erpRelations';
import type {
  ContextBootstrapData,
  ContextOption,
  ContextOptionsResponse,
  ContextoGlobal,
  ObraResumo,
  SelectOption,
  Usuario,
} from '@/shared/types';

// ---------------------------------------------------------------------------
// Mock data (used as fallback when API is unavailable)
// ---------------------------------------------------------------------------

const empresas: ContextOption[] = [
  { value: 'emp-1', label: 'JOGAB Engenharia Ltda' },
  { value: 'emp-2', label: 'JOGAB Construções S.A.' },
];

const filiais: ContextOption[] = [
  { value: 'fil-1', label: 'Matriz — São Paulo', empresaId: 'emp-1' },
  { value: 'fil-2', label: 'Filial — Rio de Janeiro', empresaId: 'emp-1' },
  { value: 'fil-3', label: 'Filial — Belo Horizonte', empresaId: 'emp-2' },
];

const obras: (ObraResumo & { label: string })[] = [
  {
    id: 'obra-1',
    codigo: 'OBR-001',
    nome: 'Edifício Aurora',
    status: 'ativo',
    filialId: 'fil-1',
    label: 'OBR-001 — Edifício Aurora',
  },
  {
    id: 'obra-2',
    codigo: 'OBR-002',
    nome: 'Residencial Parque',
    status: 'ativo',
    filialId: 'fil-2',
    label: 'OBR-002 — Residencial Parque',
  },
  {
    id: 'obra-3',
    codigo: 'OBR-003',
    nome: 'Torre Empresarial',
    status: 'pendente',
    filialId: 'fil-1',
    label: 'OBR-003 — Torre Empresarial',
  },
  {
    id: 'obra-4',
    codigo: 'OBR-004',
    nome: 'Ponte BR-101',
    status: 'ativo',
    filialId: 'fil-3',
    label: 'OBR-004 — Ponte BR-101',
  },
  {
    id: 'obra-5',
    codigo: 'OBR-005',
    nome: 'Reforma Sede Central',
    status: 'concluido',
    filialId: 'fil-1',
    label: 'OBR-005 — Reforma Sede Central',
  },
  {
    id: 'obra-6',
    codigo: 'OBR-006',
    nome: 'Galpão Industrial Sigma',
    status: 'pendente',
    filialId: 'fil-3',
    label: 'OBR-006 — Galpão Industrial Sigma',
  },
];

const competencias: SelectOption[] = [
  { value: '2026-03', label: '03/2026' },
  { value: '2026-02', label: '02/2026' },
  { value: '2026-01', label: '01/2026' },
];

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// API endpoints
// ---------------------------------------------------------------------------

export const CONTEXT_API_ENDPOINTS = {
  bootstrap: '/context/bootstrap',
  options: '/context/options',
} as const;

// ---------------------------------------------------------------------------
// Mock implementations (usadas como fallback)
// ---------------------------------------------------------------------------

export async function fetchContextOptionsMock(): Promise<ContextOptionsResponse> {
  await delay();
  return {
    empresas,
    filiais,
    obras: obras.map((obra) => ({
      value: obra.id,
      label: obra.label,
      empresaId: filiais.find((filial) => filial.value === obra.filialId)?.empresaId,
      filialId: obra.filialId,
      obraId: obra.id,
    })),
    centrosCusto: obras.flatMap((obra) =>
      getCentrosCustoByObraId(obra.id).map((centro) => ({
        value: centro.id,
        label: `${centro.codigo} — ${centro.nome}`,
        filialId: obra.filialId,
        obraId: obra.id,
        empresaId: filiais.find((filial) => filial.value === obra.filialId)?.empresaId,
      })),
    ),
    competencias,
  };
}

export async function fetchContextBootstrapMock(usuario: Usuario): Promise<ContextBootstrapData> {
  const options = await fetchContextOptionsMock();
  const filialId = options.filiais.some((filial) => filial.value === usuario.filialId)
    ? usuario.filialId
    : (options.filiais.find((filial) => filial.empresaId === usuario.empresaId)?.value ?? null);
  const obraId = options.obras.find((obra) => obra.filialId === filialId)?.value ?? null;
  const centroCustoId = obraId
    ? (options.centrosCusto.find((centro) => centro.obraId === obraId)?.value ?? null)
    : null;

  return {
    options,
    contexto: {
      empresaId: usuario.empresaId,
      filialId,
      obraId,
      competencia: competencias[0]?.value ?? null,
      periodoInicio: null,
      periodoFim: null,
      centroCustoId,
    },
  };
}

// ---------------------------------------------------------------------------
// Normalizers — garantem payload válido mesmo com dados parciais
// ---------------------------------------------------------------------------

export function normalizeContextOptions(
  payload: Partial<ContextOptionsResponse> | null | undefined,
): ContextOptionsResponse {
  return {
    empresas: Array.isArray(payload?.empresas) ? payload.empresas : [],
    filiais: Array.isArray(payload?.filiais) ? payload.filiais : [],
    obras: Array.isArray(payload?.obras) ? payload.obras : [],
    centrosCusto: Array.isArray(payload?.centrosCusto) ? payload.centrosCusto : [],
    competencias: Array.isArray(payload?.competencias) ? payload.competencias : [],
  };
}

export function normalizeContextBootstrap(
  payload: Partial<ContextBootstrapData> | null | undefined,
): ContextBootstrapData {
  return {
    options: normalizeContextOptions(payload?.options),
    contexto: {
      empresaId: payload?.contexto?.empresaId ?? null,
      filialId: payload?.contexto?.filialId ?? null,
      obraId: payload?.contexto?.obraId ?? null,
      competencia: payload?.contexto?.competencia ?? null,
      periodoInicio: payload?.contexto?.periodoInicio ?? null,
      periodoFim: payload?.contexto?.periodoFim ?? null,
      centroCustoId: payload?.contexto?.centroCustoId ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// Funções públicas com fallback (usadas pelo App e contextStore)
// ---------------------------------------------------------------------------

/**
 * Carrega opções de contexto via API com fallback para mock.
 */
export async function fetchContextOptions(): Promise<ContextOptionsResponse> {
  return withApiFallback(
    async () => {
      const response = await api.get(CONTEXT_API_ENDPOINTS.options);
      const raw = unwrapApiResponse<ContextOptionsResponse>(response.data);
      return normalizeContextOptions(raw);
    },
    () => fetchContextOptionsMock(),
  );
}

/**
 * Carrega bootstrap de contexto via API com fallback para mock.
 * Recebe o usuário autenticado para derivar contexto inicial.
 */
export async function fetchContextBootstrap(usuario: Usuario): Promise<ContextBootstrapData> {
  return withApiFallback(
    async () => {
      const response = await api.get(CONTEXT_API_ENDPOINTS.bootstrap);
      const raw = unwrapApiResponse<ContextBootstrapData>(response.data);
      return normalizeContextBootstrap(raw);
    },
    () => fetchContextBootstrapMock(usuario),
  );
}

// ---------------------------------------------------------------------------
// Merge helper
// ---------------------------------------------------------------------------

export function mergeContextWithBootstrap(current: ContextoGlobal, bootstrap: ContextBootstrapData): ContextoGlobal {
  return {
    empresaId: current.empresaId ?? bootstrap.contexto.empresaId,
    filialId: current.filialId ?? bootstrap.contexto.filialId,
    obraId: current.obraId ?? bootstrap.contexto.obraId,
    competencia: current.competencia ?? bootstrap.contexto.competencia,
    periodoInicio: current.periodoInicio ?? bootstrap.contexto.periodoInicio,
    periodoFim: current.periodoFim ?? bootstrap.contexto.periodoFim,
    centroCustoId: current.centroCustoId ?? bootstrap.contexto.centroCustoId,
  };
}
