import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

interface DashboardSectionGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function DashboardSectionGroup({ title, children, defaultOpen = true }: DashboardSectionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <button type="button" onClick={() => setOpen(!open)} className="mb-2 flex w-full items-center gap-2 text-left">
        <ChevronDown
          size={14}
          className={cn('shrink-0 text-text-subtle transition-transform', !open && '-rotate-90')}
        />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">{title}</h2>
        <div className="h-px flex-1 bg-border-light" />
      </button>
      {open && <div className="grid gap-3 xl:grid-cols-2">{children}</div>}
    </section>
  );
}
