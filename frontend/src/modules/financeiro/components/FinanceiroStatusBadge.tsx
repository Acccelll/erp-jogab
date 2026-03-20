import { StatusBadge } from '@/shared/components';
import { FINANCEIRO_STATUS_LABELS, FINANCEIRO_STATUS_VARIANTS } from '../types';
import type { FinanceiroStatus } from '../types';

interface FinanceiroStatusBadgeProps {
  status: FinanceiroStatus;
}

export function FinanceiroStatusBadge({ status }: FinanceiroStatusBadgeProps) {
  return <StatusBadge label={FINANCEIRO_STATUS_LABELS[status]} variant={FINANCEIRO_STATUS_VARIANTS[status]} />;
}
