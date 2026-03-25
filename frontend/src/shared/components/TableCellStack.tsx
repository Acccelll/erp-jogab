import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

interface TableCellStackProps {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
}

export function TableCellStack({ primary, secondary, className }: TableCellStackProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-sm font-medium leading-tight text-gray-900">{primary}</span>
      {secondary && <span className="text-xs leading-tight text-gray-500">{secondary}</span>}
    </div>
  );
}
