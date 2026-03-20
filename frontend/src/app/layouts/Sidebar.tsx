import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  Receipt,
  ShoppingCart,
  FileText,
  DollarSign,
  Package,
  Ruler,
  FolderOpen,
  BarChart3,
  Settings,
  User,
} from 'lucide-react';
import { useUIStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Obras', path: '/obras', icon: Building2 },
  { label: 'RH', path: '/rh', icon: Users },
  { label: 'Horas Extras', path: '/horas-extras', icon: Clock },
  { label: 'FOPAG', path: '/fopag', icon: Receipt },
  { label: 'Compras', path: '/compras', icon: ShoppingCart },
  { label: 'Fiscal', path: '/fiscal', icon: FileText },
  { label: 'Financeiro', path: '/financeiro', icon: DollarSign },
  { label: 'Estoque', path: '/estoque', icon: Package },
  { label: 'Medições', path: '/medicoes', icon: Ruler },
  { label: 'Documentos', path: '/documentos', icon: FolderOpen },
  { label: 'Relatórios', path: '/relatorios', icon: BarChart3 },
  { label: 'Administração', path: '/admin', icon: Settings },
  { label: 'Perfil', path: '/perfil', icon: User },
];

export function Sidebar() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        {sidebarCollapsed ? (
          <span className="text-lg font-bold text-blue-700">J</span>
        ) : (
          <span className="text-lg font-bold text-blue-700">ERP JOGAB</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
                title={label}
              >
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
