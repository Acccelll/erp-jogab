-- Migration MVP: módulo Social / Redes Sociais
-- Data: 2026-04-06

CREATE TABLE IF NOT EXISTS social_contas (
  id UUID PRIMARY KEY,
  plataforma VARCHAR(40) NOT NULL,
  nome_conta VARCHAR(160) NOT NULL,
  identificador_externo VARCHAR(180) NOT NULL,
  url_conta TEXT NOT NULL,
  token_acesso TEXT NOT NULL,
  token_refresh TEXT,
  token_expira_em TIMESTAMP,
  escopos JSONB NOT NULL DEFAULT '[]'::jsonb,
  status_conexao VARCHAR(30) NOT NULL,
  ultima_sincronizacao TIMESTAMP,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  usuario_criacao_id VARCHAR(64) NOT NULL,
  usuario_ultima_modificacao_id VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS social_metricas_snapshot (
  id UUID PRIMARY KEY,
  conta_id UUID NOT NULL REFERENCES social_contas(id),
  data_referencia DATE NOT NULL,
  seguidores_total INTEGER NOT NULL DEFAULT 0,
  seguidores_novos INTEGER NOT NULL DEFAULT 0,
  impressoes INTEGER NOT NULL DEFAULT 0,
  alcance INTEGER NOT NULL DEFAULT 0,
  visitas_perfil INTEGER NOT NULL DEFAULT 0,
  cliques_link INTEGER NOT NULL DEFAULT 0,
  engajamento_total INTEGER NOT NULL DEFAULT 0,
  taxa_engajamento NUMERIC(8,2) NOT NULL DEFAULT 0,
  quantidade_posts_periodo INTEGER NOT NULL DEFAULT 0,
  observacoes TEXT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  usuario_criacao_id VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS social_campanhas (
  id UUID PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  objetivo TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  usuario_criacao_id VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY,
  conta_id UUID NOT NULL REFERENCES social_contas(id),
  id_externo_post VARCHAR(180) NOT NULL,
  data_publicacao TIMESTAMP NOT NULL,
  titulo_legenda VARCHAR(255),
  legenda_completa TEXT,
  url_post TEXT NOT NULL,
  tipo_post VARCHAR(40) NOT NULL,
  campanha_id UUID REFERENCES social_campanhas(id),
  impressoes INTEGER NOT NULL DEFAULT 0,
  alcance INTEGER NOT NULL DEFAULT 0,
  curtidas INTEGER NOT NULL DEFAULT 0,
  comentarios INTEGER NOT NULL DEFAULT 0,
  compartilhamentos INTEGER NOT NULL DEFAULT 0,
  salvamentos INTEGER NOT NULL DEFAULT 0,
  cliques INTEGER NOT NULL DEFAULT 0,
  engajamento_total INTEGER NOT NULL DEFAULT 0,
  taxa_engajamento NUMERIC(8,2) NOT NULL DEFAULT 0,
  destaque BOOLEAN NOT NULL DEFAULT FALSE,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  usuario_criacao_id VARCHAR(64) NOT NULL,
  usuario_ultima_modificacao_id VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS social_alertas (
  id UUID PRIMARY KEY,
  conta_id UUID NOT NULL REFERENCES social_contas(id),
  tipo_alerta VARCHAR(40) NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descricao TEXT NOT NULL,
  severidade VARCHAR(20) NOT NULL,
  resolvido BOOLEAN NOT NULL DEFAULT FALSE,
  data_referencia DATE NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  usuario_criacao_id VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_snapshot_conta_data ON social_metricas_snapshot (conta_id, data_referencia DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_conta_data ON social_posts (conta_id, data_publicacao DESC);
CREATE INDEX IF NOT EXISTS idx_social_alertas_conta_status ON social_alertas (conta_id, resolvido, data_referencia DESC);
