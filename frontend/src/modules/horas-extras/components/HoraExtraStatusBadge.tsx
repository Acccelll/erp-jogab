import { StatusBadge } from '@/shared/components';
import { HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_STATUS_VARIANTS } from '../types';
import type { HoraExtraStatus } from '../types';

interface HoraExtraStatusBadgeProps {
  status: HoraExtraStatus;
}

export function HoraExtraStatusBadge({ status }: HoraExtraStatusBadgeProps) {
  return <StatusBadge label={HORA_EXTRA_STATUS_LABELS[status]} variant={HORA_EXTRA_STATUS_VARIANTS[status]} />;
}
