import type {
  Documento,
  DocumentoDetalheData,
  DocumentosDashboardData,
  DocumentosFiltersData,
  DocumentosKpis,
  DocumentosResumoCardData,
  DocumentosStatusResumo,
  DocumentosVencimentoResumo,
} from '../types';
import {
  DOCUMENTO_ALERTA_LABELS,
  DOCUMENTO_STATUS_LABELS,
} from '../types';

const documentos: Documento[] = [
  {
    id: 'doc-001', codigo: 'DOC-OBR-001', titulo: 'ART da Obra - Fundação', tipo: 'licenca', entidade: 'obra', status: 'vigente', obraId: 'obra-1', obraNome: 'OBR-001 — Edifício Aurora', entidadeId: 'obra-1', entidadeNome: 'Edifício Aurora', competencia: '2026-03', contratoCodigo: 'CTR-041', responsavelNome: 'Luciana Nobre', versao: 'v3', vencimento: { dataEmissao: '2026-01-05', dataVencimento: '2026-12-31', diasParaVencer: 285, alerta: 'sem_alerta' }, ultimaAtualizacaoEm: '2026-03-18',
  },
  {
    id: 'doc-002', codigo: 'DOC-RH-014', titulo: 'ASO periódico - João Silva', tipo: 'aso', entidade: 'funcionario', status: 'a_vencer', obraId: 'obra-2', obraNome: 'OBR-002 — Residencial Parque', entidadeId: 'func-22', entidadeNome: 'João Silva', competencia: '2026-03', responsavelNome: 'Amanda Reis', versao: 'v1', vencimento: { dataEmissao: '2025-04-01', dataVencimento: '2026-04-02', diasParaVencer: 12, alerta: 'atencao' }, ultimaAtualizacaoEm: '2026-03-19',
  },
  {
    id: 'doc-003', codigo: 'DOC-FOR-088', titulo: 'Certidão negativa - Concreforte Materiais', tipo: 'certidao', entidade: 'fornecedor', status: 'vencido', entidadeId: 'forn-88', entidadeNome: 'Concreforte Materiais', fornecedorNome: 'Concreforte Materiais', competencia: '2026-03', responsavelNome: 'Larissa Nogueira', versao: 'v5', vencimento: { dataEmissao: '2025-11-01', dataVencimento: '2026-03-10', diasParaVencer: -11, alerta: 'critico' }, ultimaAtualizacaoEm: '2026-03-20',
  },
  {
    id: 'doc-004', codigo: 'DOC-CTR-102', titulo: 'Contrato principal DNIT - Trecho Norte', tipo: 'contrato', entidade: 'contrato', status: 'em_analise', obraId: 'obra-4', obraNome: 'OBR-004 — Ponte BR-101', entidadeId: 'ctr-102', entidadeNome: 'Contrato DNIT', contratoCodigo: 'CTR-102', responsavelNome: 'Tatiane Prado', versao: 'v7', vencimento: { dataEmissao: '2025-06-15', dataVencimento: '2027-06-15', diasParaVencer: 451, alerta: 'sem_alerta' }, ultimaAtualizacaoEm: '2026-03-17',
  },
  {
    id: 'doc-005', codigo: 'DOC-FIS-331', titulo: 'Comprovante fiscal de retenção', tipo: 'fiscal', entidade: 'obra', status: 'pendente_envio', obraId: 'obra-3', obraNome: 'OBR-003 — Torre Empresarial', entidadeId: 'obra-3', entidadeNome: 'Torre Empresarial', competencia: '2026-02', contratoCodigo: 'CTR-073', responsavelNome: 'Fernanda Cruz', versao: 'v2', vencimento: { dataEmissao: '2026-02-28', dataVencimento: '2026-03-25', diasParaVencer: 4, alerta: 'atencao' }, ultimaAtualizacaoEm: '2026-03-21',
  },
  {
    id: 'doc-006', codigo: 'DOC-EMP-009', titulo: 'Apólice de seguro corporativo', tipo: 'seguranca', entidade: 'empresa', status: 'arquivado', entidadeId: 'emp-1', entidadeNome: 'JOGAB Engenharia Ltda', responsavelNome: 'Marcos Vinicius', versao: 'v9', vencimento: { dataEmissao: '2024-01-01', dataVencimento: '2025-12-31', diasParaVencer: -81, alerta: 'critico' }, ultimaAtualizacaoEm: '2026-01-15',
  },
  {
    id: 'doc-007', codigo: 'DOC-OBR-007', titulo: 'Alvará de Construção - Hospital', tipo: 'licenca', entidade: 'obra', status: 'vigente', obraId: 'obra-7', obraNome: 'OBR-007 — Hospital da Luz', entidadeId: 'obra-7', entidadeNome: 'Hospital da Luz', competencia: '2026-03', responsavelNome: 'Rafael Lima', versao: 'v1', vencimento: { dataEmissao: '2025-01-01', dataVencimento: '2027-01-01', diasParaVencer: 285, alerta: 'sem_alerta' }, ultimaAtualizacaoEm: '2026-03-20',
  },
];

