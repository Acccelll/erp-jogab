/**
 * Configuração de integração — Fase 7
 * Centraliza controle de feature flags, readiness por módulo e configuração de ambiente.
 */

/** Tipo de fonte de dados: API real ou mock local */
export type DataSource = 'api' | 'mock';

/** Status de readiness de um endpoint */
export type EndpointReadiness = 'ready' | 'partial' | 'mock-only';

/** Status de integração efetiva */
export type IntegrationStatus = 'integrated' | 'ready' | 'partial' | 'mock-only';

/** Configuração de um endpoint do módulo */
export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readiness: EndpointReadiness;
  /** Indica se o endpoint já está usando a API real com withApiFallback */
  integrated: boolean;
  description: string;
}

/** Readiness de um módulo inteiro */
export interface ModuleReadiness {
  module: string;
  status: EndpointReadiness;
  /** Status de integração efetiva com a API real */
  integrationStatus: IntegrationStatus;
  endpoints: EndpointConfig[];
  notes?: string;
}

/** Configuração de integração do ambiente */
export interface IntegrationConfig {
  apiBaseUrl: string;
  fallbackEnabled: boolean;
  timeoutMs: number;
}

/** Retorna a configuração de integração baseada nas variáveis de ambiente */
export function getIntegrationConfig(): IntegrationConfig {
  return {
    apiBaseUrl: import.meta.env.VITE_API_URL ?? '/api',
    fallbackEnabled: import.meta.env.VITE_API_FALLBACK !== 'false',
    timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  };
}

/**
 * Registry de readiness por módulo.
 * Documenta quais endpoints estão prontos para integração real
 * e quais já estão efetivamente integrados (usando withApiFallback).
 */
