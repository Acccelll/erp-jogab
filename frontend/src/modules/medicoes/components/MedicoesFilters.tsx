import { FilterBar } from '@/shared/components';
import {
  MEDICAO_APROVACAO_LABELS,
  MEDICAO_FATURAMENTO_LABELS,
  MEDICAO_STATUS_LABELS,
} from '../types';
import type {
  MedicaoAprovacaoStatus,
  MedicaoFaturamentoStatus,
  MedicaoStatus,
} from '../types';

interface MedicoesFiltersProps {
  search: string;
  status?: MedicaoStatus;
  aprovacaoStatus?: MedicaoAprovacaoStatus;
  faturamentoStatus?: MedicaoFaturamentoStatus;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: MedicaoStatus | undefined) => void;
  onAprovacaoStatusChange: (value: MedicaoAprovacaoStatus | undefined) => void;
  onFaturamentoStatusChange: (value: MedicaoFaturamentoStatus | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function MedicoesFilters({
  search,
  status,
  aprovacaoStatus,
  faturamentoStatus,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onAprovacaoStatusChange,
  onFaturamentoStatusChange,
  onCompetenciaChange,
  onClear,
}: MedicoesFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por medição, obra, contrato, cliente ou responsável"
        className="h-10 min-w-[260px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={status ?? ''}
        onChange={(event) => onStatusChange((event.target.value || undefined) as MedicaoStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os status</option>
        {Object.entries(MEDICAO_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={aprovacaoStatus ?? ''}
        onChange={(event) => onAprovacaoStatusChange((event.target.value || undefined) as MedicaoAprovacaoStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Toda aprovação</option>
        {Object.entries(MEDICAO_APROVACAO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={faturamentoStatus ?? ''}
        onChange={(event) => onFaturamentoStatusChange((event.target.value || undefined) as MedicaoFaturamentoStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todo faturamento</option>
        {Object.entries(MEDICAO_FATURAMENTO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
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
