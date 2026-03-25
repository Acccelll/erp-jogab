import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

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
          className={({ isActive }) =>
            cn(
              'whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-jogab-700 text-jogab-700'
                : 'border-transparent text-text-muted hover:border-jogab-400 hover:text-text-body',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}

      {hiddenTabs.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-2 py-2 text-xs text-text-subtle transition-colors hover:text-text-muted"
          >
            +{hiddenTabs.length}
            <ChevronDown className="h-3 w-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-md border border-border-default bg-surface py-1 shadow-lg">
              {hiddenTabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={`${basePath}${tab.path ? `/${tab.path}` : ''}`}
                  onClick={() => setDropdownOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-1.5 text-sm hover:bg-surface-soft',
                      isActive ? 'font-medium text-jogab-700' : 'text-text-muted',
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
