import { cn } from '@/shared/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-200 text-neutral-700',
  success: 'bg-jogab-100 text-jogab-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-accent-100 text-accent-600',
};

export function StatusBadge({ label, variant = 'default', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
