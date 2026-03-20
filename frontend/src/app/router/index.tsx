import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ModuleLayout } from '@/app/layouts/ModuleLayout';
import { ObraWorkspaceLayout } from '@/app/layouts/ObraWorkspaceLayout';
import { AuthGuard } from '@/app/guards';
import { NotFoundPage } from '@/shared/components';

// Module pages (lazy loading será adicionado em fases futuras)
import { DashboardPage } from '@/modules/dashboard';
import { ObrasListPage, ObraVisaoGeralPage } from '@/modules/obras';
import { FuncionariosListPage, FuncionarioDetailPage } from '@/modules/rh';
import {
  HorasExtrasDashboardPage,
  HorasExtrasFechamentoPage,
  HorasExtrasAprovacaoPage,
} from '@/modules/horas-extras';
import {
  FopagListPage,
  FopagCompetenciaDetailPage,
  FopagCompetenciaOverviewPage,
  FopagCompetenciaFuncionariosPage,
  FopagCompetenciaObrasPage,
  FopagCompetenciaEventosPage,
  FopagCompetenciaRateioPage,
  FopagCompetenciaFinanceiroPage,
  FopagCompetenciaPrevistoRealizadoPage,
} from '@/modules/fopag';
import {
  ComprasListPage,
  ComprasSolicitacoesPage,
  ComprasCotacoesPage,
  ComprasPedidosPage,
  PedidoCompraDetailPage,
} from '@/modules/compras';
import { FiscalListPage, FiscalEntradasPage, FiscalSaidasPage, DocumentoFiscalDetailPage } from '@/modules/fiscal';
import { FinanceiroListPage } from '@/modules/financeiro';
import { EstoqueListPage } from '@/modules/estoque';
import { MedicoesListPage } from '@/modules/medicoes';
import { DocumentosListPage } from '@/modules/documentos';
import { RelatoriosListPage } from '@/modules/relatorios';
import { AdminPage } from '@/modules/admin';
import { PerfilPage } from '@/modules/perfil';

