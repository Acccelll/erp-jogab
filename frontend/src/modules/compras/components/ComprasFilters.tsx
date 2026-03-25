import { COMPRA_CATEGORIA_LABELS, COMPRA_PRIORIDADE_LABELS, COMPRA_STATUS_LABELS } from '../types';
import type { CompraCategoria, CompraPrioridade, CompraStatus } from '../types';

interface ComprasFiltersProps {
  search: string;
  status?: CompraStatus;
  categoria?: CompraCategoria;
  prioridade?: CompraPrioridade;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CompraStatus | undefined) => void;
  onCategoriaChange: (value: CompraCategoria | undefined) => void;
  onPrioridadeChange: (value: CompraPrioridade | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function ComprasFilters({
  search,
  status,
  categoria,
  prioridade,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onCategoriaChange,
  onPrioridadeChange,
  onCompetenciaChange,
  onClear,
}: ComprasFiltersProps) {
  return (
    <section className="border-b border-border-light bg-white px-6 py-4">
      <div className="grid gap-3 lg:grid-cols-5">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por código, obra, fornecedor ou objeto"
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        />

        <select
          value={status ?? ''}
          onChange={(e) => onStatusChange((e.target.value || undefined) as CompraStatus | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todos os status</option>
          {Object.entries(COMPRA_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={categoria ?? ''}
          onChange={(e) => onCategoriaChange((e.target.value || undefined) as CompraCategoria | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todas as categorias</option>
          {Object.entries(COMPRA_CATEGORIA_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={prioridade ?? ''}
          onChange={(e) => onPrioridadeChange((e.target.value || undefined) as CompraPrioridade | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todas as prioridades</option>
          {Object.entries(COMPRA_PRIORIDADE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            value={competencia ?? ''}
            onChange={(e) => onCompetenciaChange(e.target.value || undefined)}
            placeholder="Competência (YYYY-MM)"
            className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
          />
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="rounded-md border border-gray-300 px-3 text-sm font-medium text-text-body transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar
          </button>
        </div>
      </div>
    </section>
  );
}
