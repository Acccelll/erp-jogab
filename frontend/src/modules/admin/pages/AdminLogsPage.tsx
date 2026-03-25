import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useLogs, useAdminFilters } from '../hooks';
import { AdminTable } from '../components';
import { EmptyState, MainContent } from '@/shared/components';
import { ADMIN_STATUS_LABELS } from '../types';
import type { AdminStatus } from '../types';

export function AdminLogsPage() {
  const { filters, setSearch, setStatus, clearFilters, hasActiveFilters } = useAdminFilters();
  const { data, isLoading, isError, refetch } = useLogs(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact technical filter bar */}
      <div className="flex items-center gap-2 border-b border-border-default px-4 py-2">
        <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm">
          <Search size={14} className="text-text-subtle" />
          <input
            type="text"
            placeholder="Buscar por usuário, ação, módulo..."
            value={filters.search ?? ''}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 border-0 bg-transparent text-sm outline-none placeholder:text-text-subtle"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="rounded-md p-1.5 text-text-subtle hover:bg-surface-soft hover:text-text-muted"
        >
          <SlidersHorizontal size={16} />
        </button>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="text-xs text-text-muted hover:text-text-body">
            Limpar
          </button>
        )}
        <span className="ml-auto text-xs tabular-nums text-text-subtle">
          {items.length} registro{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-light bg-surface-muted px-4 py-2">
          <select
            value={filters.status ?? ''}
            onChange={(e) => setStatus((e.target.value || undefined) as AdminStatus | undefined)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Status</option>
            {Object.entries(ADMIN_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <MainContent>
        {isLoading && (
          <div className="space-y-0">
            <p className="sr-only">Carregando logs...</p>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-border-light px-4 py-2.5">
                <div className="h-3.5 w-1/5 animate-pulse rounded bg-neutral-200" />
                <div className="h-3.5 w-1/5 animate-pulse rounded bg-neutral-200" />
                <div className="h-3.5 w-1/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-3.5 w-1/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-3.5 w-1/6 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar logs"
            description="Não foi possível carregar os logs administrativos."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <AdminTable
            category="logs"
            columns={['Usuário', 'Ação', 'Módulo', 'Entidade', 'Data', 'Status']}
            rows={items.map((item) => [
              item.usuarioNome,
              item.acao,
              item.modulo,
              item.entidade,
              item.data,
              item.status,
            ])}
          />
        )}
      </MainContent>
    </div>
  );
}
