import type { ReactElement } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Clock,
  DollarSign,
  FileSignature,
  FolderOpen,
  Gift,
  Package,
  Palmtree,
  Receipt,
  Ruler,
  ShoppingCart,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/app/guards';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ModuleLayout } from '@/app/layouts/ModuleLayout';
import { ObraWorkspaceLayout } from '@/app/layouts/ObraWorkspaceLayout';
import { NotFoundPage } from '@/shared/components';

// Module pages (lazy loading será adicionado em fases futuras)
import { DashboardPage } from '@/modules/dashboard';
import {
  ObraComprasPage,
  ObraCronogramaPage,
  ObraDocumentosPage,
  ObraEquipePage,
  ObraFinanceiroPage,
  ObrasListPage,
  ObraVisaoGeralPage,
} from '@/modules/obras';
import { ObraTabPlaceholder } from '@/modules/obras/components';
import {
  FuncionarioAlocacoesPage,
  FuncionarioContratoPage,
  FuncionarioDecimoTerceiroPage,
  FuncionarioDetailPage,
  FuncionarioDocumentosPage,
  FuncionarioFeriasPage,
  FuncionarioFopagPage,
  FuncionarioHistoricoSalarialPage,
  FuncionarioHorasExtrasPage,
  FuncionarioProvisoesPage,
  FuncionariosListPage,
} from '@/modules/rh';
import { FuncionarioTabPlaceholder } from '@/modules/rh/components';
import {
  AdminIntegracoesPage,
  AdminLogsPage,
  AdminPage,
  AdminParametrosPage,
  AdminPerfisPage,
  AdminPermissoesPage,
  AdminUsuariosPage,
} from '@/modules/admin';
import {
  ComprasCotacoesPage,
  ComprasListPage,
  ComprasPedidosPage,
  ComprasSolicitacoesPage,
  PedidoCompraDetailPage,
} from '@/modules/compras';
import { DocumentoDetailPage, DocumentosListPage } from '@/modules/documentos';
import { EstoqueItemDetailPage, EstoqueListPage, EstoqueMovimentacoesPage } from '@/modules/estoque';
import {
  ContasPagarPage,
  ContasReceberPage,
  FinanceiroListPage,
  FluxoCaixaPage,
  TituloFinanceiroDetailPage,
} from '@/modules/financeiro';
import {
  DocumentoFiscalDetailPage,
  FiscalEntradasPage,
  FiscalListPage,
  FiscalSaidasPage,
} from '@/modules/fiscal';
import {
  FopagCompetenciaDetailPage,
  FopagCompetenciaEventosPage,
  FopagCompetenciaFinanceiroPage,
  FopagCompetenciaFuncionariosPage,
  FopagCompetenciaObrasPage,
  FopagCompetenciaOverviewPage,
  FopagCompetenciaPrevistoRealizadoPage,
  FopagCompetenciaRateioPage,
  FopagListPage,
} from '@/modules/fopag';
import {
  HorasExtrasAprovacaoPage,
  HorasExtrasDashboardPage,
  HorasExtrasFechamentoPage,
} from '@/modules/horas-extras';
import { MedicaoDetailPage, MedicoesListPage } from '@/modules/medicoes';
import { PerfilPage } from '@/modules/perfil';
import { RelatorioCategoriaPage, RelatoriosListPage } from '@/modules/relatorios';

interface PlaceholderTabConfig {
  description: string;
  icon: LucideIcon;
  path: string;
  title: string;
}

const obraWorkspaceTabs: PlaceholderTabConfig[] = [
  {
    path: 'cronograma',
    icon: CalendarDays,
    title: 'Cronograma',
    description:
      'Cronograma físico-financeiro da obra com etapas, marcos e percentual de avanço.',
  },
  {
    path: 'contratos',
    icon: FileSignature,
    title: 'Contratos',
    description:
      'Contratos da obra com clientes e fornecedores, aditivos e medições vinculadas.',
  },
  {
    path: 'equipe',
    icon: UsersRound,
    title: 'Equipe',
    description:
      'Equipe alocada na obra com cargos, funções, jornadas e período de atuação.',
  },
  {
    path: 'rh',
    icon: Users,
    title: 'RH da Obra',
    description:
      'Dados de RH dos funcionários alocados na obra com vínculo de centro de custo.',
  },
  {
    path: 'compras',
    icon: ShoppingCart,
    title: 'Compras da Obra',
    description:
      'Solicitações, cotações e pedidos de compra vinculados à execução da obra.',
  },
  {
    path: 'financeiro',
    icon: DollarSign,
    title: 'Financeiro da Obra',
    description:
      'Visão financeira da obra com títulos, previsões de desembolso e custos realizados.',
  },
  {
    path: 'estoque',
    icon: Package,
    title: 'Estoque da Obra',
    description:
      'Movimentações de estoque, consumo de materiais e saldos por obra.',
  },
  {
    path: 'medicoes',
    icon: Ruler,
    title: 'Medições da Obra',
    description:
      'Medições contratuais, faturamento e acompanhamento da produção executada.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos da Obra',
    description:
      'Documentos vinculados à obra com controle de vencimentos, responsáveis e status.',
  },
  {
    path: 'riscos',
    icon: AlertTriangle,
    title: 'Riscos da Obra',
    description:
      'Matriz de riscos e oportunidades identificados ao longo da execução da obra.',
  },
];

