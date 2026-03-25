import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardSectionCardData } from '../types';

interface DashboardSectionCardProps {
  section: DashboardSectionCardData;
}

export function DashboardSectionCard({ section }: DashboardSectionCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-surface-card p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-text-strong">{section.title}</h3>
          <p className="mt-1 text-sm text-text-muted">{section.description}</p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {section.metrics.map((metric) => (
          <div
            key={metric.label}
            className={metric.highlight ? 'rounded-lg bg-jogab-50 p-3' : 'rounded-lg bg-surface-soft p-3'}
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-text-subtle">{metric.label}</dt>
            <dd
              className={
                metric.highlight
                  ? 'mt-1 text-sm font-semibold text-jogab-700'
                  : 'mt-1 text-sm font-semibold text-text-body'
              }
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 pt-4">
        <Link
          to={section.action.to}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 transition-colors hover:text-accent-700"
        >
          {section.action.label}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
