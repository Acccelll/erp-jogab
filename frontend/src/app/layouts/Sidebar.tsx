import { useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  Receipt,
  ShoppingCart,
  FileText,
  Banknote,
  Package,
  Ruler,
  FolderOpen,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

/** Grupo 1 — Core */
const coreItems: SidebarNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Obras', path: '/obras', icon: Building2 },
];

/** Grupo 2 — Pessoas */
const pessoasItems: SidebarNavItem[] = [
  { label: 'Funcionários', path: '/rh/funcionarios', icon: Users },
  { label: 'Horas Extras', path: '/horas-extras', icon: Clock },
  { label: 'FOPAG', path: '/fopag', icon: Receipt },
];

/** Grupo 3 — Operacional */
const operacionalItems: SidebarNavItem[] = [
  { label: 'Compras', path: '/compras', icon: ShoppingCart },
  { label: 'Fiscal', path: '/fiscal', icon: FileText },
  { label: 'Financeiro', path: '/financeiro', icon: Banknote },
  { label: 'Estoque', path: '/estoque', icon: Package },
  { label: 'Medições', path: '/medicoes', icon: Ruler },
  { label: 'Documentos', path: '/documentos', icon: FolderOpen },
];

/** Rodapé */
const footerItems: SidebarNavItem[] = [
  { label: 'Relatórios', path: '/relatorios', icon: BarChart2 },
  { label: 'Administração', path: '/admin', icon: Settings },
];

function Divider() {
  return <div className="mx-2 my-1.5 h-px bg-sidebar-border" />;
}

function NavItem({ item, collapsed }: { item: SidebarNavItem; collapsed: boolean }) {
  const location = useLocation();
  const { icon: Icon, label, path } = item;
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <li>
      <NavLink
        to={path}
        className={cn(
          'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors',
          isActive
            ? 'bg-sidebar-active text-sidebar-text-active'
            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
          collapsed && 'justify-center px-0',
        )}
        title={label}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && (
          <span className="truncate font-medium opacity-100 transition-opacity duration-150">{label}</span>
        )}
      </NavLink>
    </li>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, sidebarPinned, setSidebarCollapsed, setSidebarPinned } = useUIStore();
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleMouseEnter = useCallback(() => {
    if (sidebarPinned) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    enterTimer.current = setTimeout(() => setSidebarCollapsed(false), 150);
  }, [sidebarPinned, setSidebarCollapsed]);

  const handleMouseLeave = useCallback(() => {
    if (sidebarPinned) return;
    if (enterTimer.current) clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => setSidebarCollapsed(true), 200);
  }, [sidebarPinned, setSidebarCollapsed]);

  const togglePin = useCallback(() => {
    setSidebarPinned(!sidebarPinned);
  }, [sidebarPinned, setSidebarPinned]);

  const collapsed = sidebarCollapsed;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'flex h-full flex-col bg-sidebar-bg transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[52px]' : 'w-[220px]',
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-11 items-center px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-jogab-700 text-xs font-bold text-white font-brand">
            J
          </div>
          {!collapsed && (
            <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white font-brand">
              ERP JOGAB
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-1.5 py-1">
        {/* Grupo 1 — Core */}
        <ul className="space-y-0.5">
          {coreItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>

        <Divider />

        {/* Grupo 2 — Pessoas */}
        <ul className="space-y-0.5">
          {pessoasItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>

        <Divider />

        {/* Grupo 3 — Operacional */}
        <ul className="space-y-0.5">
          {operacionalItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Rodapé — Relatórios e Admin */}
        <ul className="space-y-0.5">
          {footerItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* Toggle pin button */}
      <div className="border-t border-sidebar-border px-1.5 py-1.5">
        <button
          type="button"
          onClick={togglePin}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-white',
            collapsed && 'justify-center px-0',
          )}
          title={sidebarPinned ? 'Recolher menu' : 'Fixar menu'}
        >
          {sidebarPinned ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          {!collapsed && <span className="text-xs font-medium">{sidebarPinned ? 'Recolher' : 'Fixar menu'}</span>}
        </button>
      </div>
    </aside>
  );
}
