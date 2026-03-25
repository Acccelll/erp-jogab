import { AlertTriangle, Bell, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import type { DashboardAlertItem } from '../types';

interface DashboardAlertsPanelProps {
  alerts: DashboardAlertItem[];
}

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    containerClassName: 'border-red-200 bg-red-50/60',
    titleClassName: 'text-red-800',
    badgeVariant: 'error' as const,
    badgeLabel: 'Crítico',
  },
  warning: {
    icon: AlertTriangle,
    containerClassName: 'border-amber-200 bg-amber-50/70',
    titleClassName: 'text-amber-800',
    badgeVariant: 'warning' as const,
    badgeLabel: 'Atenção',
  },
  info: {
    icon: Info,
    containerClassName: 'border-blue-200 bg-blue-50/70',
    titleClassName: 'text-blue-800',
    badgeVariant: 'info' as const,
    badgeLabel: 'Informativo',
  },
};

export function DashboardAlertsPanel({ alerts }: DashboardAlertsPanelProps) {
  return (
    <section className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Bell size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-strong">Alertas e pendências iniciais</h2>
          <p className="text-sm text-text-muted">Sinalizações para priorização operacional no ciclo atual.</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <article key={alert.id} className={cn('rounded-xl border p-4', config.containerClassName)}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-current">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={cn('text-sm font-semibold', config.titleClassName)}>{alert.title}</h3>
                      <StatusBadge label={config.badgeLabel} variant={config.badgeVariant} />
                      <StatusBadge label={alert.module} variant="default" />
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{alert.description}</p>
                    {alert.obraNome && (
                      <p className="mt-2 text-xs font-medium text-text-muted">Obra relacionada: {alert.obraNome}</p>
                    )}
                  </div>
                </div>

                {alert.actionLabel && alert.actionTo && (
                  <Link
                    to={alert.actionTo}
                    className="inline-flex shrink-0 items-center rounded-md border border-current/15 bg-white px-3 py-1.5 text-sm font-medium text-text-body transition-colors hover:bg-white/80"
                  >
                    {alert.actionLabel}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
