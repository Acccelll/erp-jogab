import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardSectionCardData } from '../types';

interface DashboardSectionCardProps {
  section: DashboardSectionCardData;
}

export function DashboardSectionCard({ section }: DashboardSectionCardProps) {
  return (
    <article className="rounded-lg border border-border-default bg-surface-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-strong">{section.title}</h3>
          <p className="mt-0.5 text-xs text-text-muted line-clamp-1">{section.description}</p>
        </div>
        <Link
          to={section.action.to}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
        >
          {section.action.label}
          <ArrowRight size={12} />
        </Link>
      </div>

      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {section.metrics.map((metric) => (
          <div key={metric.label} className="flex items-baseline gap-1.5">
            <dt className="text-[11px] text-text-subtle">{metric.label}</dt>
            <dd
              className={
                metric.highlight
                  ? 'text-sm font-semibold tabular-nums text-brand-primary'
                  : 'text-sm font-semibold tabular-nums text-text-body'
              }
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
