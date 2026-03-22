import type {
  ContextBootstrapData,
  ContextOption,
  ContextOptionsResponse,
  ContextoGlobal,
  ObraResumo,
  SelectOption,
  Usuario,
} from '@/shared/types';

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
  { id: 'obra-1', codigo: 'OBR-001', nome: 'Edifício Aurora', status: 'ativo', filialId: 'fil-1', label: 'OBR-001 — Edifício Aurora' },
  { id: 'obra-2', codigo: 'OBR-002', nome: 'Residencial Parque', status: 'ativo', filialId: 'fil-2', label: 'OBR-002 — Residencial Parque' },
  { id: 'obra-3', codigo: 'OBR-003', nome: 'Torre Empresarial', status: 'pendente', filialId: 'fil-3', label: 'OBR-003 — Torre Empresarial' },
  { id: 'obra-4', codigo: 'OBR-004', nome: 'Ponte BR-101', status: 'ativo', filialId: 'fil-2', label: 'OBR-004 — Ponte BR-101' },
];

const competencias: SelectOption[] = [
  { value: '2026-03', label: '03/2026' },
  { value: '2026-02', label: '02/2026' },
  { value: '2026-01', label: '01/2026' },
];

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CONTEXT_API_ENDPOINTS = {
  bootstrap: '/context/bootstrap',
  options: '/context/options',
} as const;

export async function fetchContextOptions(): Promise<ContextOptionsResponse> {
  await delay();
  return {
    empresas,
    filiais,
    obras: obras.map((obra) => ({
      value: obra.id,
      label: obra.label,
      empresaId: filiais.find((filial) => filial.value === obra.filialId)?.empresaId,
      filialId: obra.filialId,
    })),
    competencias,
  };
}

export async function fetchContextBootstrap(usuario: Usuario): Promise<ContextBootstrapData> {
  const options = await fetchContextOptions();
  const filialId = options.filiais.some((filial) => filial.value === usuario.filialId)
    ? usuario.filialId
    : options.filiais.find((filial) => filial.empresaId === usuario.empresaId)?.value ?? null;
  const obraId = options.obras.find((obra) => obra.filialId === filialId)?.value ?? null;

  return {
    options,
    contexto: {
      empresaId: usuario.empresaId,
      filialId,
      obraId,
      competencia: competencias[0]?.value ?? null,
      periodoInicio: null,
      periodoFim: null,
      centroCustoId: null,
    },
  };
}

export function mergeContextWithBootstrap(
  current: ContextoGlobal,
  bootstrap: ContextBootstrapData,
): ContextoGlobal {
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
