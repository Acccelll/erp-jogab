/**
 * FuncionarioStatusBadge — badge visual para status de funcionário.
 * Mapeia FuncionarioStatus para as variantes do StatusBadge compartilhado.
 */
import { StatusBadge } from '@/shared/components';
import { FUNCIONARIO_STATUS_LABELS, FUNCIONARIO_STATUS_VARIANTS } from '../types';
import type { FuncionarioStatus } from '../types';

interface FuncionarioStatusBadgeProps {
  status: FuncionarioStatus;
  className?: string;
}

export function FuncionarioStatusBadge({ status, className }: FuncionarioStatusBadgeProps) {
  return (
    <StatusBadge
      label={FUNCIONARIO_STATUS_LABELS[status]}
      variant={FUNCIONARIO_STATUS_VARIANTS[status]}
      className={className}
    />
  );
}
