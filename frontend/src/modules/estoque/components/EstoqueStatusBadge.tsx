import { StatusBadge } from '@/shared/components';
import { ESTOQUE_STATUS_LABELS, ESTOQUE_STATUS_VARIANTS } from '../types';
import type { EstoqueStatus } from '../types';

interface EstoqueStatusBadgeProps {
  status: EstoqueStatus;
}

export function EstoqueStatusBadge({ status }: EstoqueStatusBadgeProps) {
  return <StatusBadge label={ESTOQUE_STATUS_LABELS[status]} variant={ESTOQUE_STATUS_VARIANTS[status]} />;
}
