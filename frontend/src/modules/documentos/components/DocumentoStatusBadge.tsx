import { StatusBadge } from '@/shared/components';
import { DOCUMENTO_STATUS_LABELS, DOCUMENTO_STATUS_VARIANTS } from '../types';
import type { DocumentoStatus } from '../types';

interface DocumentoStatusBadgeProps {
  status: DocumentoStatus;
}

export function DocumentoStatusBadge({ status }: DocumentoStatusBadgeProps) {
  return <StatusBadge label={DOCUMENTO_STATUS_LABELS[status]} variant={DOCUMENTO_STATUS_VARIANTS[status]} />;
}
