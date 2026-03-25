/**
 * AppLayout — Layout principal do ERP JOGAB (Fase 2).
 *
 * Renderiza explicitamente os componentes obrigatórios do shell:
 *   1. <Sidebar />    — navegação lateral com módulos em 3 grupos
 *   2. <Topbar />     — breadcrumbs, contexto (Obra+Competência), menu do usuário
 *   3. <Outlet />     — conteúdo da rota ativa (ModuleLayout / ObraWorkspaceLayout)
 *   4. <SideDrawer /> — drawer lateral global para detalhes e formulários
 *
 * Referência: CLAUDE.md "Layout obrigatório", JOGAB_MASTER_SPEC §6.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
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
        {/* ── 2. Topbar — barra superior com contexto integrado ── */}
        <Topbar />

        {/* ── 3. Outlet — conteúdo da rota ativa ── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* ── 4. SideDrawer — drawer lateral global ── */}
      <SideDrawer />
    </div>
  );
}
