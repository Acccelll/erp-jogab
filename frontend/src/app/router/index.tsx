import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ModuleLayout } from '@/app/layouts/ModuleLayout';
import { ObraWorkspaceLayout } from '@/app/layouts/ObraWorkspaceLayout';

// Module pages (lazy loading será adicionado em fases futuras)
import { DashboardPage } from '@/modules/dashboard';
import { ObrasListPage, ObraVisaoGeralPage } from '@/modules/obras';
import { FuncionariosListPage } from '@/modules/rh';
import { HorasExtrasDashboardPage } from '@/modules/horas-extras';
import { FopagListPage } from '@/modules/fopag';
import { ComprasListPage } from '@/modules/compras';
import { FiscalListPage } from '@/modules/fiscal';
import { FinanceiroListPage } from '@/modules/financeiro';
import { EstoqueListPage } from '@/modules/estoque';
import { MedicoesListPage } from '@/modules/medicoes';
import { DocumentosListPage } from '@/modules/documentos';
import { RelatoriosListPage } from '@/modules/relatorios';
import { AdminPage } from '@/modules/admin';
import { PerfilPage } from '@/modules/perfil';

export const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <div>Login — em desenvolvimento</div>,
      },
    ],
  },

  // App routes (autenticadas)
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
              { path: 'cronograma', element: <div>Cronograma — em desenvolvimento</div> },
              { path: 'contratos', element: <div>Contratos — em desenvolvimento</div> },
              { path: 'equipe', element: <div>Equipe — em desenvolvimento</div> },
              { path: 'rh', element: <div>RH da Obra — em desenvolvimento</div> },
              { path: 'compras', element: <div>Compras da Obra — em desenvolvimento</div> },
              { path: 'financeiro', element: <div>Financeiro da Obra — em desenvolvimento</div> },
              { path: 'estoque', element: <div>Estoque da Obra — em desenvolvimento</div> },
              { path: 'medicoes', element: <div>Medições da Obra — em desenvolvimento</div> },
              { path: 'documentos', element: <div>Documentos da Obra — em desenvolvimento</div> },
              { path: 'riscos', element: <div>Riscos da Obra — em desenvolvimento</div> },
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
          { index: true, element: <Navigate to="/rh/funcionarios" replace /> },
        ],
      },

      // Horas Extras
      {
        path: '/horas-extras',
        element: <ModuleLayout />,
        children: [
          { index: true, element: <HorasExtrasDashboardPage /> },
        ],
      },

      // FOPAG
      {
        path: '/fopag',
        element: <ModuleLayout />,
        children: [
          { index: true, element: <FopagListPage /> },
        ],
      },

      // Compras
      {
        path: '/compras',
        element: <ModuleLayout />,
        children: [
          { index: true, element: <ComprasListPage /> },
        ],
      },

      // Fiscal
      {
        path: '/fiscal',
        element: <ModuleLayout />,
        children: [
          { index: true, element: <FiscalListPage /> },
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
    ],
  },
]);
