import { FilterBar } from '@/shared/components';
import { RELATORIO_CATEGORIA_LABELS, RELATORIO_DISPONIBILIDADE_LABELS, RELATORIO_FORMATO_LABELS } from '../types';
import type { RelatorioCategoria, RelatorioDisponibilidade, RelatorioSaida } from '../types';

interface RelatoriosFiltersProps {
  search: string;
  categoria?: RelatorioCategoria;
  disponibilidade?: RelatorioDisponibilidade;
  formato?: RelatorioSaida;
  competencia?: string;
  hasActiveFilters: boolean;
  lockCategoria?: boolean;
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: RelatorioCategoria | undefined) => void;
  onDisponibilidadeChange: (value: RelatorioDisponibilidade | undefined) => void;
  onFormatoChange: (value: RelatorioSaida | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function RelatoriosFilters({
  search,
  categoria,
  disponibilidade,
  formato,
  competencia,
  hasActiveFilters,
  lockCategoria = false,
  onSearchChange,
  onCategoriaChange,
  onDisponibilidadeChange,
  onFormatoChange,
  onCompetenciaChange,
  onClear,
}: RelatoriosFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por relatório, categoria, descrição ou origem"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={categoria ?? ''}
        onChange={(event) => onCategoriaChange((event.target.value || undefined) as RelatorioCategoria | undefined)}
        disabled={lockCategoria}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500 disabled:bg-surface-soft disabled:text-text-muted"
      >
        <option value="">Todas as categorias</option>
        {Object.entries(RELATORIO_CATEGORIA_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={disponibilidade ?? ''}
        onChange={(event) =>
          onDisponibilidadeChange((event.target.value || undefined) as RelatorioDisponibilidade | undefined)
        }
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Toda disponibilidade</option>
        {Object.entries(RELATORIO_DISPONIBILIDADE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={formato ?? ''}
        onChange={(event) => onFormatoChange((event.target.value || undefined) as RelatorioSaida | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os formatos</option>
        {Object.entries(RELATORIO_FORMATO_LABELS).map(([value, label]) => (
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
