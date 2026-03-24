import { Link } from 'react-router-dom';

interface ObraWorkspaceSectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ObraWorkspaceSectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: ObraWorkspaceSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {actionLabel && actionHref ? (
        <Link
          to={actionHref}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
