import { FilterBar } from '@/shared/components';
import {
  FISCAL_DOCUMENTO_TIPO_LABELS,
  FISCAL_INTEGRACAO_STATUS_LABELS,
  FISCAL_STATUS_LABELS,
  FISCAL_TIPO_OPERACAO_LABELS,
} from '../types';
import type {
  FiscalDocumentoTipo,
  FiscalIntegracaoStatus,
  FiscalStatus,
  FiscalTipoOperacao,
} from '../types';

interface FiscalFiltersProps {
  search: string;
  tipoOperacao?: FiscalTipoOperacao;
  documentoTipo?: FiscalDocumentoTipo;
  status?: FiscalStatus;
  estoqueStatus?: FiscalIntegracaoStatus;
  financeiroStatus?: FiscalIntegracaoStatus;
  competencia?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTipoOperacaoChange: (value: FiscalTipoOperacao | undefined) => void;
  onDocumentoTipoChange: (value: FiscalDocumentoTipo | undefined) => void;
  onStatusChange: (value: FiscalStatus | undefined) => void;
  onEstoqueStatusChange: (value: FiscalIntegracaoStatus | undefined) => void;
  onFinanceiroStatusChange: (value: FiscalIntegracaoStatus | undefined) => void;
  onCompetenciaChange: (value: string | undefined) => void;
  onClear: () => void;
}

export function FiscalFilters({
  search,
  tipoOperacao,
  documentoTipo,
  status,
  estoqueStatus,
  financeiroStatus,
  competencia,
  hasActiveFilters,
  onSearchChange,
  onTipoOperacaoChange,
  onDocumentoTipoChange,
  onStatusChange,
  onEstoqueStatusChange,
  onFinanceiroStatusChange,
  onCompetenciaChange,
  onClear,
}: FiscalFiltersProps) {
  return (
    <FilterBar onClear={hasActiveFilters ? onClear : undefined}>
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por documento, emitente, destinatário, obra, compra ou título financeiro"
        className="h-10 min-w-[280px] flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      />

      <select
        value={tipoOperacao ?? ''}
        onChange={(event) => onTipoOperacaoChange((event.target.value || undefined) as FiscalTipoOperacao | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todas as operações</option>
        {Object.entries(FISCAL_TIPO_OPERACAO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={documentoTipo ?? ''}
        onChange={(event) => onDocumentoTipoChange((event.target.value || undefined) as FiscalDocumentoTipo | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(FISCAL_DOCUMENTO_TIPO_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={status ?? ''}
        onChange={(event) => onStatusChange((event.target.value || undefined) as FiscalStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Todos os status fiscais</option>
        {Object.entries(FISCAL_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={estoqueStatus ?? ''}
        onChange={(event) => onEstoqueStatusChange((event.target.value || undefined) as FiscalIntegracaoStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Integração estoque</option>
        {Object.entries(FISCAL_INTEGRACAO_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={financeiroStatus ?? ''}
        onChange={(event) => onFinanceiroStatusChange((event.target.value || undefined) as FiscalIntegracaoStatus | undefined)}
        className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none transition-colors focus:border-jogab-500"
      >
        <option value="">Integração financeiro</option>
        {Object.entries(FISCAL_INTEGRACAO_STATUS_LABELS).map(([value, label]) => (
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
