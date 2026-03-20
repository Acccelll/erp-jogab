import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User, Search } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';

/** Maps route prefixes to human-readable breadcrumb labels */
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  obras: 'Obras',
  rh: 'Recursos Humanos',
  'horas-extras': 'Horas Extras',
  fopag: 'FOPAG',
  compras: 'Compras',
  fiscal: 'Fiscal',
  financeiro: 'Financeiro',
  estoque: 'Estoque',
  medicoes: 'Medições e Faturamento',
  documentos: 'Documentos',
  relatorios: 'Relatórios',
  admin: 'Administração',
  perfil: 'Perfil',
};

function useBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return segments.map((seg) => routeLabels[seg] ?? seg).slice(0, 2);
}

export function Topbar() {
  const { setSidebarCollapsed, sidebarCollapsed } = useUIStore();
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const breadcrumbs = useBreadcrumbs();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-default bg-surface px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb} className="flex items-center gap-1">
              {idx > 0 && <span className="text-gray-300">/</span>}
              <span
                className={cn(
                  idx === breadcrumbs.length - 1
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500',
                )}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search placeholder */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100 md:flex"
        >
          <Search size={14} />
          <span>Buscar...</span>
          <kbd className="ml-4 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notificações"
        >
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-jogab-100 text-xs font-semibold text-jogab-700">
              {usuario?.nome?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <span className="hidden max-w-[120px] truncate text-gray-700 md:inline">
              {usuario?.nome ?? 'Usuário'}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {usuario?.nome ?? 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">
                  {usuario?.email ?? 'usuario@jogab.com.br'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/perfil');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={14} />
                Meu Perfil
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
