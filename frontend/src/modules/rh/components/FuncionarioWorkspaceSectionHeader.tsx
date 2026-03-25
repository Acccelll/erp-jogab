import { Link } from 'react-router-dom';

interface FuncionarioWorkspaceSectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function FuncionarioWorkspaceSectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: FuncionarioWorkspaceSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div>
        <h2 className="text-lg font-semibold text-text-strong">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>

      {actionLabel && actionHref ? (
        <Link
          to={actionHref}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
