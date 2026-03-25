import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft text-text-subtle">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-text-strong">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
