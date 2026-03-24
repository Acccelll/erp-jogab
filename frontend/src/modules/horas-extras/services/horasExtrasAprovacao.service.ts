import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { getHorasExtrasAprovacaoData } from '../data/horas-extras-aprovacao.mock';
import type { HorasExtrasAprovacaoData } from '../types';

export const HORAS_EXTRAS_APROVACAO_API_ENDPOINTS = {
  list: '/horas-extras/aprovacao',
} as const;

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Ensures the API payload always conforms to a complete HorasExtrasAprovacaoData. */
export function normalizeHorasExtrasAprovacaoData(
  payload: Partial<HorasExtrasAprovacaoData> | null | undefined,
): HorasExtrasAprovacaoData {
  return {
    kpis: {
      pendentes: payload?.kpis?.pendentes ?? 0,
      emRisco: payload?.kpis?.emRisco ?? 0,
      valorPendente: payload?.kpis?.valorPendente ?? 0,
      obrasImpactadas: payload?.kpis?.obrasImpactadas ?? 0,
    },
    resumoCards: Array.isArray(payload?.resumoCards) ? payload.resumoCards : [],
    aprovacoes: Array.isArray(payload?.aprovacoes) ? payload.aprovacoes : [],
    historico: Array.isArray(payload?.historico) ? payload.historico : [],
  };
}

async function fetchHorasExtrasAprovacaoMock(competencia?: string) {
  await delay();
  return getHorasExtrasAprovacaoData(competencia);
}

export async function fetchHorasExtrasAprovacao(competencia?: string): Promise<HorasExtrasAprovacaoData> {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_APROVACAO_API_ENDPOINTS.list, {
        params: competencia ? { competencia } : undefined,
      });
      const raw = unwrapApiResponse<HorasExtrasAprovacaoData>(response.data);
      return normalizeHorasExtrasAprovacaoData(raw);
    },
    () => fetchHorasExtrasAprovacaoMock(competencia),
  );
}