const funcionarioDetailTabs: PlaceholderTabConfig[] = [
  {
    path: 'contrato',
    icon: FileSignature,
    title: 'Contrato',
    description:
      'Dados contratuais do funcionário com tipo, vigência, cláusulas e aditivos.',
  },
  {
    path: 'historico-salarial',
    icon: DollarSign,
    title: 'Histórico Salarial',
    description:
      'Histórico de reajustes, promoções e alterações salariais por vigência.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos',
    description:
      'ASOs, certificados, contratos, identificações e demais documentos do colaborador.',
  },
  {
    path: 'alocacoes',
    icon: Building2,
    title: 'Alocações',
    description:
      'Histórico de alocações por obra, função e centro de custo do funcionário.',
  },
  {
    path: 'ferias',
    icon: Palmtree,
    title: 'Férias',
    description:
      'Períodos aquisitivos, programação, saldo e histórico de gozo de férias.',
  },
  {
    path: 'decimo-terceiro',
    icon: Gift,
    title: '13º Salário',
    description:
      'Cálculo, provisão e histórico de pagamentos do décimo terceiro salário.',
  },
  {
    path: 'provisoes',
    icon: Wallet,
    title: 'Provisões',
    description:
      'Provisões trabalhistas de férias, 13º, FGTS e rescisão do colaborador.',
  },
  {
    path: 'horas-extras',
    icon: Clock,
    title: 'Horas Extras',
    description:
      'Lançamentos, aprovação, banco de horas e reflexos de horas extras.',
  },
  {
    path: 'fopag',
    icon: Receipt,
    title: 'FOPAG',
    description:
      'Participação do funcionário na folha por competência e eventos consolidados.',
  },
];

const obraImplementedTabs = new Set([
  'cronograma',
  'equipe',
  'compras',
  'financeiro',
  'documentos',
]);

const funcionarioImplementedTabs = new Set([
  'contrato',
  'historico-salarial',
  'documentos',
  'alocacoes',
  'ferias',
  'decimo-terceiro',
  'provisoes',
  'horas-extras',
  'fopag',
]);

function createPlaceholderRoutes(
  tabs: PlaceholderTabConfig[],
  implementedTabs: Set<string>,
  renderPlaceholder: (tab: PlaceholderTabConfig) => ReactElement,
): RouteObject[] {
  return tabs
    .filter(({ path }) => !implementedTabs.has(path))
    .map((tab) => ({
      path: tab.path,
      element: renderPlaceholder(tab),
    }));
}

const obraPlaceholderRoutes = createPlaceholderRoutes(
  obraWorkspaceTabs,
  obraImplementedTabs,
  (tab) => (
    <ObraTabPlaceholder
      icon={tab.icon}
      title={tab.title}
      description={tab.description}
    />
  ),
);

const funcionarioPlaceholderRoutes = createPlaceholderRoutes(
  funcionarioDetailTabs,
  funcionarioImplementedTabs,
  (tab) => (
    <FuncionarioTabPlaceholder
      icon={tab.icon}
      title={tab.title}
      description={tab.description}
    />
  ),
);

const appRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <ModuleLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: '/obras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <ObrasListPage /> },
      {
        path: ':obraId',
        element: <ObraWorkspaceLayout />,
        children: [
          { index: true, element: <ObraVisaoGeralPage /> },
          { path: 'cronograma', element: <ObraCronogramaPage /> },
          { path: 'equipe', element: <ObraEquipePage /> },
          { path: 'compras', element: <ObraComprasPage /> },
          { path: 'financeiro', element: <ObraFinanceiroPage /> },
          { path: 'documentos', element: <ObraDocumentosPage /> },
          ...obraPlaceholderRoutes,
        ],
      },
    ],
  },
  {
    path: '/rh',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Navigate to="/rh/funcionarios" replace /> },
      { path: 'funcionarios', element: <FuncionariosListPage /> },
      {
        path: 'funcionarios/:funcId',
        element: <FuncionarioDetailPage />,
        children: [
          { index: true, element: <Navigate to="contrato" replace /> },
          { path: 'contrato', element: <FuncionarioContratoPage /> },
          { path: 'historico-salarial', element: <FuncionarioHistoricoSalarialPage /> },
          { path: 'documentos', element: <FuncionarioDocumentosPage /> },
          { path: 'alocacoes', element: <FuncionarioAlocacoesPage /> },
          { path: 'ferias', element: <FuncionarioFeriasPage /> },
          { path: 'decimo-terceiro', element: <FuncionarioDecimoTerceiroPage /> },
          { path: 'provisoes', element: <FuncionarioProvisoesPage /> },
          { path: 'horas-extras', element: <FuncionarioHorasExtrasPage /> },
          { path: 'fopag', element: <FuncionarioFopagPage /> },
          ...funcionarioPlaceholderRoutes,
        ],
      },
    ],
  },
  {
    path: '/horas-extras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <HorasExtrasDashboardPage /> },
      { path: 'fechamento', element: <HorasExtrasFechamentoPage /> },
      { path: 'aprovacao', element: <HorasExtrasAprovacaoPage /> },
    ],
  },
  {
    path: '/fopag',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FopagListPage /> },
      {
        path: ':competenciaId',
        element: <FopagCompetenciaDetailPage />,
        children: [
          { index: true, element: <FopagCompetenciaOverviewPage /> },
          { path: 'funcionarios', element: <FopagCompetenciaFuncionariosPage /> },
          { path: 'obras', element: <FopagCompetenciaObrasPage /> },
          { path: 'eventos', element: <FopagCompetenciaEventosPage /> },
          { path: 'rateio', element: <FopagCompetenciaRateioPage /> },
          { path: 'financeiro', element: <FopagCompetenciaFinanceiroPage /> },
          { path: 'previsto-realizado', element: <FopagCompetenciaPrevistoRealizadoPage /> },
        ],
      },
    ],
  },
  {
    path: '/compras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <ComprasListPage /> },
      { path: 'solicitacoes', element: <ComprasSolicitacoesPage /> },
      { path: 'cotacoes', element: <ComprasCotacoesPage /> },
      { path: 'pedidos', element: <ComprasPedidosPage /> },
      { path: 'pedidos/:pedidoId', element: <PedidoCompraDetailPage /> },
    ],
  },
  {
    path: '/fiscal',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FiscalListPage /> },
      { path: 'entradas', element: <FiscalEntradasPage /> },
      { path: 'saidas', element: <FiscalSaidasPage /> },
      { path: 'documentos/:documentoId', element: <DocumentoFiscalDetailPage /> },
    ],
  },
  {
    path: '/financeiro',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FinanceiroListPage /> },
      { path: 'fluxo', element: <FluxoCaixaPage /> },
      { path: 'contas-pagar', element: <ContasPagarPage /> },
      { path: 'contas-receber', element: <ContasReceberPage /> },
      { path: 'titulos/:tituloId', element: <TituloFinanceiroDetailPage /> },
    ],
  },
  {
    path: '/estoque',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <EstoqueListPage /> },
      { path: 'movimentacoes', element: <EstoqueMovimentacoesPage /> },
      { path: 'itens/:itemId', element: <EstoqueItemDetailPage /> },
    ],
  },
  {
    path: '/medicoes',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <MedicoesListPage /> },
      { path: ':medicaoId', element: <MedicaoDetailPage /> },
    ],
  },
  {
    path: '/documentos',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <DocumentosListPage /> },
      { path: ':documentoId', element: <DocumentoDetailPage /> },
    ],
  },
  {
    path: '/relatorios',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <RelatoriosListPage /> },
      { path: ':categoria', element: <RelatorioCategoriaPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <AdminPage /> },
      { path: 'usuarios', element: <AdminUsuariosPage /> },
      { path: 'perfis', element: <AdminPerfisPage /> },
      { path: 'permissoes', element: <AdminPermissoesPage /> },
      { path: 'parametros', element: <AdminParametrosPage /> },
      { path: 'logs', element: <AdminLogsPage /> },
      { path: 'integracoes', element: <AdminIntegracoesPage /> },
    ],
  },
  {
    path: '/perfil',
    element: <ModuleLayout />,
    children: [{ index: true, element: <PerfilPage /> }],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <div className="text-center text-sm text-gray-500">
            Tela de login — em desenvolvimento
          </div>
        ),
      },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: appRoutes,
      },
    ],
  },
]);
