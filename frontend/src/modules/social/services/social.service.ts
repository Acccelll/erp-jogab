import { api, unwrapApiResponse, withApiFallback } from '@/shared/lib/api';
import { socialProvider } from './social.provider';
import type {
  SocialAlerta,
  SocialConta,
  SocialContaPayload,
  SocialDashboardData,
  SocialMetricaSnapshot,
  SocialPost,
  SocialPostsFilters,
  SocialRelatorioExportacaoPayload,
  SocialRelatorioExportacaoResult,
  SocialSnapshotFilters,
} from '../types';

export const SOCIAL_API_ENDPOINTS = {
  contas: '/social/contas',
  contaDetail: (id: string) => `/social/contas/${id}`,
  contaSync: (id: string) => `/social/contas/${id}/sincronizar`,
  dashboard: '/social/dashboard',
  snapshots: '/social/snapshots',
  posts: '/social/posts',
  alertas: '/social/alertas',
  relatoriosExportar: '/social/relatorios/exportar',
} as const;

export async function fetchSocialContas(): Promise<SocialConta[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(SOCIAL_API_ENDPOINTS.contas);
      return unwrapApiResponse<SocialConta[]>(response.data);
    },
    () => socialProvider.listContas(),
  );
}

export async function createSocialConta(payload: SocialContaPayload): Promise<SocialConta> {
  return withApiFallback(
    async () => {
      const response = await api.post(SOCIAL_API_ENDPOINTS.contas, payload);
      return unwrapApiResponse<SocialConta>(response.data);
    },
    () => socialProvider.createConta(payload),
  );
}

export async function updateSocialConta(id: string, payload: Partial<SocialContaPayload>): Promise<SocialConta> {
  return withApiFallback(
    async () => {
      const response = await api.put(SOCIAL_API_ENDPOINTS.contaDetail(id), payload);
      return unwrapApiResponse<SocialConta>(response.data);
    },
    () => socialProvider.updateConta(id, payload),
  );
}

export async function deleteSocialConta(id: string): Promise<void> {
  return withApiFallback(
    async () => {
      await api.delete(SOCIAL_API_ENDPOINTS.contaDetail(id));
    },
    () => socialProvider.deleteConta(id),
  );
}

export async function syncSocialConta(id: string) {
  return withApiFallback(
    async () => {
      const response = await api.post(SOCIAL_API_ENDPOINTS.contaSync(id));
      return unwrapApiResponse<{ contaId: string; sincronizadoEm: string; status: 'ok' }>(response.data);
    },
    () => socialProvider.syncConta(id),
  );
}

export async function fetchSocialDashboard(): Promise<SocialDashboardData> {
  return withApiFallback(
    async () => {
      const response = await api.get(SOCIAL_API_ENDPOINTS.dashboard);
      return unwrapApiResponse<SocialDashboardData>(response.data);
    },
    () => socialProvider.getDashboard(),
  );
}

export async function fetchSocialSnapshots(filters?: SocialSnapshotFilters): Promise<SocialMetricaSnapshot[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(SOCIAL_API_ENDPOINTS.snapshots, { params: filters });
      return unwrapApiResponse<SocialMetricaSnapshot[]>(response.data);
    },
    () => socialProvider.listSnapshots(filters),
  );
}

export async function fetchSocialPosts(filters?: SocialPostsFilters): Promise<SocialPost[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(SOCIAL_API_ENDPOINTS.posts, { params: filters });
      return unwrapApiResponse<SocialPost[]>(response.data);
    },
    () => socialProvider.listPosts(filters),
  );
}

export async function fetchSocialAlertas(): Promise<SocialAlerta[]> {
  return withApiFallback(
    async () => {
      const response = await api.get(SOCIAL_API_ENDPOINTS.alertas);
      return unwrapApiResponse<SocialAlerta[]>(response.data);
    },
    () => socialProvider.listAlertas(),
  );
}

export async function exportarSocialRelatorio(
  payload: SocialRelatorioExportacaoPayload,
): Promise<SocialRelatorioExportacaoResult> {
  return withApiFallback(
    async () => {
      const response = await api.post(SOCIAL_API_ENDPOINTS.relatoriosExportar, payload);
      return unwrapApiResponse<SocialRelatorioExportacaoResult>(response.data);
    },
    () => socialProvider.exportRelatorio(payload),
  );
}
