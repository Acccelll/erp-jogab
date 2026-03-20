import { StatusBadge } from '@/shared/components';
import { COMPRA_STATUS_LABELS, COMPRA_STATUS_VARIANTS } from '../types';
import type { CompraStatus } from '../types';

interface CompraStatusBadgeProps {
  status: CompraStatus;
}

export function CompraStatusBadge({ status }: CompraStatusBadgeProps) {
  return <StatusBadge label={COMPRA_STATUS_LABELS[status]} variant={COMPRA_STATUS_VARIANTS[status]} />;
}
