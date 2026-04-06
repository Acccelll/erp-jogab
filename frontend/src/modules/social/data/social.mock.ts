import type {
  SocialAlerta,
  SocialCampanha,
  SocialConta,
  SocialDashboardData,
  SocialMetricaSnapshot,
  SocialPost,
  SocialPostsFilters,
  SocialSnapshotFilters,
} from '../types';

const nowIso = new Date().toISOString();

export const socialContasMock: SocialConta[] = [
  {
    id: 'soc-conta-ig-1',
    plataforma: 'instagram_business',
    nome_conta: 'AviZee Engenharia',
    identificador_externo: '178414000001',
    url_conta: 'https://instagram.com/avizee.engenharia',
    token_acesso: 'mock-token-instagram',
    token_refresh: 'mock-refresh-instagram',
    token_expira_em: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    escopos: ['instagram_basic', 'instagram_manage_insights', 'pages_show_list'],
    status_conexao: 'conectado',
    ultima_sincronizacao: nowIso,
    ativo: true,
    data_cadastro: '2026-03-01T10:00:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
    usuario_ultima_modificacao_id: 'usr-admin-1',
  },
  {
    id: 'soc-conta-li-1',
    plataforma: 'linkedin_page',
    nome_conta: 'AviZee Construção e Gestão',
    identificador_externo: 'urn:li:organization:99887766',
    url_conta: 'https://www.linkedin.com/company/avizee',
    token_acesso: 'mock-token-linkedin',
    token_refresh: 'mock-refresh-linkedin',
    token_expira_em: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    escopos: ['r_organization_social', 'rw_organization_admin', 'r_organization_admin'],
    status_conexao: 'conectado',
    ultima_sincronizacao: nowIso,
    ativo: true,
    data_cadastro: '2026-03-05T11:00:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
    usuario_ultima_modificacao_id: 'usr-gestor-1',
  },
];

export const socialMetricasSnapshotMock: SocialMetricaSnapshot[] = [
  {
    id: 'soc-snap-1',
    conta_id: 'soc-conta-ig-1',
    data_referencia: '2026-04-01',
    seguidores_total: 18240,
    seguidores_novos: 140,
    impressoes: 98400,
    alcance: 53200,
    visitas_perfil: 4430,
    cliques_link: 802,
    engajamento_total: 9722,
    taxa_engajamento: 18.27,
    quantidade_posts_periodo: 14,
    observacoes: 'Crescimento puxado por vídeos de obras em andamento.',
    data_cadastro: '2026-04-01T08:00:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
  },
  {
    id: 'soc-snap-2',
    conta_id: 'soc-conta-li-1',
    data_referencia: '2026-04-01',
    seguidores_total: 9650,
    seguidores_novos: 74,
    impressoes: 41200,
    alcance: 26800,
    visitas_perfil: 1988,
    cliques_link: 412,
    engajamento_total: 2804,
    taxa_engajamento: 10.46,
    quantidade_posts_periodo: 8,
    data_cadastro: '2026-04-01T08:01:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
  },
];

export const socialPostsMock: SocialPost[] = [
  {
    id: 'soc-post-1',
    conta_id: 'soc-conta-ig-1',
    id_externo_post: 'ig-1001',
    data_publicacao: '2026-03-30T12:00:00.000Z',
    titulo_legenda: 'Evolução da Obra Central - Etapa Estrutural',
    legenda_completa: 'Acompanhe os avanços da etapa estrutural com foco em produtividade e segurança.',
    url_post: 'https://instagram.com/p/mock1001',
    tipo_post: 'reel',
    campanha_id: 'soc-camp-1',
    impressoes: 23100,
    alcance: 14800,
    curtidas: 1880,
    comentarios: 124,
    compartilhamentos: 180,
    salvamentos: 212,
    cliques: 345,
    engajamento_total: 2741,
    taxa_engajamento: 18.52,
    destaque: true,
    data_cadastro: '2026-03-30T12:10:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
    usuario_ultima_modificacao_id: 'usr-admin-1',
  },
  {
    id: 'soc-post-2',
    conta_id: 'soc-conta-li-1',
    id_externo_post: 'li-7721',
    data_publicacao: '2026-03-28T09:30:00.000Z',
    titulo_legenda: 'Case: redução de custo em suprimentos de obra',
    legenda_completa: 'Publicação técnica sobre redução de desperdícios com integração entre compras e obra.',
    url_post: 'https://linkedin.com/feed/update/mock7721',
    tipo_post: 'artigo',
    campanha_id: 'soc-camp-2',
    impressoes: 12900,
    alcance: 8300,
    curtidas: 532,
    comentarios: 48,
    compartilhamentos: 77,
    salvamentos: 34,
    cliques: 260,
    engajamento_total: 951,
    taxa_engajamento: 11.46,
    destaque: true,
    data_cadastro: '2026-03-28T09:35:00.000Z',
    usuario_criacao_id: 'usr-gestor-1',
    usuario_ultima_modificacao_id: 'usr-gestor-1',
  },
];

