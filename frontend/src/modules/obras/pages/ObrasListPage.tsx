/**
 * ObrasListPage — Tela principal de listagem de obras.
 *
 * Padrão redesign: QuickFilterChips → Tabela densa
 */
import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { MainContent, EmptyState, QuickFilterChips, TableCellStack, PageHeader, BulkActionBar } from '@/shared/components';
import { useDrawerStore } from '@/shared/stores';
import { ObraMutationDrawerForm } from '../components/ObraMutationDrawerForm';
import { ObraStatusBadge } from '../components/ObraStatusBadge';
import { useObras } from '../hooks/useObras';
import { useObraFilters } from '../hooks/useObraFilters';
import { useBulkSelection } from '@/shared/hooks/useBulkSelection';
import { formatCurrency, cn } from '@/shared/lib/utils';
import { Link } from 'react-router-dom';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

export function ObrasListPage() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const { filters, setSearch, setStatus, setTipo, clearFilters, hasActiveFilters } = useObraFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError } = useObras(filters);

  const obras = data?.data ?? [];
  const {
    selectedIds,
    selectedCount,
    isSelected,
    toggleSelection,
    toggleAll,
    clearSelection,
    allSelected,
    someSelected,
  } = useBulkSelection(obras);
  const kpis = data?.kpis;

  const statusChips = useMemo<QuickFilterChip[]>(() => {
    if (!kpis) return [];
    return [
      { label: 'Todas', value: null, count: kpis.totalObras },
      { label: 'Em andamento', value: 'em_andamento', count: kpis.obrasAtivas, variant: 'info' },
      { label: 'Concluídas', value: 'concluida', count: kpis.obrasConcluidas, variant: 'success' },
      { label: 'Paralisadas', value: 'paralisada', count: kpis.obrasParalisadas, variant: 'danger' },
    ];
  }, [kpis]);

  const openCreateDrawer = () => {
    openDrawer({
      title: 'Nova obra',
      content: <ObraMutationDrawerForm />,
      width: '720px',
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      {/* Operational Header */}
      <PageHeader
        title="Obras"
        variant="operational"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface-muted px-2.5 py-1 text-sm focus-within:border-brand-primary focus-within:bg-surface transition-all">
              <Search size={14} className="text-text-subtle" />
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.search ?? ''}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 border-0 bg-transparent text-sm outline-none placeholder:text-text-subtle"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="rounded-md p-1.5 text-text-subtle hover:bg-surface-soft hover:text-text-muted"
            >
              <SlidersHorizontal size={16} />
            </button>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-hover active:transform active:scale-95 transition-all"
            >
              <Plus size={14} />
              Nova Obra
            </button>
          </div>
        }
      />

      {/* Primary Context Bar */}
      <div className="flex items-center border-b border-border-default bg-surface px-6 py-2">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-default/60 bg-surface-soft/30 px-4 py-2">
          <select
            value={filters.tipo ?? ''}
            onChange={(e) => setTipo((e.target.value || undefined) as typeof filters.tipo)}
            className="rounded-md border border-border-default bg-white px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Tipo</option>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="industrial">Industrial</option>
            <option value="infraestrutura">Infraestrutura</option>
            <option value="reforma">Reforma</option>
          </select>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-sm text-text-muted hover:text-text-body">
              Limpar
            </button>
          )}
        </div>
      )}

      <MainContent>
        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-border-light px-4 py-3">
                <div className="h-4 w-2/5 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar obras"
            description="Não foi possível carregar a lista de obras. Tente novamente."
            action={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && obras.length === 0 && (
          <EmptyState
            title="Nenhuma obra encontrada"
            description={
              hasActiveFilters
                ? 'Nenhuma obra corresponde aos filtros selecionados.'
                : 'Cadastre a primeira obra do sistema para começar.'
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                >
                  Limpar filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateDrawer}
                  className="flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
                >
                  <Plus size={16} />
                  Nova Obra
                </button>
              )
            }
          />
        )}

        {!isLoading && !isError && obras.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border-default/60">
                  <th className="w-10 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Nome</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Progresso</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-text-muted">Valor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-text-muted">Prazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {obras.map((obra) => (
                  <tr
                    key={obra.id}
                    className={cn(
                      'hover:bg-surface-soft/50 transition-colors',
                      isSelected(obra.id) && 'bg-brand-primary/[0.02]'
                    )}
                  >
                    <td className="px-4 py-1.5">
                      <input
                        type="checkbox"
                        checked={isSelected(obra.id)}
                        onChange={() => toggleSelection(obra.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </td>
                    <td className="px-4 py-1.5">
                      <Link to={`/obras/${obra.id}`}>
                        <TableCellStack
                          primary={obra.nome}
                          secondary={`${obra.cidade}/${obra.uf} · ${obra.responsavelNome}`}
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-1.5">
                      <ObraStatusBadge status={obra.status} />
                    </td>
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-soft">
                          <div
                            className="h-full rounded-full bg-jogab-700"
                            style={{ width: `${obra.percentualConcluido}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">{obra.percentualConcluido}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-1.5 text-right text-sm text-text-body">
                      {formatCurrency(obra.orcamentoPrevisto)}
                    </td>
                    <td className="px-4 py-1.5 text-xs text-text-muted">
                      {new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MainContent>

      <BulkActionBar
        selectedCount={selectedCount}
        onClear={clearSelection}
        actions={[
          {
            label: 'Concluir',
            icon: <CheckCircle2 size={16} />,
            onClick: () => {
              console.log('Concluindo obras:', selectedIds);
              clearSelection();
            },
            variant: 'success',
          },
          {
            label: 'Exportar',
            icon: <Download size={16} />,
            onClick: () => {
              console.log('Exportando obras:', selectedIds);
              clearSelection();
            },
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={16} />,
            onClick: () => {
              if (confirm(`Deseja excluir ${selectedCount} obra(s) selecionada(s)?`)) {
                console.log('Excluindo obras:', selectedIds);
                clearSelection();
              }
            },
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
}
