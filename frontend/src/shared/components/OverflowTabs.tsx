import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useDirtyStore } from '@/shared/stores';

interface TabItem {
  label: string;
  path: string;
}

interface OverflowTabsProps {
  tabs: TabItem[];
  maxVisible?: number;
  basePath: string;
}

export function OverflowTabs({ tabs, maxVisible = 5, basePath }: OverflowTabsProps) {
  const visibleTabs = tabs.slice(0, maxVisible);
  const hiddenTabs = tabs.slice(maxVisible);
  const isDirty = useDirtyStore((state) => state.isDirty);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <nav className="-mb-px flex items-center gap-1" aria-label="Abas">
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={`${basePath}${tab.path ? `/${tab.path}` : ''}`}
          end={tab.path === ''}
        >
          {({ isActive }) => (
            <div
              className={cn(
                'whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-all duration-200',
                isActive
                  ? 'border-brand-primary text-brand-primary bg-brand-primary/[0.03]'
                  : 'border-transparent text-text-muted/60 hover:text-text-body hover:border-border-default',
              )}
            >
              <div className="flex items-center gap-1.5">
                {tab.label}
                {isActive && isDirty && (
                  <AlertCircle size={12} className="text-brand-primary animate-pulse" />
                )}
              </div>
            </div>
          )}
        </NavLink>
      ))}

      {hiddenTabs.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-2 py-2 text-xs font-medium text-text-subtle transition-colors hover:text-text-muted"
          >
            Mais
            <ChevronDown className="h-3 w-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-md border border-border-default bg-surface py-1 shadow-elevated">
              {hiddenTabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={`${basePath}${tab.path ? `/${tab.path}` : ''}`}
                  onClick={() => setDropdownOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-1.5 text-sm hover:bg-surface-soft',
                      isActive ? 'font-medium text-brand-primary' : 'text-text-muted',
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
