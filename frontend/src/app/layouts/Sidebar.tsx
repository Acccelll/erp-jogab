import { useCallback, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useUIStore, usePreferencesStore } from '@/shared/stores';
import { cn } from '@/shared/lib/utils';
import { menuConfig, type MenuItem, type MenuGroup } from '@/config/menu';

function Divider() {
  return <div className="mx-2 my-1 h-px bg-sidebar-border/50" />;
}

function NavItem({
  item,
  collapsed,
  isSubItem = false,
}: {
  item: MenuItem;
  collapsed: boolean;
  isSubItem?: boolean;
}) {
  const location = useLocation();
  const { icon: Icon, label, path, tier = 'primary' } = item;
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  const iconSize = isSubItem ? 14 : tier === 'primary' ? 20 : 16;

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
              : tier === 'secondary' || isSubItem
                ? 'text-sidebar-text/50 hover:bg-sidebar-hover hover:text-white text-[13px]'
                : 'text-sidebar-text/80 hover:bg-sidebar-hover hover:text-white text-sm font-medium',
          collapsed && 'justify-center px-0',
          isSubItem && !collapsed && 'ml-4',
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

function CollapsibleGroup({
  group,
  collapsed,
}: {
  group: MenuGroup;
  collapsed: boolean;
}) {
  const location = useLocation();
  const { sidebarGroupsCollapsed, toggleSidebarGroup } = usePreferencesStore();

  const isGroupCollapsed = !!sidebarGroupsCollapsed[group.id];
  const isAnyItemActive = group.items.some(
    (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );

  // Auto-expand if an item is active but group is collapsed
  useEffect(() => {
    if (isAnyItemActive && isGroupCollapsed) {
      toggleSidebarGroup(group.id);
    }
  }, [isAnyItemActive, isGroupCollapsed, group.id, toggleSidebarGroup]);

  if (collapsed) {
    return (
      <>
        {group.items.map((item) => (
          <NavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => toggleSidebarGroup(group.id)}
        className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-[10px] font-medium uppercase tracking-widest text-sidebar-group/40 transition-colors hover:bg-sidebar-hover hover:text-white"
      >
        <span>{group.label}</span>
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200', isGroupCollapsed && '-rotate-90')}
        />
      </button>

      {!isGroupCollapsed && (
        <ul className="space-y-0.5">
          {group.items.map((item) => (
            <NavItem key={item.id} item={item} collapsed={collapsed} isSubItem />
          ))}
        </ul>
      )}
    </div>
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
        <div className="flex w-full items-center justify-center overflow-hidden">
          {collapsed ? (
            <img src="/logo-sem-texto.png" alt="Logo" className="h-6 w-auto" />
          ) : (
            <img src="/logo-horizontal-branco.png" alt="ERP JOGAB" className="h-6 w-auto" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-1.5 py-1">
        <div className="space-y-1">
          {menuConfig.map((itemOrGroup, idx) => {
            const isGroup = 'items' in itemOrGroup;

            if (isGroup) {
              return (
                <div key={itemOrGroup.id}>
                  {idx > 0 && <Divider />}
                  <CollapsibleGroup group={itemOrGroup} collapsed={collapsed} />
                </div>
              );
            }

            return (
              <ul key={itemOrGroup.id} className="space-y-0.5">
                <NavItem item={itemOrGroup} collapsed={collapsed} />
              </ul>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />
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
