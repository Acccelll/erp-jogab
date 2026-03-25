import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  variant?: 'analytical' | 'operational' | 'workspace';
}

export function PageHeader({ title, subtitle, actions, variant = 'operational' }: PageHeaderProps) {
  const isAnalytical = variant === 'analytical';
  const isWorkspace = variant === 'workspace';

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-border-default bg-surface px-4',
        isAnalytical ? 'py-6' : 'py-2',
        isWorkspace && 'border-b-0 px-0',
      )}
    >
      <div>
        <h1
          className={cn(
            'text-text-strong font-brand',
            isAnalytical ? 'text-2xl font-bold' : isWorkspace ? 'text-xs uppercase tracking-widest text-text-muted' : 'text-sm font-semibold',
          )}
        >
          {title}
        </h1>
        {subtitle && <p className={cn('text-text-muted', isAnalytical ? 'mt-1 text-base' : 'mt-0.5 text-xs')}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
