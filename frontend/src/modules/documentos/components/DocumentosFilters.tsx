import { FilterBar } from '@/shared/components';
import {
  DOCUMENTO_ALERTA_LABELS,
  DOCUMENTO_ENTIDADE_LABELS,
  DOCUMENTO_STATUS_LABELS,
  DOCUMENTO_TIPO_LABELS,
} from '../types';
import type { DocumentoAlerta, DocumentoEntidade, DocumentoStatus, DocumentoTipo } from '../types';

interface DocumentosFiltersProps {
  search: string;
  status?: DocumentoStatus;
  tipo?: DocumentoTipo;
  entidade?: DocumentoEntidade;
  alerta?: DocumentoAlerta;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: DocumentoStatus | undefined) => void;
  onTipoChange: (value: DocumentoTipo | undefined) => void;
  onEntidadeChange: (value: DocumentoEntidade | undefined) => void;
  onAlertaChange: (value: DocumentoAlerta | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function DocumentosFilters({
  search,
  status,
  tipo,
  entidade,
  alerta,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onEntidadeChange,
  onAlertaChange,
  onCompetenciaChange,
  onClear,
}: DocumentosFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por documento, obra, funcionário, fornecedor, contrato ou responsável"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select value={status ?? ''} onChange={(event) => onStatusChange((event.target.value || undefined) as DocumentoStatus | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500">
        <option value="">Todos os status</option>
        {Object.entries(DOCUMENTO_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <select value={tipo ?? ''} onChange={(event) => onTipoChange((event.target.value || undefined) as DocumentoTipo | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500">
        <option value="">Todos os tipos</option>
        {Object.entries(DOCUMENTO_TIPO_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <select value={entidade ?? ''} onChange={(event) => onEntidadeChange((event.target.value || undefined) as DocumentoEntidade | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500">
        <option value="">Todas as entidades</option>
        {Object.entries(DOCUMENTO_ENTIDADE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <select value={alerta ?? ''} onChange={(event) => onAlertaChange((event.target.value || undefined) as DocumentoAlerta | undefined)} className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500">
        <option value="">Todos os alertas</option>
        {Object.entries(DOCUMENTO_ALERTA_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>

      <input value={competencia ?? ''} onChange={(event) => onCompetenciaChange(event.target.value || undefined)} placeholder="Competência (YYYY-MM)" className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500" />
    </FilterBar>
  );
}
