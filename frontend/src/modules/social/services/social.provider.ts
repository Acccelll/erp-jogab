import {
  getMockPosts,
  getMockSnapshots,
  getMockSocialDashboard,
  socialAlertasMock,
  socialContasMock,
} from '../data/social.mock';
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

export interface SocialProvider {
  listContas(): Promise<SocialConta[]>;
  createConta(payload: SocialContaPayload): Promise<SocialConta>;
  updateConta(id: string, payload: Partial<SocialContaPayload>): Promise<SocialConta>;
  deleteConta(id: string): Promise<void>;
  syncConta(id: string): Promise<{ contaId: string; sincronizadoEm: string; status: 'ok' }>;
  getDashboard(): Promise<SocialDashboardData>;
  listSnapshots(filters?: SocialSnapshotFilters): Promise<SocialMetricaSnapshot[]>;
  listPosts(filters?: SocialPostsFilters): Promise<SocialPost[]>;
  listAlertas(): Promise<SocialAlerta[]>;
  exportRelatorio(payload: SocialRelatorioExportacaoPayload): Promise<SocialRelatorioExportacaoResult>;
}

const NETWORK_DELAY_MS = 180;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
}

export class SocialMockProvider implements SocialProvider {
  async listContas() {
    await wait();
    return [...socialContasMock];
  }

  async createConta(payload: SocialContaPayload) {
    await wait();
    const conta: SocialConta = {
      id: `soc-conta-${crypto.randomUUID()}`,
      plataforma: payload.plataforma,
      nome_conta: payload.nome_conta,
      identificador_externo: payload.identificador_externo,
      url_conta: payload.url_conta,
      token_acesso: 'mock-token-criado',
      token_refresh: 'mock-refresh-criado',
      token_expira_em: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      escopos: payload.escopos,
      status_conexao: 'desconectado',
      ultima_sincronizacao: null,
      ativo: true,
      data_cadastro: new Date().toISOString(),
      usuario_criacao_id: 'usr-admin-1',
      usuario_ultima_modificacao_id: 'usr-admin-1',
    };
    socialContasMock.unshift(conta);
    return conta;
  }

  async updateConta(id: string, payload: Partial<SocialContaPayload>) {
    await wait();
    const index = socialContasMock.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Conta social não encontrada.');

    socialContasMock[index] = {
      ...socialContasMock[index],
      ...payload,
      usuario_ultima_modificacao_id: 'usr-admin-1',
    };
    return socialContasMock[index];
  }

  async deleteConta(id: string) {
    await wait();
    const index = socialContasMock.findIndex((item) => item.id === id);
    if (index >= 0) socialContasMock.splice(index, 1);
  }

  async syncConta(id: string) {
    await wait();
    const conta = socialContasMock.find((item) => item.id === id);
    if (!conta) throw new Error('Conta social não encontrada para sincronização.');

    conta.ultima_sincronizacao = new Date().toISOString();
    conta.status_conexao = 'conectado';

    return { contaId: id, sincronizadoEm: conta.ultima_sincronizacao, status: 'ok' as const };
  }

  async getDashboard() {
    await wait();
    return getMockSocialDashboard();
  }

  async listSnapshots(filters?: SocialSnapshotFilters) {
    await wait();
    return getMockSnapshots(filters);
  }

  async listPosts(filters?: SocialPostsFilters) {
    await wait();
    return getMockPosts(filters);
  }

  async listAlertas() {
    await wait();
    return [...socialAlertasMock];
  }

  async exportRelatorio(payload: SocialRelatorioExportacaoPayload) {
    await wait();
    void payload;
    return {
      id: crypto.randomUUID(),
      status: 'concluido' as const,
      url: `/social/relatorios/download/${crypto.randomUUID()}`,
    };
  }
}

export const socialProvider: SocialProvider = new SocialMockProvider();