// Obra workspace sub-tab placeholder
import { ObraTabPlaceholder } from '@/modules/obras/components/ObraTabPlaceholder';
// Funcionário detail sub-tab placeholder
import { FuncionarioTabPlaceholder } from '@/modules/rh/components/FuncionarioTabPlaceholder';
import {
  CalendarDays,
  FileSignature,
  UsersRound,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Ruler,
  FolderOpen,
  AlertTriangle,
  Palmtree,
  Gift,
  Wallet,
  Clock,
  Receipt,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Configuração das abas do workspace da obra (11 abas conforme docs/06) */
const obraTabPlaceholders: { path: string; icon: LucideIcon; title: string; description: string }[] = [
  { path: 'cronograma', icon: CalendarDays, title: 'Cronograma', description: 'Cronograma físico-financeiro da obra com etapas, marcos e % de avanço.' },
  { path: 'contratos', icon: FileSignature, title: 'Contratos', description: 'Contratos da obra com clientes e fornecedores, aditivos e medições.' },
  { path: 'equipe', icon: UsersRound, title: 'Equipe', description: 'Equipe alocada na obra com cargos, funções e período de atuação.' },
  { path: 'rh', icon: Users, title: 'RH da Obra', description: 'Dados de RH dos funcionários alocados nesta obra.' },
  { path: 'compras', icon: ShoppingCart, title: 'Compras da Obra', description: 'Solicitações e pedidos de compra vinculados a esta obra.' },
  { path: 'financeiro', icon: DollarSign, title: 'Financeiro da Obra', description: 'Visão financeira da obra: títulos, previsão de desembolso e custos.' },
  { path: 'estoque', icon: Package, title: 'Estoque da Obra', description: 'Movimentações de estoque e saldos de materiais desta obra.' },
  { path: 'medicoes', icon: Ruler, title: 'Medições da Obra', description: 'Medições contratuais e faturamento vinculado à obra.' },
  { path: 'documentos', icon: FolderOpen, title: 'Documentos da Obra', description: 'Documentos vinculados à obra com controle de vencimentos.' },
  { path: 'riscos', icon: AlertTriangle, title: 'Riscos da Obra', description: 'Matriz de riscos e oportunidades identificados para a obra.' },
];

/** Configuração das abas do detalhe do funcionário (9 abas placeholder + visão geral) */
const funcionarioTabPlaceholders: { path: string; icon: LucideIcon; title: string; description: string }[] = [
  { path: 'contrato', icon: FileSignature, title: 'Contrato', description: 'Dados contratuais do funcionário: tipo, vigência, cláusulas e aditivos.' },
  { path: 'historico-salarial', icon: DollarSign, title: 'Histórico Salarial', description: 'Histórico de reajustes, promoções e alterações salariais.' },
  { path: 'documentos', icon: FolderOpen, title: 'Documentos', description: 'Documentos do funcionário: ASOs, certificados, contratos e comprovantes.' },
  { path: 'alocacoes', icon: Building2, title: 'Alocações', description: 'Histórico de alocações por obra e centro de custo.' },
  { path: 'ferias', icon: Palmtree, title: 'Férias', description: 'Períodos aquisitivos, programação e histórico de férias.' },
  { path: 'decimo-terceiro', icon: Gift, title: '13º Salário', description: 'Cálculo e histórico de pagamentos do 13º salário.' },
  { path: 'provisoes', icon: Wallet, title: 'Provisões', description: 'Provisões trabalhistas: férias, 13º, FGTS, rescisão.' },
  { path: 'horas-extras', icon: Clock, title: 'Horas Extras', description: 'Lançamentos de horas extras e banco de horas do funcionário.' },
  { path: 'fopag', icon: Receipt, title: 'FOPAG', description: 'Participação do funcionário na folha de pagamento por competência.' },
];

export const router = createBrowserRouter([
  // Auth routes (públicas)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <div className="text-center text-sm text-gray-500">Tela de login — em desenvolvimento</div>,
      },
    ],
  },

  // App routes (protegidas por AuthGuard)
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Redirect root to dashboard
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },

          // Dashboard
          {
            path: '/dashboard',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
            ],
          },

          // Obras
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
                  ...obraTabPlaceholders.map((tab) => ({
                    path: tab.path,
                    element: <ObraTabPlaceholder icon={tab.icon} title={tab.title} description={tab.description} />,
                  })),
                ],
              },
            ],
          },

          // RH
          {
            path: '/rh',
            element: <ModuleLayout />,
            children: [
              { path: 'funcionarios', element: <FuncionariosListPage /> },
              {
                path: 'funcionarios/:funcId',
                element: <FuncionarioDetailPage />,
                children: [
                  ...funcionarioTabPlaceholders.map((tab) => ({
                    path: tab.path,
                    element: <FuncionarioTabPlaceholder icon={tab.icon} title={tab.title} description={tab.description} />,
                  })),
                ],
              },
              { index: true, element: <Navigate to="/rh/funcionarios" replace /> },
            ],
          },

          // Horas Extras
          {
            path: '/horas-extras',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <HorasExtrasDashboardPage /> },
              { path: 'fechamento', element: <HorasExtrasFechamentoPage /> },
              { path: 'aprovacao', element: <HorasExtrasAprovacaoPage /> },
            ],
          },

          // FOPAG
          {
            path: '/fopag',
            element: <ModuleLayout />,
            children: [
              {
                index: true,
                element: <FopagListPage />,
              },
              {
                path: ':competenciaId',
                element: <FopagCompetenciaDetailPage />,
                children: [
                  {
                    index: true,
                    element: <FopagCompetenciaOverviewPage />,
                  },
                  {
                    path: 'funcionarios',
                    element: <FopagCompetenciaFuncionariosPage />,
                  },
                  {
                    path: 'obras',
                    element: <FopagCompetenciaObrasPage />,
                  },
                  {
                    path: 'eventos',
                    element: <FopagCompetenciaEventosPage />,
                  },
                  {
                    path: 'rateio',
                    element: <FopagCompetenciaRateioPage />,
                  },
                  {
                    path: 'financeiro',
                    element: <FopagCompetenciaFinanceiroPage />,
                  },
                  {
                    path: 'previsto-realizado',
                    element: <FopagCompetenciaPrevistoRealizadoPage />,
                  },
                ],
              },
            ],
          },

          // Compras
          {
            path: '/compras',
            element: <ModuleLayout />,
            children: [
              // /compras
              {
                index: true,
                element: <ComprasListPage />,
              },
              // /compras/solicitacoes
              {
                path: 'solicitacoes',
                element: <ComprasSolicitacoesPage />,
              },
              // /compras/cotacoes
              {
                path: 'cotacoes',
                element: <ComprasCotacoesPage />,
              },
              // /compras/pedidos
              {
                path: 'pedidos',
                element: <ComprasPedidosPage />,
              },
              // /compras/pedidos/:pedidoId
              {
                path: 'pedidos/:pedidoId',
                element: <PedidoCompraDetailPage />,
              },
            ],
          },

          // Fiscal
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

          // Financeiro
          {
            path: '/financeiro',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <FinanceiroListPage /> },
            ],
          },

          // Estoque
          {
            path: '/estoque',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <EstoqueListPage /> },
            ],
          },

          // Medições e Faturamento
          {
            path: '/medicoes',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <MedicoesListPage /> },
            ],
          },

          // Documentos
          {
            path: '/documentos',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <DocumentosListPage /> },
            ],
          },

          // Relatórios
          {
            path: '/relatorios',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <RelatoriosListPage /> },
            ],
          },

          // Administração
          {
            path: '/admin',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <AdminPage /> },
            ],
          },

          // Perfil
          {
            path: '/perfil',
            element: <ModuleLayout />,
            children: [
              { index: true, element: <PerfilPage /> },
            ],
          },

          // 404 — Catch-all
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
