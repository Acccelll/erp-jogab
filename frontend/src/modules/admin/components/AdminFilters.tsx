import { FilterBar } from '@/shared/components';
import { ADMIN_CATEGORIA_LABELS, ADMIN_STATUS_LABELS } from '../types';
import type { AdminCategoria, AdminStatus } from '../types';

interface Props {
  search: string;
  categoria?: AdminCategoria;
  status?: AdminStatus;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: AdminCategoria | undefined) => void;
  onStatusChange: (value: AdminStatus | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function AdminFilters({
  search,
  categoria,
  status,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onCategoriaChange,
  onStatusChange,
  onCompetenciaChange,
  onClear,
}: Props) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por usuário, perfil, permissão, parâmetro, log ou integração"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={categoria ?? ''}
        onChange={(event) =>
          onCategoriaChange((event.target.value || undefined) as AdminCategoria | undefined)
        }
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todas as categorias</option>
        {Object.entries(ADMIN_CATEGORIA_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={status ?? ''}
        onChange={(event) =>
          onStatusChange((event.target.value || undefined) as AdminStatus | undefined)
        }
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(ADMIN_STATUS_LABELS).map(([value, label]) => (
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
