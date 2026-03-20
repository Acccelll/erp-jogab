/**
 * ObraStatusBadge — badge visual para status de obra.
 * Mapeia ObraStatus para as variantes do StatusBadge compartilhado.
 */
import { StatusBadge } from '@/shared/components';
import { OBRA_STATUS_LABELS, OBRA_STATUS_VARIANTS } from '../types';
import type { ObraStatus } from '../types';

interface ObraStatusBadgeProps {
  status: ObraStatus;
  className?: string;
}

export function ObraStatusBadge({ status, className }: ObraStatusBadgeProps) {
  return (
    <StatusBadge
      label={OBRA_STATUS_LABELS[status]}
      variant={OBRA_STATUS_VARIANTS[status]}
      className={className}
    />
  );
}
