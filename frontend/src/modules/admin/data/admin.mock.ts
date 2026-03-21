import type {
  AdminCategoria,
  AdminCategoriaCardData,
  AdminDashboardData,
  AdminFiltersData,
  AdminIntegracao,
  AdminLog,
  AdminParametro,
  AdminPerfil,
  AdminPermissao,
  AdminResumoExecutivo,
  AdminUsuario,
} from '../types';
import { ADMIN_CATEGORIA_DESCRICOES, ADMIN_CATEGORIA_LABELS } from '../types';

export const adminUsuarios: AdminUsuario[] = [
  { id: 'usr-1', nome: 'Camila Freitas', email: 'camila@jogab.com', perfilNome: 'Administradora ERP', status: 'ativo', obraEscopo: 'Todas as obras', ultimoAcessoEm: '2026-03-21 09:12' },
  { id: 'usr-2', nome: 'Rafael Prado', email: 'rafael@jogab.com', perfilNome: 'Coordenador RH', status: 'ativo', obraEscopo: 'RH Corporativo', ultimoAcessoEm: '2026-03-20 18:02' },
  { id: 'usr-3', nome: 'Lia Gomes', email: 'lia@jogab.com', perfilNome: 'Auditoria', status: 'pendente', obraEscopo: 'Matriz', ultimoAcessoEm: '2026-03-19 11:40' },
];
export const adminPerfis: AdminPerfil[] = [
  { id: 'prf-1', nome: 'Administradora ERP', descricao: 'Acesso amplo a governança e parametrizações.', usuarios: 2, status: 'ativo' },
  { id: 'prf-2', nome: 'Coordenador RH', descricao: 'Acesso a RH, documentos e relatórios correlatos.', usuarios: 4, status: 'ativo' },
  { id: 'prf-3', nome: 'Auditoria', descricao: 'Leitura ampliada e acesso a logs.', usuarios: 1, status: 'sincronizado' },
];
export const adminPermissoes: AdminPermissao[] = [
  { id: 'perm-1', modulo: 'Financeiro', recurso: 'Títulos', nivel: 'aprovar', perfilNome: 'Administradora ERP', status: 'ativo' },
  { id: 'perm-2', modulo: 'RH', recurso: 'Funcionários', nivel: 'editar', perfilNome: 'Coordenador RH', status: 'ativo' },
  { id: 'perm-3', modulo: 'Admin', recurso: 'Logs', nivel: 'visualizar', perfilNome: 'Auditoria', status: 'sincronizado' },
];
export const adminParametros: AdminParametro[] = [
  { id: 'par-1', chave: 'erp.contexto.competencia_padrao', descricao: 'Competência inicial do sistema', valorAtual: '2026-03', escopo: 'Global', status: 'ativo' },
  { id: 'par-2', chave: 'fopag.aprovacao.dupla', descricao: 'Exige dupla aprovação na folha', valorAtual: 'true', escopo: 'FOPAG', status: 'ativo' },
  { id: 'par-3', chave: 'integracoes.fiscal.timeout', descricao: 'Timeout de integração fiscal', valorAtual: '30s', escopo: 'Fiscal', status: 'pendente' },
];
export const adminLogs: AdminLog[] = [
  { id: 'log-1', usuarioNome: 'Camila Freitas', acao: 'Atualizou perfil', modulo: 'Admin', entidade: 'Perfil Administradora ERP', data: '2026-03-21 09:15', status: 'sincronizado' },
  { id: 'log-2', usuarioNome: 'Rafael Prado', acao: 'Alterou parâmetro', modulo: 'RH', entidade: 'fopag.aprovacao.dupla', data: '2026-03-20 16:10', status: 'ativo' },
  { id: 'log-3', usuarioNome: 'Sistema', acao: 'Falha de sincronização', modulo: 'Integrações', entidade: 'API Fiscal', data: '2026-03-20 08:02', status: 'erro' },
];
export const adminIntegracoes: AdminIntegracao[] = [
  { id: 'int-1', nome: 'API Fiscal', descricao: 'Integração de documentos fiscais e validações.', status: 'erro', ultimaSincronizacaoEm: '2026-03-20 08:02' },
  { id: 'int-2', nome: 'Conciliação Bancária', descricao: 'Sincronização de extratos e conciliação financeira.', status: 'sincronizado', ultimaSincronizacaoEm: '2026-03-21 07:00' },
  { id: 'int-3', nome: 'SSO Corporativo', descricao: 'Preparação para autenticação centralizada.', status: 'pendente' },
];

function matchesSearch(text: string, search?: string) {
  if (!search?.trim()) return true;
  return text.toLowerCase().includes(search.trim().toLowerCase());
}

export function filterByAdmin<T extends { status: string }>(items: T[], filters?: AdminFiltersData, textSelector?: (item: T) => string): T[] {
  if (!filters) return items;
  return items.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (textSelector && !matchesSearch(textSelector(item), filters.search)) return false;
    return true;
  });
}

export function getMockAdminDashboard(filters?: AdminFiltersData): AdminDashboardData {
  const usuarios = filterByAdmin(adminUsuarios, filters, (item) => `${item.nome} ${item.email} ${item.perfilNome}`);
  const perfis = filterByAdmin(adminPerfis, filters, (item) => `${item.nome} ${item.descricao}`);
  const permissoes = filterByAdmin(adminPermissoes, filters, (item) => `${item.modulo} ${item.recurso} ${item.perfilNome}`);
  const parametros = filterByAdmin(adminParametros, filters, (item) => `${item.chave} ${item.descricao} ${item.escopo}`);
  const logs = filterByAdmin(adminLogs, filters, (item) => `${item.usuarioNome} ${item.acao} ${item.modulo} ${item.entidade}`);
  const integracoes = filterByAdmin(adminIntegracoes, filters, (item) => `${item.nome} ${item.descricao}`);

  const resumo: AdminResumoExecutivo = {
    totalUsuarios: usuarios.length,
    totalPerfis: perfis.length,
    totalPermissoes: permissoes.length,
    parametrosAtivos: parametros.filter((item) => item.status === 'ativo').length,
    logsRecentes: logs.length,
    integracoesAtivas: integracoes.filter((item) => item.status === 'sincronizado' || item.status === 'ativo').length,
  };

  const categoriasBase: Record<AdminCategoria, { total: number; ativos: number }> = {
    usuarios: { total: usuarios.length, ativos: usuarios.filter((item) => item.status === 'ativo').length },
    perfis: { total: perfis.length, ativos: perfis.filter((item) => item.status === 'ativo' || item.status === 'sincronizado').length },
    permissoes: { total: permissoes.length, ativos: permissoes.filter((item) => item.status === 'ativo' || item.status === 'sincronizado').length },
    parametros: { total: parametros.length, ativos: parametros.filter((item) => item.status === 'ativo').length },
    logs: { total: logs.length, ativos: logs.filter((item) => item.status !== 'erro').length },
    integracoes: { total: integracoes.length, ativos: integracoes.filter((item) => item.status === 'sincronizado' || item.status === 'ativo').length },
  };

  const categorias: AdminCategoriaCardData[] = (Object.keys(categoriasBase) as AdminCategoria[]).map((categoria) => ({
    categoria,
    titulo: ADMIN_CATEGORIA_LABELS[categoria],
    descricao: ADMIN_CATEGORIA_DESCRICOES[categoria],
    quantidade: categoriasBase[categoria].total,
    ativos: categoriasBase[categoria].ativos,
  }));

  return { resumo, categorias, usuarios, perfis, permissoes, parametros, logs, integracoes };
}
