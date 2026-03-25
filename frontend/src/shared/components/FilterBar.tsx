import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border-light bg-surface px-6 py-3">
      {children}
      {onClear && (
        <button type="button" onClick={onClear} className="ml-auto text-sm text-text-muted hover:text-text-body">
          Limpar filtros
        </button>
      )}
    </div>
  );
}
