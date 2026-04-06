export type SocialPlataforma = 'instagram_business' | 'linkedin_page';
export type SocialStatusConexao = 'conectado' | 'token_expirado' | 'erro' | 'desconectado';
export type SocialSeveridade = 'baixa' | 'media' | 'alta' | 'critica';

export interface SocialConta {
  id: string;
  plataforma: SocialPlataforma;
  nome_conta: string;
  identificador_externo: string;
  url_conta: string;
  token_acesso: string;
  token_refresh: string;
  token_expira_em: string;
  escopos: string[];
  status_conexao: SocialStatusConexao;
  ultima_sincronizacao: string | null;
  ativo: boolean;
  data_cadastro: string;
  usuario_criacao_id: string;
  usuario_ultima_modificacao_id: string;
}

export interface SocialMetricaSnapshot {
  id: string;
  conta_id: string;
  data_referencia: string;
  seguidores_total: number;
  seguidores_novos: number;
  impressoes: number;
  alcance: number;
  visitas_perfil: number;
  cliques_link: number;
  engajamento_total: number;
  taxa_engajamento: number;
  quantidade_posts_periodo: number;
  observacoes?: string;
  data_cadastro: string;
  usuario_criacao_id: string;
}

export interface SocialPost {
  id: string;
  conta_id: string;
  id_externo_post: string;
  data_publicacao: string;
  titulo_legenda: string;
  legenda_completa: string;
  url_post: string;
  tipo_post: 'feed' | 'reel' | 'story' | 'carrossel' | 'artigo' | 'video' | 'texto';
  campanha_id: string | null;
  impressoes: number;
  alcance: number;
  curtidas: number;
  comentarios: number;
  compartilhamentos: number;
  salvamentos: number;
  cliques: number;
  engajamento_total: number;
  taxa_engajamento: number;
  destaque: boolean;
  data_cadastro: string;
  usuario_criacao_id: string;
  usuario_ultima_modificacao_id: string;
}

export interface SocialAlerta {
  id: string;
  conta_id: string;
  tipo_alerta: 'conexao' | 'queda_engajamento' | 'crescimento' | 'operacional';
  titulo: string;
  descricao: string;
  severidade: SocialSeveridade;
  resolvido: boolean;
  data_referencia: string;
  data_cadastro: string;
  usuario_criacao_id: string;
}

export interface SocialCampanha {
  id: string;
  nome: string;
  objetivo: string;
  data_inicio: string;
  data_fim?: string;
  ativo: boolean;
}

export interface SocialDashboardData {
  resumo: {
    totalSeguidoresInstagram: number;
    totalSeguidoresLinkedin: number;
    crescimentoSeguidoresPeriodo: number;
    taxaEngajamentoMedia: number;
    totalPostsPeriodo: number;
    alertasAbertos: number;
  };
  comparativoPlataformas: Array<{
    plataforma: SocialPlataforma;
    seguidores: number;
    crescimento: number;
    engajamento: number;
  }>;
  melhoresPosts: SocialPost[];
  alertasRecentes: SocialAlerta[];
}

export interface SocialSnapshotFilters {
  contaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface SocialPostsFilters {
  contaId?: string;
  plataforma?: SocialPlataforma;
  tipoPost?: SocialPost['tipo_post'];
  campanhaId?: string;
  dataInicio?: string;
  dataFim?: string;
  destaque?: boolean;
}

export interface SocialRelatorioExportacaoPayload {
  formato: 'pdf' | 'xlsx' | 'csv';
  dataInicio: string;
  dataFim: string;
  plataforma?: SocialPlataforma;
}

export interface SocialRelatorioExportacaoResult {
  id: string;
  status: 'processando' | 'concluido';
  url: string;
}

export interface SocialContaPayload {
  plataforma: SocialPlataforma;
  nome_conta: string;
  identificador_externo: string;
  url_conta: string;
  escopos: string[];
}
