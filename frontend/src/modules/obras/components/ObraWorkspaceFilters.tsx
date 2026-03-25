import { Search } from 'lucide-react';
import { FilterBar } from '@/shared/components';

interface ObraWorkspaceFiltersProps {
  search: string;
  status?: string;
  statusOptions?: { value: string; label: string }[];
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function ObraWorkspaceFilters({
  search,
  status,
  statusOptions,
  onSearchChange,
  onStatusChange,
  onClear,
  hasActiveFilters,
}: ObraWorkspaceFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar dentro da aba da obra..."
          className="h-8 w-72 rounded-md border border-border-default bg-white pl-8 pr-3 text-sm text-text-body placeholder:text-text-subtle focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
        />
      </div>

      {statusOptions && onStatusChange ? (
        <select
          value={status ?? ''}
          onChange={(event) => onStatusChange(event.target.value || undefined)}
          className="h-8 rounded-md border border-border-default bg-white px-2 pr-7 text-sm text-text-body focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
        >
          <option value="">Todos os status</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
    </FilterBar>
  );
}
