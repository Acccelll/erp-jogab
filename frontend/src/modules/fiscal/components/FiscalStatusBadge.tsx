import { StatusBadge } from '@/shared/components';
import { FISCAL_STATUS_LABELS, FISCAL_STATUS_VARIANTS } from '../types';
import type { FiscalStatus } from '../types';

export function FiscalStatusBadge({ status }: { status: FiscalStatus }) {
  return (
    <StatusBadge
      label={FISCAL_STATUS_LABELS[status]}
      variant={FISCAL_STATUS_VARIANTS[status]}
    />
  );
}
