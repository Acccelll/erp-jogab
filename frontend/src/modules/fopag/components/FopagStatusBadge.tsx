import { StatusBadge } from '@/shared/components';
import { FOPAG_STATUS_LABELS, FOPAG_STATUS_VARIANTS } from '../types';
import type { FopagCompetenciaStatus } from '../types';

interface FopagStatusBadgeProps {
  status: FopagCompetenciaStatus;
}

export function FopagStatusBadge({ status }: FopagStatusBadgeProps) {
  return <StatusBadge label={FOPAG_STATUS_LABELS[status]} variant={FOPAG_STATUS_VARIANTS[status]} />;
}
