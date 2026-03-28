import { lazy, type ReactElement } from 'react';
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
import { ObraTabPlaceholder } from '@/modules/obras/components';
import { LoginPage } from '@/app/pages/LoginPage';
import { FuncionarioTabPlaceholder } from '@/modules/rh/components';
import { NotFoundPage } from '@/shared/components';
import { Lazy } from './PageLoader';

// ── Lazy-loaded module pages ───────────────────────────────────────────────
// Admin
const AdminPage = lazy(() => import('@/modules/admin').then((m) => ({ default: m.AdminPage })));
const AdminUsuariosPage = lazy(() => import('@/modules/admin').then((m) => ({ default: m.AdminUsuariosPage })));
const AdminPerfisPage = lazy(() => import('@/modules/admin').then((m) => ({ default: m.AdminPerfisPage })));
const AdminPermissoesPage = lazy(() =>
  import('@/modules/admin').then((m) => ({ default: m.AdminPermissoesPage })),
);
const AdminParametrosPage = lazy(() =>
  import('@/modules/admin').then((m) => ({ default: m.AdminParametrosPage })),
);
const AdminLogsPage = lazy(() => import('@/modules/admin').then((m) => ({ default: m.AdminLogsPage })));
const AdminIntegracoesPage = lazy(() =>
  import('@/modules/admin').then((m) => ({ default: m.AdminIntegracoesPage })),
);

// Compras
const ComprasListPage = lazy(() => import('@/modules/compras').then((m) => ({ default: m.ComprasListPage })));
const ComprasSolicitacoesPage = lazy(() =>
  import('@/modules/compras').then((m) => ({ default: m.ComprasSolicitacoesPage })),
);
const ComprasCotacoesPage = lazy(() =>
  import('@/modules/compras').then((m) => ({ default: m.ComprasCotacoesPage })),
);
const ComprasPedidosPage = lazy(() =>
  import('@/modules/compras').then((m) => ({ default: m.ComprasPedidosPage })),
);
const PedidoCompraDetailPage = lazy(() =>
  import('@/modules/compras').then((m) => ({ default: m.PedidoCompraDetailPage })),
);

// Dashboard
const DashboardPage = lazy(() => import('@/modules/dashboard').then((m) => ({ default: m.DashboardPage })));

// Documentos
const DocumentosListPage = lazy(() =>
  import('@/modules/documentos').then((m) => ({ default: m.DocumentosListPage })),
);
const DocumentoDetailPage = lazy(() =>
  import('@/modules/documentos').then((m) => ({ default: m.DocumentoDetailPage })),
);

// Estoque
const EstoqueListPage = lazy(() => import('@/modules/estoque').then((m) => ({ default: m.EstoqueListPage })));
const EstoqueMovimentacoesPage = lazy(() =>
  import('@/modules/estoque').then((m) => ({ default: m.EstoqueMovimentacoesPage })),
);
const EstoqueItemDetailPage = lazy(() =>
  import('@/modules/estoque').then((m) => ({ default: m.EstoqueItemDetailPage })),
);

// Financeiro
const FinanceiroListPage = lazy(() =>
  import('@/modules/financeiro').then((m) => ({ default: m.FinanceiroListPage })),
);
const FluxoCaixaPage = lazy(() => import('@/modules/financeiro').then((m) => ({ default: m.FluxoCaixaPage })));
const ContasPagarPage = lazy(() =>
  import('@/modules/financeiro').then((m) => ({ default: m.ContasPagarPage })),
);
const ContasReceberPage = lazy(() =>
  import('@/modules/financeiro').then((m) => ({ default: m.ContasReceberPage })),
);
const TituloFinanceiroDetailPage = lazy(() =>
  import('@/modules/financeiro').then((m) => ({ default: m.TituloFinanceiroDetailPage })),
);

