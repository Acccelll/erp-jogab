import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-white px-6 py-3">
      {children}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto text-sm text-gray-500 hover:text-gray-700"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
