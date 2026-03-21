import { StatusBadge } from '@/shared/components';
import { MEDICAO_STATUS_LABELS, MEDICAO_STATUS_VARIANTS } from '../types';
import type { MedicaoStatus } from '../types';

interface MedicaoStatusBadgeProps {
  status: MedicaoStatus;
}

export function MedicaoStatusBadge({ status }: MedicaoStatusBadgeProps) {
  return <StatusBadge label={MEDICAO_STATUS_LABELS[status]} variant={MEDICAO_STATUS_VARIANTS[status]} />;
}