// Fiscal
const FiscalListPage = lazy(() => import('@/modules/fiscal').then((m) => ({ default: m.FiscalListPage })));
const FiscalEntradasPage = lazy(() =>
  import('@/modules/fiscal').then((m) => ({ default: m.FiscalEntradasPage })),
);
const FiscalSaidasPage = lazy(() => import('@/modules/fiscal').then((m) => ({ default: m.FiscalSaidasPage })));
const DocumentoFiscalDetailPage = lazy(() =>
  import('@/modules/fiscal').then((m) => ({ default: m.DocumentoFiscalDetailPage })),
);

// FOPAG
const FopagListPage = lazy(() => import('@/modules/fopag').then((m) => ({ default: m.FopagListPage })));
const FopagCompetenciaDetailPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaDetailPage })),
);
const FopagCompetenciaOverviewPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaOverviewPage })),
);
const FopagCompetenciaFuncionariosPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaFuncionariosPage })),
);
const FopagCompetenciaObrasPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaObrasPage })),
);
const FopagCompetenciaEventosPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaEventosPage })),
);
const FopagCompetenciaRateioPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaRateioPage })),
);
const FopagCompetenciaFinanceiroPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaFinanceiroPage })),
);
const FopagCompetenciaPrevistoRealizadoPage = lazy(() =>
  import('@/modules/fopag').then((m) => ({ default: m.FopagCompetenciaPrevistoRealizadoPage })),
);

// Horas Extras
const HorasExtrasDashboardPage = lazy(() =>
  import('@/modules/horas-extras').then((m) => ({ default: m.HorasExtrasDashboardPage })),
);
const HorasExtrasLancamentosPage = lazy(() =>
  import('@/modules/horas-extras').then((m) => ({ default: m.HorasExtrasLancamentosPage })),
);
const HorasExtrasFechamentoPage = lazy(() =>
  import('@/modules/horas-extras').then((m) => ({ default: m.HorasExtrasFechamentoPage })),
);
const HorasExtrasAprovacaoPage = lazy(() =>
  import('@/modules/horas-extras').then((m) => ({ default: m.HorasExtrasAprovacaoPage })),
);
const HorasExtrasDetailPage = lazy(() =>
  import('@/modules/horas-extras').then((m) => ({ default: m.HorasExtrasDetailPage })),
);

// Medições
const MedicoesListPage = lazy(() =>
  import('@/modules/medicoes').then((m) => ({ default: m.MedicoesListPage })),
);
const MedicaoDetailPage = lazy(() =>
  import('@/modules/medicoes').then((m) => ({ default: m.MedicaoDetailPage })),
);

// Obras
const ObrasListPage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObrasListPage })));
const ObraVisaoGeralPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraVisaoGeralPage })),
);
const ObraCronogramaPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraCronogramaPage })),
);
const ObraEquipePage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObraEquipePage })));
const ObraComprasPage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObraComprasPage })));
const ObraFinanceiroPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraFinanceiroPage })),
);
const ObraDocumentosPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraDocumentosPage })),
);
const ObraContratosPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraContratosPage })),
);
const ObraRhPage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObraRhPage })));
const ObraEstoquePage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObraEstoquePage })));
const ObraMedicoesPage = lazy(() =>
  import('@/modules/obras').then((m) => ({ default: m.ObraMedicoesPage })),
);
const ObraRiscosPage = lazy(() => import('@/modules/obras').then((m) => ({ default: m.ObraRiscosPage })));

// Perfil
const PerfilPage = lazy(() => import('@/modules/perfil').then((m) => ({ default: m.PerfilPage })));

// Relatórios
const RelatoriosListPage = lazy(() =>
  import('@/modules/relatorios').then((m) => ({ default: m.RelatoriosListPage })),
);
const RelatorioCategoriaPage = lazy(() =>
  import('@/modules/relatorios').then((m) => ({ default: m.RelatorioCategoriaPage })),
);

