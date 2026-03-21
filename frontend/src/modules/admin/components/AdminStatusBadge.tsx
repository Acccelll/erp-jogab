import { StatusBadge } from '@/shared/components';
import { ADMIN_STATUS_LABELS, ADMIN_STATUS_VARIANTS } from '../types';
import type { AdminStatus } from '../types';

export function AdminStatusBadge({ status }: { status: AdminStatus }) {
  return <StatusBadge label={ADMIN_STATUS_LABELS[status]} variant={ADMIN_STATUS_VARIANTS[status]} />;
}
