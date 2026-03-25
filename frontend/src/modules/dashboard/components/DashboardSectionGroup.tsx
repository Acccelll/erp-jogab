import type { ReactNode } from 'react';

interface DashboardSectionGroupProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardSectionGroup({ title, children }: DashboardSectionGroupProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">{title}</h2>
        <div className="h-px flex-1 bg-border-light" />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">{children}</div>
    </section>
  );
}