// RH
const FuncionariosListPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionariosListPage })),
);
const FuncionarioDetailPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioDetailPage })),
);
const FuncionarioVisaoGeralPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioVisaoGeralPage })),
);
const FuncionarioContratoPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioContratoPage })),
);
const FuncionarioHistoricoSalarialPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioHistoricoSalarialPage })),
);
const FuncionarioDocumentosPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioDocumentosPage })),
);
const FuncionarioAlocacoesPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioAlocacoesPage })),
);
const FuncionarioFeriasPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioFeriasPage })),
);
const FuncionarioDecimoTerceiroPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioDecimoTerceiroPage })),
);
const FuncionarioProvisoesPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioProvisoesPage })),
);
const FuncionarioHorasExtrasPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioHorasExtrasPage })),
);
const FuncionarioFopagPage = lazy(() =>
  import('@/modules/rh').then((m) => ({ default: m.FuncionarioFopagPage })),
);

// ── Placeholder tab configuration ────────────────────────────────────────
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
    description: 'Cronograma físico-financeiro da obra com etapas, marcos e percentual de avanço.',
  },
  {
    path: 'contratos',
    icon: FileSignature,
    title: 'Contratos',
    description: 'Contratos da obra com clientes e fornecedores, aditivos e medições vinculadas.',
  },
  {
    path: 'equipe',
    icon: UsersRound,
    title: 'Equipe',
    description: 'Equipe alocada na obra com cargos, funções, jornadas e período de atuação.',
  },
  {
    path: 'rh',
    icon: Users,
    title: 'RH da Obra',
    description: 'Dados de RH dos funcionários alocados na obra com vínculo de centro de custo.',
  },
  {
    path: 'compras',
    icon: ShoppingCart,
    title: 'Compras da Obra',
    description: 'Solicitações, cotações e pedidos de compra vinculados à execução da obra.',
  },
  {
    path: 'financeiro',
    icon: DollarSign,
    title: 'Financeiro da Obra',
    description: 'Visão financeira da obra com títulos, previsões de desembolso e custos realizados.',
  },
  {
    path: 'estoque',
    icon: Package,
    title: 'Estoque da Obra',
    description: 'Movimentações de estoque, consumo de materiais e saldos por obra.',
  },
  {
    path: 'medicoes',
    icon: Ruler,
    title: 'Medições da Obra',
    description: 'Medições contratuais, faturamento e acompanhamento da produção executada.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos da Obra',
    description: 'Documentos vinculados à obra com controle de vencimentos, responsáveis e status.',
  },
  {
    path: 'riscos',
    icon: AlertTriangle,
    title: 'Riscos da Obra',
    description: 'Matriz de riscos e oportunidades identificados ao longo da execução da obra.',
  },
];

const funcionarioDetailTabs: PlaceholderTabConfig[] = [
  {
    path: 'contrato',
    icon: FileSignature,
    title: 'Contrato',
    description: 'Dados contratuais do funcionário com tipo, vigência, cláusulas e aditivos.',
  },
  {
    path: 'historico-salarial',
    icon: DollarSign,
    title: 'Histórico Salarial',
    description: 'Histórico de reajustes, promoções e alterações salariais por vigência.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos',
    description: 'ASOs, certificados, contratos, identificações e demais documentos do colaborador.',
  },
  {
    path: 'alocacoes',
    icon: Building2,
    title: 'Alocações',
    description: 'Histórico de alocações por obra, função e centro de custo do funcionário.',
  },
  {
    path: 'ferias',
    icon: Palmtree,
    title: 'Férias',
    description: 'Períodos aquisitivos, programação, saldo e histórico de gozo de férias.',
  },
  {
    path: 'decimo-terceiro',
    icon: Gift,
    title: '13º Salário',
    description: 'Cálculo, provisão e histórico de pagamentos do décimo terceiro salário.',
  },
  {
    path: 'provisoes',
    icon: Wallet,
    title: 'Provisões',
    description: 'Provisões trabalhistas de férias, 13º, FGTS e rescisão do colaborador.',
  },
  {
    path: 'horas-extras',
    icon: Clock,
    title: 'Horas Extras',
    description: 'Lançamentos, aprovação, banco de horas e reflexos de horas extras.',
  },
  {
    path: 'fopag',
    icon: Receipt,
    title: 'FOPAG',
    description: 'Participação do funcionário na folha por competência e eventos consolidados.',
  },
];