export const socialAlertasMock: SocialAlerta[] = [
  {
    id: 'soc-alerta-1',
    conta_id: 'soc-conta-li-1',
    tipo_alerta: 'queda_engajamento',
    titulo: 'Engajamento abaixo da meta semanal',
    descricao: 'Taxa de engajamento da semana caiu 12% frente à média de 30 dias.',
    severidade: 'media',
    resolvido: false,
    data_referencia: '2026-04-02',
    data_cadastro: '2026-04-02T09:00:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
  },
  {
    id: 'soc-alerta-2',
    conta_id: 'soc-conta-ig-1',
    tipo_alerta: 'operacional',
    titulo: 'Sincronização manual pendente há mais de 24h',
    descricao: 'Última sincronização executada sem snapshots do período atual.',
    severidade: 'alta',
    resolvido: false,
    data_referencia: '2026-04-03',
    data_cadastro: '2026-04-03T07:20:00.000Z',
    usuario_criacao_id: 'usr-admin-1',
  },
];

export const socialCampanhasMock: SocialCampanha[] = [
  {
    id: 'soc-camp-1',
    nome: 'Obras em Andamento Q2',
    objetivo: 'Fortalecer percepção de execução e transparência técnica.',
    data_inicio: '2026-03-15',
    ativo: true,
  },
  {
    id: 'soc-camp-2',
    nome: 'Conteúdo Técnico LinkedIn',
    objetivo: 'Gerar autoridade e leads B2B para contratos corporativos.',
    data_inicio: '2026-03-01',
    ativo: true,
  },
];

export function getMockSocialDashboard(): SocialDashboardData {
  const melhoresPosts = [...socialPostsMock].sort((a, b) => b.engajamento_total - a.engajamento_total).slice(0, 5);

  return {
    resumo: {
      totalSeguidoresInstagram: 18240,
      totalSeguidoresLinkedin: 9650,
      crescimentoSeguidoresPeriodo: 214,
      taxaEngajamentoMedia: 14.37,
      totalPostsPeriodo: 22,
      alertasAbertos: socialAlertasMock.filter((item) => !item.resolvido).length,
    },
    comparativoPlataformas: [
      { plataforma: 'instagram_business', seguidores: 18240, crescimento: 140, engajamento: 18.27 },
      { plataforma: 'linkedin_page', seguidores: 9650, crescimento: 74, engajamento: 10.46 },
    ],
    melhoresPosts,
    alertasRecentes: socialAlertasMock,
  };
}

function isDateInRange(referenceDate: string, start?: string, end?: string) {
  if (start && referenceDate < start) return false;
  if (end && referenceDate > end) return false;
  return true;
}

export function getMockSnapshots(filters?: SocialSnapshotFilters): SocialMetricaSnapshot[] {
  return socialMetricasSnapshotMock.filter((snapshot) => {
    if (filters?.contaId && snapshot.conta_id !== filters.contaId) return false;
    return isDateInRange(snapshot.data_referencia, filters?.dataInicio, filters?.dataFim);
  });
}

export function getMockPosts(filters?: SocialPostsFilters): SocialPost[] {
  return socialPostsMock.filter((post) => {
    const conta = socialContasMock.find((item) => item.id === post.conta_id);
    if (filters?.contaId && post.conta_id !== filters.contaId) return false;
    if (filters?.plataforma && conta?.plataforma !== filters.plataforma) return false;
    if (filters?.tipoPost && post.tipo_post !== filters.tipoPost) return false;
    if (filters?.campanhaId && post.campanha_id !== filters.campanhaId) return false;
    if (typeof filters?.destaque === 'boolean' && post.destaque !== filters.destaque) return false;
    return isDateInRange(post.data_publicacao.slice(0, 10), filters?.dataInicio, filters?.dataFim);
  });
}
