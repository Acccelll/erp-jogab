import type { ReactNode } from 'react';

interface KPISectionProps {
  children: ReactNode;
}

export function KPISection({ children }: KPISectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{children}</div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ label, value, subtitle, trend }: KPICardProps) {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-text-muted';

  return (
    <div className="rounded-lg border border-border-default bg-surface-card p-4 shadow-card">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text-strong">{value}</p>
      {subtitle && <p className={`mt-1 text-xs ${trendColor}`}>{subtitle}</p>}
    </div>
  );
}
