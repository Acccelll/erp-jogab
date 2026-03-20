import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SideDrawer } from '@/shared/components/SideDrawer';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global Side Drawer */}
      <SideDrawer />
    </div>
  );
}
