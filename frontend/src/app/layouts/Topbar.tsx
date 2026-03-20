import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/shared/stores';

export function Topbar() {
  const { toggleSidebar } = useUIStore();
  const usuario = useAuthStore((s) => s.usuario);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
            {usuario?.nome?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden md:inline">{usuario?.nome ?? 'Usuário'}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
