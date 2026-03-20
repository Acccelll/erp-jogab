/**
 * FuncionarioFilters — barra de filtros específica do módulo RH.
 * Usa o FilterBar compartilhado e conecta com o hook useFuncionarioFilters.
 */
import { Search } from 'lucide-react';
import { FilterBar } from '@/shared/components';
import { FUNCIONARIO_STATUS_LABELS, TIPO_CONTRATO_LABELS } from '../types';
import type { FuncionarioStatus, TipoContrato } from '../types';

interface FuncionarioFiltersProps {
  search: string;
  status: FuncionarioStatus | undefined;
  tipoContrato: TipoContrato | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: FuncionarioStatus | undefined) => void;
  onTipoContratoChange: (value: TipoContrato | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FuncionarioFilters({
  search,
  status,
  tipoContrato,
  onSearchChange,
  onStatusChange,
  onTipoContratoChange,
  onClear,
  hasActiveFilters,
}: FuncionarioFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      {/* Busca textual */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar funcionário..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-56 rounded-md border border-gray-200 bg-white pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
        />
      </div>

      {/* Status */}
      <select
        value={status ?? ''}
        onChange={(e) => onStatusChange((e.target.value || undefined) as FuncionarioStatus | undefined)}
        className="h-8 rounded-md border border-gray-200 bg-white px-2 pr-7 text-sm text-gray-700 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(FUNCIONARIO_STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      {/* Tipo Contrato */}
      <select
        value={tipoContrato ?? ''}
        onChange={(e) => onTipoContratoChange((e.target.value || undefined) as TipoContrato | undefined)}
        className="h-8 rounded-md border border-gray-200 bg-white px-2 pr-7 text-sm text-gray-700 focus:border-jogab-500 focus:outline-none focus:ring-1 focus:ring-jogab-500"
      >
        <option value="">Todos os contratos</option>
        {Object.entries(TIPO_CONTRATO_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </FilterBar>
  );
}