const documentoDetalhes: Record<string, DocumentoDetalheData> = {
  'doc-001': {
    documento: documentos[0],
    integracoes: [
      { modulo: 'Obras', descricao: 'Documento operacional vinculado ao workspace da obra.', href: '/obras/obra-1/documentos' },
      { modulo: 'Contratos', descricao: 'Relacionamento mantido com o contrato principal da obra.', href: '/medicoes' },
      { modulo: 'Alertas', descricao: 'Preparado para alertas automáticos de vencimento e renovação.' },
    ],
    historico: [
      { id: 'hist-1', label: 'Versão publicada', descricao: 'Nova ART publicada após atualização do escopo de fundação.', data: '2026-03-18' },
      { id: 'hist-2', label: 'Revisão técnica', descricao: 'Documento validado pela engenharia responsável.', data: '2026-03-16' },
    ],
    observacoes: [
      'Preparado para anexos binários e múltiplas versões em fase futura.',
      'Vínculo com obra, contrato e vencimento preservado para alertas automáticos.',
    ],
  },
};

function matchesFilters(item: Documento, filters?: DocumentosFiltersData) {
  if (!filters) return true;

  const search = filters.search?.trim().toLowerCase();
  if (search) {
    const haystack = [item.codigo, item.titulo, item.entidadeNome, item.obraNome, item.fornecedorNome, item.contratoCodigo, item.responsavelNome]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (filters.status && item.status !== filters.status) return false;
  if (filters.tipo && item.tipo !== filters.tipo) return false;
  if (filters.entidade && item.entidade !== filters.entidade) return false;
  if (filters.alerta && item.vencimento.alerta !== filters.alerta) return false;
  if (filters.competencia && item.competencia !== filters.competencia) return false;
  if (filters.obraId && item.obraId !== filters.obraId) return false;

  return true;
}

export function getMockDocumentos(filters?: DocumentosFiltersData): Documento[] {
  return documentos.filter((item) => matchesFilters(item, filters));
}

function buildKpis(items: Documento[]): DocumentosKpis {
  return {
    totalDocumentos: items.length,
    vigentes: items.filter((item) => item.status === 'vigente').length,
    aVencer: items.filter((item) => item.status === 'a_vencer').length,
    vencidos: items.filter((item) => item.status === 'vencido').length,
    entidadesCobertas: new Set(items.map((item) => `${item.entidade}-${item.entidadeId}`)).size,
    alertasCriticos: items.filter((item) => item.vencimento.alerta === 'critico').length,
  };
}

function buildResumoCards(items: Documento[]): DocumentosResumoCardData[] {
  return [
    {
      id: 'integracao-obras-rh',
      titulo: 'Integração com Obras e RH',
      descricao: 'Documentos operacionais e trabalhistas vinculados à obra ativa e aos funcionários alocados.',
      itens: [
        { label: 'Obras cobertas', valor: String(new Set(items.map((item) => item.obraId).filter(Boolean)).size) },
        { label: 'Funcionários', valor: String(items.filter((item) => item.entidade === 'funcionario').length), destaque: true },
        { label: 'Contratos referenciados', valor: String(items.filter((item) => item.contratoCodigo).length) },
      ],
    },
    {
      id: 'fornecedores-contratos',
      titulo: 'Fornecedores e contratos',
      descricao: 'Base preparada para compliance documental de fornecedores e contratos vinculados ao fluxo operacional.',
      itens: [
        { label: 'Fornecedores', valor: String(items.filter((item) => item.entidade === 'fornecedor').length) },
        { label: 'Contratos', valor: String(items.filter((item) => item.entidade === 'contrato').length), destaque: true },
        { label: 'Em análise', valor: String(items.filter((item) => item.status === 'em_analise').length) },
      ],
    },
    {
      id: 'vencimentos-alertas',
      titulo: 'Vencimentos e alertas',
      descricao: 'Leitura do risco documental por proximidade de vencimento e pendências de renovação/envio.',
      itens: [
        { label: 'A vencer', valor: String(items.filter((item) => item.status === 'a_vencer').length) },
        { label: 'Críticos', valor: String(items.filter((item) => item.vencimento.alerta === 'critico').length), destaque: true },
        { label: 'Pendentes', valor: String(items.filter((item) => item.status === 'pendente_envio').length) },
      ],
    },
  ];
}

function buildStatusResumo(items: Documento[]): DocumentosStatusResumo[] {
  return Array.from(new Set(items.map((item) => item.status))).map((status) => ({
    status,
    label: DOCUMENTO_STATUS_LABELS[status],
    quantidade: items.filter((item) => item.status === status).length,
    descricao: status === 'vencido'
      ? 'Documentos que exigem regularização imediata.'
      : 'Documentos acompanhados na governança documental do ERP.',
  }));
}

function buildVencimentoResumo(items: Documento[]): DocumentosVencimentoResumo[] {
  return Array.from(new Set(items.map((item) => item.vencimento.alerta))).map((alerta) => ({
    alerta,
    label: DOCUMENTO_ALERTA_LABELS[alerta],
    quantidade: items.filter((item) => item.vencimento.alerta === alerta).length,
    descricao: alerta === 'critico'
      ? 'Documentos já vencidos ou em situação crítica para operação/compliance.'
      : 'Documentos monitorados conforme proximidade de vencimento.',
  }));
}

export function getMockDocumentosDashboard(filters?: DocumentosFiltersData): DocumentosDashboardData {
  const filtered = getMockDocumentos(filters);
  return {
    documentos: filtered,
    kpis: buildKpis(filtered),
    resumoCards: buildResumoCards(filtered),
    statusResumo: buildStatusResumo(filtered),
    vencimentoResumo: buildVencimentoResumo(filtered),
  };
}

export function getMockDocumentoById(documentoId: string): DocumentoDetalheData | undefined {
  if (documentoDetalhes[documentoId]) return documentoDetalhes[documentoId];

  const documento = documentos.find((item) => item.id === documentoId);
  if (!documento) return undefined;

  return {
    documento,
    integracoes: [
      { modulo: 'Documentos da Obra', descricao: 'Relacionamento preservado com a entidade vinculada e seu contexto operacional.' },
      { modulo: 'Alertas', descricao: 'Preparado para alertas automáticos por vencimento e não conformidade.' },
    ],
    historico: [
      { id: `${documentoId}-hist-1`, label: 'Registro consolidado', descricao: 'Documento disponível para consulta nesta fase mockada do frontend.', data: documento.ultimaAtualizacaoEm },
    ],
    observacoes: [
      `Status atual: ${DOCUMENTO_STATUS_LABELS[documento.status]}.`,
      `Alerta de vencimento: ${DOCUMENTO_ALERTA_LABELS[documento.vencimento.alerta]}.`,
    ],
  };
}
