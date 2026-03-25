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

/** Grupo 1 — Core (always prominent) */
const coreItems: SidebarNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Obras', path: '/obras', icon: Building2 },
];

/** Grupo 2 — Pessoas (primary operational) */
const pessoasItems: SidebarNavItem[] = [
  { label: 'Funcionários', path: '/rh/funcionarios', icon: Users },
  { label: 'Horas Extras', path: '/horas-extras', icon: Clock },
  { label: 'FOPAG', path: '/fopag', icon: Receipt },
];

/** Grupo 3 — Operacional (secondary) */
const operacionalItems: SidebarNavItem[] = [
  { label: 'Compras', path: '/compras', icon: ShoppingCart },
  { label: 'Fiscal', path: '/fiscal', icon: FileText },
  { label: 'Financeiro', path: '/financeiro', icon: Banknote },
  { label: 'Estoque', path: '/estoque', icon: Package },
  { label: 'Medições', path: '/medicoes', icon: Ruler },
  { label: 'Documentos', path: '/documentos', icon: FolderOpen },
];

/** Rodapé (utility — lowest hierarchy) */
const footerItems: SidebarNavItem[] = [
  { label: 'Relatórios', path: '/relatorios', icon: BarChart2 },
  { label: 'Administração', path: '/admin', icon: Settings },
];

function Divider() {
  return <div className="mx-2 my-1 h-px bg-sidebar-border/50" />;
}

function GroupLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <p className="mt-3 px-2.5 pb-0.5 pt-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-group/30">
      {label}
    </p>
  );
}

function NavItem({
  item,
  collapsed,
  tier = 'primary',
}: {
  item: SidebarNavItem;
  collapsed: boolean;
  tier?: 'primary' | 'secondary' | 'utility';
}) {
  const location = useLocation();
  const { icon: Icon, label, path } = item;
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  const iconSize = tier === 'primary' ? 20 : 16;

  return (
    <li>
      <NavLink
        to={path}
        className={cn(
          'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-all duration-200',
          isActive
            ? 'bg-sidebar-active text-sidebar-text-active shadow-sm font-semibold'
            : tier === 'utility'
              ? 'text-sidebar-text/30 hover:bg-sidebar-hover hover:text-white text-[13px]'
              : tier === 'secondary'
                ? 'text-sidebar-text/50 hover:bg-sidebar-hover hover:text-white text-[13px]'
                : 'text-sidebar-text/80 hover:bg-sidebar-hover hover:text-white text-sm font-medium',
          collapsed && 'justify-center px-0',
        )}
        title={label}
      >
        <Icon size={iconSize} className={cn('shrink-0 transition-transform duration-200', isActive && 'scale-110')} />
        {!collapsed && (
          <span
            className={cn(
              'truncate transition-opacity duration-150',
              tier === 'primary' ? 'opacity-100' : 'opacity-80',
            )}
          >
            {label}
          </span>
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
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-primary text-xs font-bold text-white font-brand">
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
        {/* Core — highest prominence */}
        <ul className="space-y-0.5">
          {coreItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} tier="primary" />
          ))}
        </ul>

        <Divider />

        {/* Pessoas */}
        <GroupLabel label="Pessoas" collapsed={collapsed} />
        <ul className="space-y-0.5">
          {pessoasItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} tier="primary" />
          ))}
        </ul>

        <Divider />

        {/* Operacional — visually recessed */}
        <GroupLabel label="Operacional" collapsed={collapsed} />
        <ul className="space-y-0">
          {operacionalItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} tier="secondary" />
          ))}
        </ul>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer — utility tier */}
        <Divider />
        <ul className="space-y-0">
          {footerItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} tier="utility" />
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
