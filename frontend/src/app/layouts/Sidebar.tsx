import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useUIStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: SidebarNavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Geral',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Obras', path: '/obras', icon: Building2 },
    ],
  },
  {
    title: 'Operacional',
    items: [
      { label: 'RH', path: '/rh', icon: Users },
      { label: 'Horas Extras', path: '/horas-extras', icon: Clock },
      { label: 'FOPAG', path: '/fopag', icon: Receipt },
      { label: 'Compras', path: '/compras', icon: ShoppingCart },
      { label: 'Fiscal', path: '/fiscal', icon: FileText },
      { label: 'Financeiro', path: '/financeiro', icon: DollarSign },
      { label: 'Estoque', path: '/estoque', icon: Package },
      { label: 'Medições', path: '/medicoes', icon: Ruler },
      { label: 'Documentos', path: '/documentos', icon: FolderOpen },
    ],
  },
  {
    title: 'Gerencial',
    items: [
      { label: 'Relatórios', path: '/relatorios', icon: BarChart3 },
      { label: 'Administração', path: '/admin', icon: Settings },
      { label: 'Perfil', path: '/perfil', icon: User },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const location = useLocation();

  /** On mobile (< lg), close the sidebar after navigation */
  function handleNavClick() {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-sidebar-bg transition-all duration-200',
        sidebarCollapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-jogab-500 text-sm font-bold text-white">
            J
          </div>
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap text-base font-semibold text-white">
              ERP JOGAB
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden rounded p-1 text-sidebar-text hover:bg-sidebar-hover hover:text-white lg:block"
          title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {!sidebarCollapsed && (
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-group">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ label, path, icon: Icon }) => {
                const isActive =
                  location.pathname === path || location.pathname.startsWith(`${path}/`);

                return (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={handleNavClick}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-active text-sidebar-text-active'
                          : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
                        sidebarCollapsed && 'justify-center px-2',
                      )}
                      title={label}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!sidebarCollapsed && <span>{label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / Version */}
      <div className="border-t border-sidebar-border px-3 py-3">
        {!sidebarCollapsed ? (
          <p className="text-[11px] text-sidebar-group">
            ERP JOGAB v0.2.0 — Fase 2
          </p>
        ) : (
          <p className="text-center text-[10px] text-sidebar-group">v0.2</p>
        )}
      </div>
    </aside>
  );
}
