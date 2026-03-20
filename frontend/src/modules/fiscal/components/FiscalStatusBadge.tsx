import { StatusBadge } from '@/shared/components';
import { FISCAL_STATUS_LABELS, FISCAL_STATUS_VARIANTS } from '../types';
import type { FiscalDocumentoStatus } from '../types';

interface FiscalStatusBadgeProps {
  status: FiscalDocumentoStatus;
}

export function FiscalStatusBadge({ status }: FiscalStatusBadgeProps) {
  return <StatusBadge label={FISCAL_STATUS_LABELS[status]} variant={FISCAL_STATUS_VARIANTS[status]} />;
}
