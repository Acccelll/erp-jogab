import type { ReactNode } from 'react';

interface DashboardSectionGroupProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DashboardSectionGroup({ title, description, children }: DashboardSectionGroupProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">{children}</div>
    </section>
  );
}
