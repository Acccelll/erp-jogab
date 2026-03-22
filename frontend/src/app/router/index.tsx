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
import * as AdminModule from '@/modules/admin';
import * as DashboardModule from '@/modules/dashboard';
import * as ComprasModule from '@/modules/compras';
import * as DocumentosModule from '@/modules/documentos';
import * as EstoqueModule from '@/modules/estoque';
import * as FinanceiroModule from '@/modules/financeiro';
import * as FiscalModule from '@/modules/fiscal';
import * as FopagModule from '@/modules/fopag';
import * as HorasExtrasModule from '@/modules/horas-extras';
import * as MedicoesModule from '@/modules/medicoes';
import * as ObrasModule from '@/modules/obras';
import * as ObrasComponents from '@/modules/obras/components';
import { PerfilPage } from '@/modules/perfil';
import * as RelatoriosModule from '@/modules/relatorios';
import * as RhModule from '@/modules/rh';
import * as RhComponents from '@/modules/rh/components';
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
      <ObrasComponents.ObraTabPlaceholder
        icon={tab.icon}
        title={tab.title}
        description={tab.description}
      />
    ),
  };
}

function createFuncionarioPlaceholderRoute(tab: PlaceholderTabConfig) {
  return {
    path: tab.path,
    element: (
      <RhComponents.FuncionarioTabPlaceholder
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
    children: [{ index: true, element: <DashboardModule.DashboardPage /> }],
  },
  {
    path: '/obras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <ObrasModule.ObrasListPage /> },
      {
        path: ':obraId',
        element: <ObraWorkspaceLayout />,
        children: [
          { index: true, element: <ObrasModule.ObraVisaoGeralPage /> },
          { path: 'cronograma', element: <ObrasModule.ObraCronogramaPage /> },
          { path: 'equipe', element: <ObrasModule.ObraEquipePage /> },
          { path: 'compras', element: <ObrasModule.ObraComprasPage /> },
          { path: 'financeiro', element: <ObrasModule.ObraFinanceiroPage /> },
          { path: 'documentos', element: <ObrasModule.ObraDocumentosPage /> },
          ...obraWorkspaceTabs
            .filter((tab) => !['cronograma', 'equipe', 'compras', 'financeiro', 'documentos'].includes(tab.path))
            .map(createObraPlaceholderRoute),
        ],
      },
    ],
  },
  {
    path: '/rh',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <Navigate to="/rh/funcionarios" replace /> },
      { path: 'funcionarios', element: <RhModule.FuncionariosListPage /> },
      {
        path: 'funcionarios/:funcId',
        element: <RhModule.FuncionarioDetailPage />,
        children: funcionarioTabs.map(createFuncionarioPlaceholderRoute),
      },
    ],
  },
  {
    path: '/horas-extras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <HorasExtrasModule.HorasExtrasDashboardPage /> },
      { path: 'fechamento', element: <HorasExtrasModule.HorasExtrasFechamentoPage /> },
      { path: 'aprovacao', element: <HorasExtrasModule.HorasExtrasAprovacaoPage /> },
    ],
  },
  {
    path: '/fopag',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FopagModule.FopagListPage /> },
      {
        path: ':competenciaId',
        element: <FopagModule.FopagCompetenciaDetailPage />,
        children: [
          { index: true, element: <FopagModule.FopagCompetenciaOverviewPage /> },
          { path: 'funcionarios', element: <FopagModule.FopagCompetenciaFuncionariosPage /> },
          { path: 'obras', element: <FopagModule.FopagCompetenciaObrasPage /> },
          { path: 'eventos', element: <FopagModule.FopagCompetenciaEventosPage /> },
          { path: 'rateio', element: <FopagModule.FopagCompetenciaRateioPage /> },
          { path: 'financeiro', element: <FopagModule.FopagCompetenciaFinanceiroPage /> },
          {
            path: 'previsto-realizado',
            element: <FopagModule.FopagCompetenciaPrevistoRealizadoPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/compras',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <ComprasModule.ComprasListPage /> },
      { path: 'solicitacoes', element: <ComprasModule.ComprasSolicitacoesPage /> },
      { path: 'cotacoes', element: <ComprasModule.ComprasCotacoesPage /> },
      { path: 'pedidos', element: <ComprasModule.ComprasPedidosPage /> },
      { path: 'pedidos/:pedidoId', element: <ComprasModule.PedidoCompraDetailPage /> },
    ],
  },
  {
    path: '/fiscal',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FiscalModule.FiscalListPage /> },
      { path: 'entradas', element: <FiscalModule.FiscalEntradasPage /> },
      { path: 'saidas', element: <FiscalModule.FiscalSaidasPage /> },
      { path: 'documentos/:documentoId', element: <FiscalModule.DocumentoFiscalDetailPage /> },
    ],
  },
  {
    path: '/financeiro',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <FinanceiroModule.FinanceiroListPage /> },
      { path: 'fluxo', element: <FinanceiroModule.FluxoCaixaPage /> },
      { path: 'contas-pagar', element: <FinanceiroModule.ContasPagarPage /> },
      { path: 'contas-receber', element: <FinanceiroModule.ContasReceberPage /> },
      { path: 'titulos/:tituloId', element: <FinanceiroModule.TituloFinanceiroDetailPage /> },
    ],
  },
  {
    path: '/estoque',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <EstoqueModule.EstoqueListPage /> },
      { path: 'movimentacoes', element: <EstoqueModule.EstoqueMovimentacoesPage /> },
      { path: 'itens/:itemId', element: <EstoqueModule.EstoqueItemDetailPage /> },
    ],
  },
  {
    path: '/medicoes',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <MedicoesModule.MedicoesListPage /> },
      { path: ':medicaoId', element: <MedicoesModule.MedicaoDetailPage /> },
    ],
  },
  {
    path: '/documentos',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <DocumentosModule.DocumentosListPage /> },
      { path: ':documentoId', element: <DocumentosModule.DocumentoDetailPage /> },
    ],
  },
  {
    path: '/relatorios',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <RelatoriosModule.RelatoriosListPage /> },
      { path: ':categoria', element: <RelatoriosModule.RelatorioCategoriaPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ModuleLayout />,
    children: [
      { index: true, element: <AdminModule.AdminPage /> },
      { path: 'usuarios', element: <AdminModule.AdminUsuariosPage /> },
      { path: 'perfis', element: <AdminModule.AdminPerfisPage /> },
      { path: 'permissoes', element: <AdminModule.AdminPermissoesPage /> },
      { path: 'parametros', element: <AdminModule.AdminParametrosPage /> },
      { path: 'logs', element: <AdminModule.AdminLogsPage /> },
      { path: 'integracoes', element: <AdminModule.AdminIntegracoesPage /> },
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
