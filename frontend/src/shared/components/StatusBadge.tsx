import { cn } from '@/shared/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-200 text-neutral-700',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  error: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
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
