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
        'flex items-center justify-between border-b border-border-default bg-surface px-6 transition-all duration-200',
        isAnalytical ? 'py-8 border-b-border-default/40' : 'py-3',
        isWorkspace && 'border-b-0 px-0 py-0',
      )}
    >
      <div className="min-w-0 flex-1">
        <h1
          className={cn(
            'text-text-strong font-brand transition-all duration-200',
            isAnalytical
              ? 'text-3xl font-extrabold tracking-tight'
              : isWorkspace
                ? 'text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/50'
                : 'text-lg font-bold tracking-tight',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'text-text-muted transition-all duration-200',
              isAnalytical ? 'mt-2 text-lg font-medium opacity-70' : 'mt-0.5 text-xs opacity-60'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn('flex items-center gap-3', isAnalytical ? 'mb-auto' : '')}>
          {actions}
        </div>
      )}
    </div>
  );
}
