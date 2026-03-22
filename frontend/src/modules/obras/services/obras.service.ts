/**
 * Service do módulo Obras.
 *
 * Atualmente usa dados mock. Quando a API estiver disponível,
 * basta trocar as implementações para chamadas reais via api.ts.
 */
import type {
  Obra,
  ObraCreatePayload,
  ObraDetailResponse,
  ObraFiltersData,
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

/**
 * Contratos esperados para futura API real de Obras.
 * Mantidos próximos ao service mock para facilitar a troca por integração HTTP.
 */
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
  };
  update: {
    obraId: string;
    payload: ObraUpdatePayload;
  };
}

/** Simula latência de rede */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Lista obras com filtros */
export async function fetchObras(filters?: ObraFiltersData): Promise<ObrasListResponse> {
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

/** Busca uma obra pelo ID */
export async function fetchObraById(obraId: string): Promise<Obra | null> {
  await delay(200);
  const obra = mockObras.find((o) => o.id === obraId);
  return obra ? normalizeObra(obra) : null;
}

/** KPIs da visão geral da obra */
export async function fetchObraVisaoGeralKpis(obraId: string): Promise<ObraVisaoGeralKpis | null> {
  await delay(150);
  const obra = mockObras.find((o) => o.id === obraId);
  if (!obra) return null;
  return calcularObraVisaoGeralKpis(normalizeObra(obra));
}

/** Blocos de resumo da visão geral da obra */
export async function fetchObraResumoBlocos(obraId: string): Promise<ObraResumoBloco[]> {
  await delay(200);
  const obra = mockObras.find((o) => o.id === obraId);
  if (!obra) return [];
  return gerarResumoBlocos(normalizeObra(obra));
}

/** Agregador de detalhe preparado para futura API real única do workspace da obra. */
export async function fetchObraDetail(obraId: string): Promise<ObraDetailResponse> {
  const [obra, kpis, resumoBlocos] = await Promise.all([
    fetchObraById(obraId),
    fetchObraVisaoGeralKpis(obraId),
    fetchObraResumoBlocos(obraId),
  ]);

  return {
    obra,
    kpis,
    resumoBlocos,
  };
}
