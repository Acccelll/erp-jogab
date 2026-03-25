import { FilterBar } from '@/shared/components';
import { FINANCEIRO_ORIGEM_LABELS, FINANCEIRO_STATUS_LABELS, FINANCEIRO_TIPO_LABELS } from '../types';
import type { FinanceiroOrigem, FinanceiroStatus, FinanceiroTipo } from '../types';

interface FinanceiroFiltersProps {
  search: string;
  status?: FinanceiroStatus;
  tipo?: FinanceiroTipo;
  origem?: FinanceiroOrigem;
  competencia?: string;
  hasActiveFilters: boolean;
  lockTipo?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: FinanceiroStatus | undefined) => void;
  onTipoChange: (value: FinanceiroTipo | undefined) => void;
  onOrigemChange: (value: FinanceiroOrigem | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function FinanceiroFilters({
  search,
  status,
  tipo,
  origem,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onOrigemChange,
  onCompetenciaChange,
  onClear,
  lockTipo = false,
}: FinanceiroFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por título, obra, documento, centro de custo ou contraparte"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={status ?? ''}
        onChange={(event) => onStatusChange((event.target.value || undefined) as FinanceiroStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(FINANCEIRO_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={tipo ?? ''}
        onChange={(event) => onTipoChange((event.target.value || undefined) as FinanceiroTipo | undefined)}
        disabled={lockTipo}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500 disabled:cursor-not-allowed disabled:bg-surface-soft"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(FINANCEIRO_TIPO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={origem ?? ''}
        onChange={(event) => onOrigemChange((event.target.value || undefined) as FinanceiroOrigem | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todas as origens</option>
        {Object.entries(FINANCEIRO_ORIGEM_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        value={competencia ?? ''}
        onChange={(event) => onCompetenciaChange(event.target.value || undefined)}
        placeholder="Competência (YYYY-MM)"
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />
    </FilterBar>
  );
}