export const MODULE_READINESS: ModuleReadiness[] = [
  {
    module: 'auth',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/auth/login',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Login com credenciais',
      },
      { path: '/auth/me', method: 'GET', readiness: 'ready', integrated: true, description: 'Restaurar sessão' },
      { path: '/auth/logout', method: 'POST', readiness: 'ready', integrated: true, description: 'Logout' },
    ],
    notes: 'Integrado na Fase 5. Usa withApiFallback com mock controlado.',
  },
  {
    module: 'context',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/context/bootstrap',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Bootstrap de contexto global',
      },
      {
        path: '/context/options',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Opções de contexto (empresas, filiais, obras, etc.)',
      },
    ],
    notes: 'Integrado na Fase 5. Normaliza payload parcial, fallback mock controlado.',
  },
  {
    module: 'dashboard',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/dashboard/summary',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Resumo executivo com KPIs',
      },
    ],
    notes: 'Integrado na Fase 5. Contrato estável, normalizador completo, usa withApiFallback.',
  },
  {
    module: 'obras',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/obras',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de obras com filtros',
      },
      { path: '/obras/:id', method: 'GET', readiness: 'ready', integrated: true, description: 'Detalhe da obra' },
      { path: '/obras', method: 'POST', readiness: 'ready', integrated: true, description: 'Criar obra' },
      { path: '/obras/:id', method: 'PUT', readiness: 'ready', integrated: true, description: 'Atualizar obra' },
      {
        path: '/obras/:id/cronograma',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace da obra: cronograma',
      },
      {
        path: '/obras/:id/equipe',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace da obra: equipe',
      },
      {
        path: '/obras/:id/contratos',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace da obra: contratos',
      },
      {
        path: '/obras/:id/rh',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace da obra: RH da obra',
      },
      {
        path: '/obras/:id/alocacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace da obra: alocações vinculadas',
      },
    ],
    notes:
      'Integrado na Fase 6. CRUD completo com withApiFallback, normalizador e validação Zod, incluindo endpoints de workspace.',
  },
  {
    module: 'rh',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/rh/funcionarios',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de funcionários',
      },
      {
        path: '/rh/funcionarios/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe do funcionário',
      },
      {
        path: '/rh/funcionarios',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar funcionário',
      },
      {
        path: '/rh/funcionarios/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar funcionário',
      },
      {
        path: '/rh/funcionarios/:id/contrato',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace do funcionário: contrato',
      },
      {
        path: '/rh/funcionarios/:id/alocacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace do funcionário: alocações',
      },
      {
        path: '/rh/funcionarios/:id/horas-extras',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace do funcionário: horas extras',
      },
      {
        path: '/rh/funcionarios/:id/fopag',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Workspace do funcionário: FOPAG',
      },
      {
        path: '/rh/alocacoes',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar alocação de funcionário',
      },
      {
        path: '/rh/alocacoes/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar alocação de funcionário',
      },
      {
        path: '/rh/alocacoes/:id/encerrar',
        method: 'PATCH',
        readiness: 'ready',
        integrated: true,
        description: 'Encerrar alocação de funcionário',
      },
    ],
    notes:
      'Integrado completo na Fase 7. GET list/detail + mutações e endpoints de workspace/alocação com withApiFallback.',
  },
  {
    module: 'horas-extras',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/horas-extras',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de horas extras',
      },
      {
        path: '/horas-extras/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe da hora extra',
      },
      {
        path: '/horas-extras/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de horas extras',
      },
      {
        path: '/horas-extras/:id/aprovar',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Aprovar hora extra',
      },
      {
        path: '/horas-extras/fechamento',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Fechar competência',
      },
      {
        path: '/horas-extras/aprovacao',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dados de aprovação',
      },
    ],
    notes: 'Integrado completo na Fase 7. Fluxo principal: listagem, detalhe, dashboard, aprovação e fechamento.',
  },
  {
    module: 'fopag',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/fopag/competencias',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de competências FOPAG',
      },
      {
        path: '/fopag/competencias/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe da competência',
      },
    ],
    notes: 'Integrado na Fase 8. Contrato de leitura estável com validação Zod.',
  },
  {
    module: 'compras',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/compras/solicitacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de solicitações',
      },
      {
        path: '/compras/solicitacoes',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar solicitação de compra',
      },
      {
        path: '/compras/solicitacoes/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar solicitação',
      },
      {
        path: '/compras/cotacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de cotações',
      },
      {
        path: '/compras/cotacoes',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar cotação',
      },
      {
        path: '/compras/cotacoes/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar cotação',
      },
      {
        path: '/compras/pedidos',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de pedidos',
      },
      {
        path: '/compras/pedidos',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Emitir pedido de compra',
      },
      {
        path: '/compras/pedidos/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe do pedido',
      },
      {
        path: '/compras/pedidos/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar pedido',
      },
      {
        path: '/compras/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de compras',
      },
    ],
    notes:
      'Integrado na Fase 9 (GET). Fase 12: mutations POST/PUT para solicitações, cotações e pedidos com withApiFallback.',
  },
  {
    module: 'financeiro',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/financeiro/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard financeiro',
      },
      {
        path: '/financeiro/fluxo-caixa',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Fluxo de caixa',
      },
      {
        path: '/financeiro/pessoal',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Custos de pessoal',
      },
      {
        path: '/financeiro/contas-pagar',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Contas a pagar',
      },
      {
        path: '/financeiro/contas-receber',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Contas a receber',
      },
      {
        path: '/financeiro/titulos/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe de título',
      },
    ],
    notes: 'Integrado na Fase 8. Módulo de leitura com normalizadores para todas as views.',
  },
  {
    module: 'fiscal',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/fiscal/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard fiscal',
      },
      {
        path: '/fiscal/entradas',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Documentos de entrada',
      },
      {
        path: '/fiscal/documentos',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar documento fiscal',
      },
      {
        path: '/fiscal/saidas',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Documentos de saída',
      },
      {
        path: '/fiscal/documentos/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe de documento fiscal',
      },
      {
        path: '/fiscal/documentos/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar documento fiscal',
      },
    ],
    notes: 'Integrado na Fase 10 (GET). Fase 12: mutations POST/PUT para documentos fiscais com withApiFallback.',
  },
  {
    module: 'estoque',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/estoque/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de estoque',
      },
      {
        path: '/estoque/movimentacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Movimentações',
      },
      {
        path: '/estoque/movimentacoes',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Registrar movimentação de estoque',
      },
      {
        path: '/estoque/itens/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe de item',
      },
      {
        path: '/estoque/itens/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar item de estoque',
      },
    ],
    notes: 'Integrado na Fase 11 (GET). Fase 12: mutations POST movimentação e PUT item com withApiFallback.',
  },
  {
    module: 'medicoes',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/medicoes/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de medições',
      },
      { path: '/medicoes', method: 'GET', readiness: 'ready', integrated: true, description: 'Listagem de medições' },
      {
        path: '/medicoes',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criar medição',
      },
      {
        path: '/medicoes/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe da medição',
      },
      {
        path: '/medicoes/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualizar medição',
      },
      {
        path: '/medicoes/:id/aprovar',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Aprovar medição',
      },
    ],
    notes:
      'Integrado na Fase 11 (GET). Fase 12: mutations POST criar, PUT atualizar, POST aprovar com withApiFallback.',
  },
  {
    module: 'documentos',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/documentos/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de documentos',
      },
      {
        path: '/documentos/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe do documento',
      },
      {
        path: '/documentos/upload',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Upload de documento',
      },
      {
        path: '/documentos/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualização de documento',
      },
    ],
    notes: 'Integrado na Fase 11. Dashboard, detalhe, upload e atualização com withApiFallback.',
  },
  {
    module: 'relatorios',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/relatorios/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard de relatórios',
      },
      {
        path: '/relatorios/categorias/:categoria',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Relatórios por categoria',
      },
      {
        path: '/relatorios/gerar',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Gerar relatório sob demanda',
      },
    ],
    notes: 'Integrado na Fase 10 (GET). Fase 12: mutation POST gerar relatório com withApiFallback.',
  },
  {
    module: 'admin',
    status: 'ready',
    integrationStatus: 'integrated',
    endpoints: [
      {
        path: '/admin/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Dashboard administrativo',
      },
      {
        path: '/admin/usuarios',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de usuários',
      },
      {
        path: '/admin/usuarios',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criação de usuário',
      },
      {
        path: '/admin/usuarios/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualização de usuário',
      },
      {
        path: '/admin/perfis',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de perfis',
      },
      {
        path: '/admin/perfis',
        method: 'POST',
        readiness: 'ready',
        integrated: true,
        description: 'Criação de perfil',
      },
      {
        path: '/admin/perfis/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualização de perfil',
      },
      {
        path: '/admin/permissoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de permissões',
      },
      {
        path: '/admin/permissoes/:id',
        method: 'PUT',
        readiness: 'ready',
        integrated: true,
        description: 'Atualização de permissão',
      },
      {
        path: '/admin/parametros',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Parâmetros do sistema',
      },
      { path: '/admin/logs', method: 'GET', readiness: 'ready', integrated: true, description: 'Logs de auditoria' },
      {
        path: '/admin/integracoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Integrações',
      },
    ],
    notes: 'Integrado na Fase 11. Leituras e CRUD de usuários/perfis/permissões com withApiFallback.',
  },
];

/** Retorna readiness de um módulo específico */
export function getModuleReadiness(moduleName: string): ModuleReadiness | undefined {
  return MODULE_READINESS.find((m) => m.module === moduleName);
}

/** Retorna todos os módulos prontos para integração imediata */
export function getReadyModules(): ModuleReadiness[] {
  return MODULE_READINESS.filter((m) => m.status === 'ready');
}

/** Retorna todos os módulos que já estão efetivamente integrados com a API real */
export function getIntegratedModules(): ModuleReadiness[] {
  return MODULE_READINESS.filter((m) => m.integrationStatus === 'integrated');
}
