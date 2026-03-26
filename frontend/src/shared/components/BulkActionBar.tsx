import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
}

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: BulkAction[];
  className?: string;
}

export function BulkActionBar({ selectedCount, onClear, actions, className }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full border border-border-default bg-surface-card px-6 py-3 shadow-overlay animate-in fade-in slide-in-from-bottom-4',
        className
      )}
    >
      <div className="flex items-center gap-3 border-r border-border-default pr-6">
        <button
          onClick={onClear}
          className="rounded-full p-1 text-text-subtle hover:bg-surface-soft hover:text-text-body transition-colors"
          title="Limpar seleção"
        >
          <X size={16} />
        </button>
        <span className="text-sm font-semibold text-text-strong">
          {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all active:scale-95',
              action.variant === 'danger'
                ? 'text-danger hover:bg-danger/10'
                : action.variant === 'success'
                ? 'text-success hover:bg-success/10'
                : 'text-text-body hover:bg-surface-soft'
            )}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
