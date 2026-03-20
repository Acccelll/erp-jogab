import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SideDrawer } from '@/shared/components/SideDrawer';
import { useUIStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';

export function AppLayout() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 lg:static lg:z-auto',
          sidebarCollapsed && 'max-lg:hidden',
        )}
      >
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global Side Drawer */}
      <SideDrawer />
    </div>
  );
}
