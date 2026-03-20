import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <div className={cn('flex-1 overflow-auto px-6 py-4', className)}>
      {children}
    </div>
  );
}
