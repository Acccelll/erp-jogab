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
    ],
    notes: 'Integrado na Fase 6. CRUD completo com withApiFallback, normalizador e validação Zod.',
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
    ],
    notes: 'Integrado completo na Fase 7. GET list/detail (Fase 6) + POST/PUT mutações (Fase 7).',
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
        path: '/compras/cotacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de cotações',
      },
      {
        path: '/compras/pedidos',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Listagem de pedidos',
      },
      {
        path: '/compras/pedidos/:id',
        method: 'GET',
        readiness: 'ready',
        integrated: true,
        description: 'Detalhe do pedido',
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
      'Integrado na Fase 9. Fluxo de 3 etapas (solicitação → cotação → pedido) com withApiFallback e normalizador.',
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
    ],
    notes:
      'Integrado na Fase 10. Módulo de leitura com normalizadores completos e withApiFallback em todos os endpoints.',
  },
  {
    module: 'estoque',
    status: 'partial',
    integrationStatus: 'partial',
    endpoints: [
      {
        path: '/estoque/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Dashboard de estoque',
      },
      {
        path: '/estoque/movimentacoes',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Movimentações',
      },
      {
        path: '/estoque/itens/:id',
        method: 'GET',
        readiness: 'partial',
        integrated: false,
        description: 'Detalhe de item',
      },
    ],
    notes: 'Dashboard e listagem prontos. Detalhe de item ainda parcial.',
  },
  {
    module: 'medicoes',
    status: 'partial',
    integrationStatus: 'partial',
    endpoints: [
      {
        path: '/medicoes/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Dashboard de medições',
      },
      { path: '/medicoes', method: 'GET', readiness: 'ready', integrated: false, description: 'Listagem de medições' },
      {
        path: '/medicoes/:id',
        method: 'GET',
        readiness: 'partial',
        integrated: false,
        description: 'Detalhe da medição',
      },
    ],
    notes: 'Dashboard e listagem prontos. Detalhe parcial.',
  },
  {
    module: 'documentos',
    status: 'partial',
    integrationStatus: 'partial',
    endpoints: [
      {
        path: '/documentos/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Dashboard de documentos',
      },
      {
        path: '/documentos/:id',
        method: 'GET',
        readiness: 'partial',
        integrated: false,
        description: 'Detalhe do documento',
      },
    ],
    notes: 'Dashboard pronto. Upload e gestão de documentos pendentes.',
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
    ],
    notes: 'Integrado na Fase 10. Contrato de leitura estável com normalizadores e withApiFallback.',
  },
  {
    module: 'admin',
    status: 'partial',
    integrationStatus: 'partial',
    endpoints: [
      {
        path: '/admin/dashboard',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Dashboard administrativo',
      },
      {
        path: '/admin/usuarios',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Listagem de usuários',
      },
      {
        path: '/admin/perfis',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Listagem de perfis',
      },
      {
        path: '/admin/permissoes',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Listagem de permissões',
      },
      {
        path: '/admin/parametros',
        method: 'GET',
        readiness: 'ready',
        integrated: false,
        description: 'Parâmetros do sistema',
      },
      { path: '/admin/logs', method: 'GET', readiness: 'ready', integrated: false, description: 'Logs de auditoria' },
      { path: '/admin/integracoes', method: 'GET', readiness: 'ready', integrated: false, description: 'Integrações' },
    ],
    notes: 'Leituras prontas. CRUD de usuários/perfis/permissões pendente.',
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
