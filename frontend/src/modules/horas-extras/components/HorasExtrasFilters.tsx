import { Search } from 'lucide-react';
import { FilterBar } from '@/shared/components';
import { HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_TIPO_LABELS } from '../types';
import type { HoraExtraStatus, HoraExtraTipo } from '../types';

interface HorasExtrasFiltersProps {
  search: string;
  status: HoraExtraStatus | undefined;
  tipo: HoraExtraTipo | undefined;
  competencia: string | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: HoraExtraStatus | undefined) => void;
  onTipoChange: (value: HoraExtraTipo | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function HorasExtrasFilters({
  search,
  status,
  tipo,
  competencia,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onCompetenciaChange,
  onClear,
  hasActiveFilters,
}: HorasExtrasFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input
          type="text"
          placeholder="Buscar funcionário, obra ou matrícula..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-72 rounded-md border border-border-default bg-white pl-8 pr-3 text-sm text-text-body placeholder:text-text-subtle focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
        />
      </div>

      <select
        value={status ?? ''}
        onChange={(e) => onStatusChange((e.target.value || undefined) as HoraExtraStatus | undefined)}
        className="h-8 rounded-md border border-border-default bg-white px-2 pr-7 text-sm text-text-body focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(HORA_EXTRA_STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={tipo ?? ''}
        onChange={(e) => onTipoChange((e.target.value || undefined) as HoraExtraTipo | undefined)}
        className="h-8 rounded-md border border-border-default bg-white px-2 pr-7 text-sm text-text-body focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(HORA_EXTRA_TIPO_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="month"
        value={competencia ?? ''}
        onChange={(e) => onCompetenciaChange(e.target.value || undefined)}
        className="h-8 rounded-md border border-border-default bg-white px-2 text-sm text-text-body focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      />
    </FilterBar>
  );
}
