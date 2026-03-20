import type { ReactNode } from 'react';

interface KPISectionProps {
  children: ReactNode;
}

export function KPISection({ children }: KPISectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ label, value, subtitle, trend }: KPICardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-green-600'
      : trend === 'down'
        ? 'text-red-600'
        : 'text-gray-500';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle && (
        <p className={`mt-1 text-xs ${trendColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