const obraImplementedTabs = new Set([
  'cronograma',
  'equipe',
  'compras',
  'financeiro',
  'documentos',
  'contratos',
  'rh',
  'estoque',
  'medicoes',
  'riscos',
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

const obraPlaceholderRoutes = createPlaceholderRoutes(obraWorkspaceTabs, obraImplementedTabs, (tab) => (
  <ObraTabPlaceholder icon={tab.icon} title={tab.title} description={tab.description} />
));

const funcionarioPlaceholderRoutes = createPlaceholderRoutes(
  funcionarioDetailTabs,
  funcionarioImplementedTabs,
  (tab) => <FuncionarioTabPlaceholder icon={tab.icon} title={tab.title} description={tab.description} />,
);

// ── Route tree ────────────────────────────────────────────────────────────
const appRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <ModuleLayout />,
    children: [{ index: true, element: <Lazy><DashboardPage /></Lazy> }],
  },
  {
    path: '/obras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><ObrasListPage /></Lazy> },
      {
        path: ':obraId',
        element: <ObraWorkspaceLayout />,
        children: [
          { index: true, element: <Lazy><ObraVisaoGeralPage /></Lazy> },
          { path: 'cronograma', element: <Lazy><ObraCronogramaPage /></Lazy> },
          { path: 'equipe', element: <Lazy><ObraEquipePage /></Lazy> },
          { path: 'compras', element: <Lazy><ObraComprasPage /></Lazy> },
          { path: 'financeiro', element: <Lazy><ObraFinanceiroPage /></Lazy> },
          { path: 'documentos', element: <Lazy><ObraDocumentosPage /></Lazy> },
          { path: 'contratos', element: <Lazy><ObraContratosPage /></Lazy> },
          { path: 'rh', element: <Lazy><ObraRhPage /></Lazy> },
          { path: 'estoque', element: <Lazy><ObraEstoquePage /></Lazy> },
          { path: 'medicoes', element: <Lazy><ObraMedicoesPage /></Lazy> },
          { path: 'riscos', element: <Lazy><ObraRiscosPage /></Lazy> },
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
      { path: 'funcionarios', element: <Lazy><FuncionariosListPage /></Lazy> },
      {
        path: 'funcionarios/:funcId',
        element: <Lazy><FuncionarioDetailPage /></Lazy>,
        children: [
          { index: true, element: <Lazy><FuncionarioVisaoGeralPage /></Lazy> },
          { path: 'contrato', element: <Lazy><FuncionarioContratoPage /></Lazy> },
          {
            path: 'historico-salarial',
            element: <Lazy><FuncionarioHistoricoSalarialPage /></Lazy>,
          },
          { path: 'documentos', element: <Lazy><FuncionarioDocumentosPage /></Lazy> },
          { path: 'alocacoes', element: <Lazy><FuncionarioAlocacoesPage /></Lazy> },
          { path: 'ferias', element: <Lazy><FuncionarioFeriasPage /></Lazy> },
          {
            path: 'decimo-terceiro',
            element: <Lazy><FuncionarioDecimoTerceiroPage /></Lazy>,
          },
          { path: 'provisoes', element: <Lazy><FuncionarioProvisoesPage /></Lazy> },
          { path: 'horas-extras', element: <Lazy><FuncionarioHorasExtrasPage /></Lazy> },
          { path: 'fopag', element: <Lazy><FuncionarioFopagPage /></Lazy> },
          ...funcionarioPlaceholderRoutes,
        ],
      },
    ],
  },
  {
    path: '/horas-extras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><HorasExtrasDashboardPage /></Lazy> },
      { path: 'lancamentos', element: <Lazy><HorasExtrasLancamentosPage /></Lazy> },
      { path: 'fechamento', element: <Lazy><HorasExtrasFechamentoPage /></Lazy> },
      { path: 'aprovacao', element: <Lazy><HorasExtrasAprovacaoPage /></Lazy> },
      { path: ':lancamentoId', element: <Lazy><HorasExtrasDetailPage /></Lazy> },
    ],
  },
  {
    path: '/fopag',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><FopagListPage /></Lazy> },
      {
        path: ':competenciaId',
        element: <Lazy><FopagCompetenciaDetailPage /></Lazy>,
        children: [
          { index: true, element: <Lazy><FopagCompetenciaOverviewPage /></Lazy> },
          { path: 'funcionarios', element: <Lazy><FopagCompetenciaFuncionariosPage /></Lazy> },
          { path: 'obras', element: <Lazy><FopagCompetenciaObrasPage /></Lazy> },
          { path: 'eventos', element: <Lazy><FopagCompetenciaEventosPage /></Lazy> },
          { path: 'rateio', element: <Lazy><FopagCompetenciaRateioPage /></Lazy> },
          { path: 'financeiro', element: <Lazy><FopagCompetenciaFinanceiroPage /></Lazy> },
          {
            path: 'previsto-realizado',
            element: <Lazy><FopagCompetenciaPrevistoRealizadoPage /></Lazy>,
          },
        ],
      },
    ],
  },
  {
    path: '/compras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><ComprasListPage /></Lazy> },
      { path: 'solicitacoes', element: <Lazy><ComprasSolicitacoesPage /></Lazy> },
      { path: 'cotacoes', element: <Lazy><ComprasCotacoesPage /></Lazy> },
      { path: 'pedidos', element: <Lazy><ComprasPedidosPage /></Lazy> },
      { path: 'pedidos/:pedidoId', element: <Lazy><PedidoCompraDetailPage /></Lazy> },
    ],
  },
  {
    path: '/fiscal',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><FiscalListPage /></Lazy> },
      { path: 'entradas', element: <Lazy><FiscalEntradasPage /></Lazy> },
      { path: 'saidas', element: <Lazy><FiscalSaidasPage /></Lazy> },
      { path: 'documentos/:documentoId', element: <Lazy><DocumentoFiscalDetailPage /></Lazy> },
    ],
  },
  {
    path: '/financeiro',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><FinanceiroListPage /></Lazy> },
      { path: 'fluxo', element: <Lazy><FluxoCaixaPage /></Lazy> },
      { path: 'contas-pagar', element: <Lazy><ContasPagarPage /></Lazy> },
      { path: 'contas-receber', element: <Lazy><ContasReceberPage /></Lazy> },
      { path: 'titulos/:tituloId', element: <Lazy><TituloFinanceiroDetailPage /></Lazy> },
    ],
  },
  {
    path: '/estoque',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><EstoqueListPage /></Lazy> },
      { path: 'movimentacoes', element: <Lazy><EstoqueMovimentacoesPage /></Lazy> },
      { path: 'itens/:itemId', element: <Lazy><EstoqueItemDetailPage /></Lazy> },
    ],
  },
  {
    path: '/medicoes',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><MedicoesListPage /></Lazy> },
      { path: ':medicaoId', element: <Lazy><MedicaoDetailPage /></Lazy> },
    ],
  },
  {
    path: '/documentos',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><DocumentosListPage /></Lazy> },
      { path: ':documentoId', element: <Lazy><DocumentoDetailPage /></Lazy> },
    ],
  },
  {
    path: '/relatorios',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><RelatoriosListPage /></Lazy> },
      { path: ':categoria', element: <Lazy><RelatorioCategoriaPage /></Lazy> },
    ],
  },
  {
    path: '/admin',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Lazy><AdminPage /></Lazy> },
      { path: 'usuarios', element: <Lazy><AdminUsuariosPage /></Lazy> },
      { path: 'perfis', element: <Lazy><AdminPerfisPage /></Lazy> },
      { path: 'permissoes', element: <Lazy><AdminPermissoesPage /></Lazy> },
      { path: 'parametros', element: <Lazy><AdminParametrosPage /></Lazy> },
      { path: 'logs', element: <Lazy><AdminLogsPage /></Lazy> },
      { path: 'integracoes', element: <Lazy><AdminIntegracoesPage /></Lazy> },
    ],
  },
  {
    path: '/perfil',
    element: <ModuleLayout />,
    children: [{ index: true, element: <Lazy><PerfilPage /></Lazy> }],
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
        element: <LoginPage />,
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
