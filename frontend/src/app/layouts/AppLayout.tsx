/**
 * AppLayout — Layout principal do ERP JOGAB.
 *
 * Renderiza os componentes obrigatórios do shell autenticado:
 *   1. <Sidebar />    — navegação lateral com módulos em 3 grupos
 *   2. <Topbar />     — breadcrumbs, ações, notificações e menu do usuário
 *   3. <ContextBar /> — seletores de contexto global (Empresa, Filial, Obra, Centro de Custo, Competência)
 *   4. <Outlet />     — conteúdo da rota ativa (ModuleLayout / ObraWorkspaceLayout)
 *   5. <SideDrawer /> — drawer lateral global para detalhes e formulários
 *
 * Referência: CLAUDE.md "Layout obrigatório", JOGAB_MASTER_SPEC §6.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ContextBar, NavigationBlocker, ErrorBoundary } from '@/shared/components';
import { SideDrawer } from '@/shared/components/SideDrawer';
import { useUIStore } from '@/shared/stores';

export function AppLayout() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {/* ── Mobile overlay ── */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSidebarCollapsed(true);
          }}
          role="button"
          tabIndex={-1}
          aria-label="Fechar menu"
        />
      )}

      {/* ── 1. Sidebar — navegação lateral ── */}
      <div
        className="fixed inset-y-0 left-0 z-40 shrink-0 lg:static lg:z-auto"
        style={{
          width: sidebarCollapsed ? 52 : 220,
          transition: 'width 200ms ease',
        }}
      >
        <Sidebar />
      </div>

      {/* ── Área principal ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── 2. Topbar — breadcrumbs, ações e menu do usuário ── */}
        <Topbar />

        {/* ── 3. ContextBar — seletores de contexto global ── */}
        <ContextBar />

        {/* ── 4. Outlet — conteúdo da rota ativa ── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* ── 5. SideDrawer — drawer lateral global ── */}
      <SideDrawer />

      {/* ── Global navigation blocker ── */}
      <NavigationBlocker />
    </div>
  );
}
