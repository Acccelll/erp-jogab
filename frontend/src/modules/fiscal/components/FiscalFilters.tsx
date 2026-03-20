import { FISCAL_STATUS_LABELS, FISCAL_TIPO_LABELS } from '../types';
import type { FiscalDocumentoStatus, FiscalDocumentoTipo, FiscalFluxo } from '../types';

interface FiscalFiltersProps {
  search: string;
  status?: FiscalDocumentoStatus;
  tipo?: FiscalDocumentoTipo;
  fluxo?: FiscalFluxo;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: FiscalDocumentoStatus | undefined) => void;
  onTipoChange: (value: FiscalDocumentoTipo | undefined) => void;
  onFluxoChange: (value: FiscalFluxo | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function FiscalFilters({
  search,
  status,
  tipo,
  fluxo,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onFluxoChange,
  onCompetenciaChange,
  onClear,
}: FiscalFiltersProps) {
  return (
    <section className="border-b border-border-light bg-white px-6 py-4">
      <div className="grid gap-3 lg:grid-cols-5">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por número, emitente, destinatário ou obra"
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        />

        <select
          value={status ?? ''}
          onChange={(e) => onStatusChange((e.target.value || undefined) as FiscalDocumentoStatus | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todos os status</option>
          {Object.entries(FISCAL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={tipo ?? ''}
          onChange={(e) => onTipoChange((e.target.value || undefined) as FiscalDocumentoTipo | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(FISCAL_TIPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={fluxo ?? ''}
          onChange={(e) => onFluxoChange((e.target.value || undefined) as FiscalFluxo | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Entradas e saídas</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
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
            className="rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar
          </button>
        </div>
      </div>
    </section>
  );
}
