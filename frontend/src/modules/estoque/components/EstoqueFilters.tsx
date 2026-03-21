import { FilterBar } from '@/shared/components';
import { ESTOQUE_MOVIMENTACAO_TIPO_LABELS, ESTOQUE_STATUS_LABELS, ESTOQUE_TIPO_LABELS } from '../types';
import type { EstoqueMovimentacaoTipo, EstoqueStatus, EstoqueTipoItem } from '../types';

interface EstoqueFiltersProps {
  search: string;
  status?: EstoqueStatus;
  tipo?: EstoqueTipoItem;
  localId?: string;
  competencia?: string;
  movimentacaoTipo?: EstoqueMovimentacaoTipo;
  hasActiveFilters: boolean;
  showMovimentacaoTipo?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EstoqueStatus | undefined) => void;
  onTipoChange: (value: EstoqueTipoItem | undefined) => void;
  onLocalIdChange: (value: string | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onMovimentacaoTipoChange: (value: EstoqueMovimentacaoTipo | undefined) => void;
  onClear: () => void;
}

const localOptions = [
  { value: 'almox-1', label: 'Almoxarifado Central SP' },
  { value: 'almox-2', label: 'Base Operacional BR-101' },
  { value: 'almox-3', label: 'Almoxarifado Parque' },
];

export function EstoqueFilters({
  search,
  status,
  tipo,
  localId,
  competencia,
  movimentacaoTipo,
  hasActiveFilters,
  showMovimentacaoTipo = false,
  onSearchChange,
  onStatusChange,
  onTipoChange,
  onLocalIdChange,
  onCompetenciaChange,
  onMovimentacaoTipoChange,
  onClear,
}: EstoqueFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por item, obra, almoxarifado, documento ou pedido"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={status ?? ''}
        onChange={(event) => onStatusChange((event.target.value || undefined) as EstoqueStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(ESTOQUE_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={tipo ?? ''}
        onChange={(event) => onTipoChange((event.target.value || undefined) as EstoqueTipoItem | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(ESTOQUE_TIPO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={localId ?? ''}
        onChange={(event) => onLocalIdChange(event.target.value || undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os locais</option>
        {localOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {showMovimentacaoTipo && (
        <select
          value={movimentacaoTipo ?? ''}
          onChange={(event) => onMovimentacaoTipoChange((event.target.value || undefined) as EstoqueMovimentacaoTipo | undefined)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
        >
          <option value="">Todas as movimentações</option>
          {Object.entries(ESTOQUE_MOVIMENTACAO_TIPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      )}

      <input
        value={competencia ?? ''}
        onChange={(event) => onCompetenciaChange(event.target.value || undefined)}
        placeholder="Competência (YYYY-MM)"
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />
    </FilterBar>
  );
}
