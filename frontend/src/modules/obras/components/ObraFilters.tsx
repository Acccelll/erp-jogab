/**
 * ObraFilters — barra de filtros específica do módulo Obras.
 * Usa o FilterBar compartilhado e conecta com o hook useObraFilters.
 */
import { Search } from 'lucide-react';
import { FilterBar } from '@/shared/components';
import { OBRA_STATUS_LABELS, OBRA_TIPO_LABELS } from '../types';
import type { ObraStatus, ObraTipo } from '../types';

interface ObraFiltersProps {
  search: string;
  status: ObraStatus | undefined;
  tipo: ObraTipo | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ObraStatus | undefined) => void;
  onTipoChange: (value: ObraTipo | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function ObraFilters({
  search,
  status,
  tipo,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onClear,
  hasActiveFilters,
}: ObraFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      {/* Busca textual */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar obra..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-56 rounded-md border border-gray-200 bg-white pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
        />
      </div>

      {/* Status */}
      <select
        value={status ?? ''}
        onChange={(e) => onStatusChange((e.target.value || undefined) as ObraStatus | undefined)}
        className="h-8 rounded-md border border-gray-200 bg-white px-2 pr-7 text-sm text-gray-700 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(OBRA_STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      {/* Tipo */}
      <select
        value={tipo ?? ''}
        onChange={(e) => onTipoChange((e.target.value || undefined) as ObraTipo | undefined)}
        className="h-8 rounded-md border border-gray-200 bg-white px-2 pr-7 text-sm text-gray-700 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(OBRA_TIPO_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </FilterBar>
  );
}
