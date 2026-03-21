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
import {
  AdminIntegracoesPage,
  AdminLogsPage,
  AdminPage,
  AdminParametrosPage,
  AdminPerfisPage,
  AdminPermissoesPage,
  AdminUsuariosPage,
} from '@/modules/admin';
import { DashboardPage } from '@/modules/dashboard';
import {
  ComprasCotacoesPage,
  ComprasListPage,
  ComprasPedidosPage,
  ComprasSolicitacoesPage,
  PedidoCompraDetailPage,
} from '@/modules/compras';
import { DocumentoDetailPage, DocumentosListPage } from '@/modules/documentos';
import { EstoqueItemDetailPage, EstoqueListPage, EstoqueMovimentacoesPage } from '@/modules/estoque';
import { FinanceiroListPage } from '@/modules/financeiro';
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
import { ObrasListPage, ObraVisaoGeralPage } from '@/modules/obras';
import { ObraTabPlaceholder } from '@/modules/obras/components/ObraTabPlaceholder';
import { PerfilPage } from '@/modules/perfil';
import { RelatorioCategoriaPage, RelatoriosListPage } from '@/modules/relatorios';
import { FuncionarioDetailPage, FuncionariosListPage } from '@/modules/rh';
import { FuncionarioTabPlaceholder } from '@/modules/rh/components/FuncionarioTabPlaceholder';
import { NotFoundPage } from '@/shared/components';

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
    description: 'Cronograma físico-financeiro da obra com etapas, marcos e % de avanço.',
  },
  {
    path: 'contratos',
    icon: FileSignature,
    title: 'Contratos',
    description: 'Contratos da obra com clientes e fornecedores, aditivos e medições.',
  },
  {
    path: 'equipe',
    icon: UsersRound,
    title: 'Equipe',
    description: 'Equipe alocada na obra com cargos, funções e período de atuação.',
  },
  {
    path: 'rh',
    icon: Users,
    title: 'RH da Obra',
    description: 'Dados de RH dos funcionários alocados nesta obra.',
  },
  {
    path: 'compras',
    icon: ShoppingCart,
    title: 'Compras da Obra',
    description: 'Solicitações e pedidos de compra vinculados a esta obra.',
  },
  {
    path: 'financeiro',
    icon: DollarSign,
    title: 'Financeiro da Obra',
    description: 'Visão financeira da obra: títulos, previsão de desembolso e custos.',
  },
  {
    path: 'estoque',
    icon: Package,
    title: 'Estoque da Obra',
    description: 'Movimentações de estoque e saldos de materiais desta obra.',
  },
  {
    path: 'medicoes',
    icon: Ruler,
    title: 'Medições da Obra',
    description: 'Medições contratuais e faturamento vinculado à obra.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos da Obra',
    description: 'Documentos vinculados à obra com controle de vencimentos.',
  },
  {
    path: 'riscos',
    icon: AlertTriangle,
    title: 'Riscos da Obra',
    description: 'Matriz de riscos e oportunidades identificados para a obra.',
  },
];

const funcionarioTabs: PlaceholderTabConfig[] = [
  {
    path: 'contrato',
    icon: FileSignature,
    title: 'Contrato',
    description: 'Dados contratuais do funcionário: tipo, vigência, cláusulas e aditivos.',
  },
  {
    path: 'historico-salarial',
    icon: DollarSign,
    title: 'Histórico Salarial',
    description: 'Histórico de reajustes, promoções e alterações salariais.',
  },
  {
    path: 'documentos',
    icon: FolderOpen,
    title: 'Documentos',
    description: 'Documentos do funcionário: ASOs, certificados, contratos e comprovantes.',
  },
  {
    path: 'alocacoes',
    icon: Building2,
    title: 'Alocações',
    description: 'Histórico de alocações por obra e centro de custo.',
  },
  {
    path: 'ferias',
    icon: Palmtree,
    title: 'Férias',
    description: 'Períodos aquisitivos, programação e histórico de férias.',
  },
  {
    path: 'decimo-terceiro',
    icon: Gift,
    title: '13º Salário',
    description: 'Cálculo e histórico de pagamentos do 13º salário.',
  },
  {
    path: 'provisoes',
    icon: Wallet,
    title: 'Provisões',
    description: 'Provisões trabalhistas: férias, 13º, FGTS, rescisão.',
  },
  {
    path: 'horas-extras',
    icon: Clock,
    title: 'Horas Extras',
    description: 'Lançamentos de horas extras e banco de horas do funcionário.',
  },
  {
    path: 'fopag',
    icon: Receipt,
    title: 'FOPAG',
    description: 'Participação do funcionário na folha de pagamento por competência.',
  },
];

function createObraPlaceholderRoute(tab: PlaceholderTabConfig) {
  return {
    path: tab.path,
    element: (
      <ObraTabPlaceholder icon={tab.icon} title={tab.title} description={tab.description} />
    ),
  };
}

function createFuncionarioPlaceholderRoute(tab: PlaceholderTabConfig) {
  return {
    path: tab.path,
    element: (
      <FuncionarioTabPlaceholder
        icon={tab.icon}
        title={tab.title}
        description={tab.description}
      />
    ),
  };
}

const appRoutes = [
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
          ...obraWorkspaceTabs.map(createObraPlaceholderRoute),
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
        children: funcionarioTabs.map(createFuncionarioPlaceholderRoute),
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
          {
            path: 'previsto-realizado',
            element: <FopagCompetenciaPrevistoRealizadoPage />,
          },
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
    children: [{ index: true, element: <FinanceiroListPage /> }],
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
