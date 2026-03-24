import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { getHorasExtrasAprovacaoData } from '../data/horas-extras-aprovacao.mock';

export const HORAS_EXTRAS_APROVACAO_API_ENDPOINTS = {
  list: '/horas-extras/aprovacao',
} as const;

function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHorasExtrasAprovacaoMock(competencia?: string) {
  await delay();
  return getHorasExtrasAprovacaoData(competencia);
}

export async function fetchHorasExtrasAprovacao(competencia?: string) {
  return withApiFallback(
    async () => {
      const response = await api.get(HORAS_EXTRAS_APROVACAO_API_ENDPOINTS.list, {
        params: competencia ? { competencia } : undefined,
      });
      return unwrapApiResponse<ReturnType<typeof getHorasExtrasAprovacaoData>>(response.data);
    },
    () => fetchHorasExtrasAprovacaoMock(competencia),
  );
}
