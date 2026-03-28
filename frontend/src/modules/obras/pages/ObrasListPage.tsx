/**
 * ObrasListPage — Tela principal de listagem de obras.
 *
 * Padrão redesign: QuickFilterChips → Tabela densa
 */
import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  MainContent,
  EmptyState,
  QuickFilterChips,
  TableCellStack,
  PageHeader,
  BulkActionBar,
  ColumnManager,
  SavedFilters,
  TableSkeleton,
  ErrorStateView,
  VirtualizedTable,
} from '@/shared/components';
import { useDrawerStore, usePreferencesStore } from '@/shared/stores';
import type { ColumnPreference } from '@/shared/stores/preferencesStore';
import { ObraMutationDrawerForm } from '../components/ObraMutationDrawerForm';
import { ObraStatusBadge } from '../components/ObraStatusBadge';
import { useObras } from '../hooks/useObras';
import { useObraFilters } from '../hooks/useObraFilters';
import { deleteObras, bulkUpdateObraStatus, restoreObra } from '../services/obras.service';
import { useBulkSelection } from '@/shared/hooks/useBulkSelection';
import { formatCurrency } from '@/shared/lib/utils';
import { type ApiError } from '@/shared/lib/api';
import { Link } from 'react-router-dom';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

const DEFAULT_OBRA_COLUMNS: ColumnPreference[] = [
  { id: 'nome', label: 'Nome', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'progresso', label: 'Progresso', visible: true },
  { id: 'valor', label: 'Valor', visible: true },
  { id: 'prazo', label: 'Prazo', visible: true },
  { id: 'responsavel', label: 'Responsável', visible: false },
  { id: 'cidade', label: 'Cidade/UF', visible: false },
  { id: 'tipo', label: 'Tipo', visible: false },
];

export function ObrasListPage() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const queryClient = useQueryClient();
  const { filters, setSearch, setStatus, setTipo, setFilters, clearFilters, hasActiveFilters } = useObraFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError, error, refetch } = useObras(filters);
  const columnsPref = usePreferencesStore((state) => state.columns['obras'] || DEFAULT_OBRA_COLUMNS);

  const obras = data?.data ?? [];
  const {
    selectedIds,
    selectedCount,
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

  const openColumnManager = () => {
    openDrawer({
      title: 'Configurar colunas',
      content: (
        <ColumnManager
          moduleId="obras"
          defaultColumns={DEFAULT_OBRA_COLUMNS}
          onClose={() => useDrawerStore.getState().closeDrawer()}
        />
      ),
      width: '420px',
    });
  };

  const visibleColumns = columnsPref.filter((c) => c.visible);

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
      <div className="flex items-center justify-between border-b border-border-default bg-surface px-6 py-2">
        <div className="flex items-center gap-4">
          <QuickFilterChips
            chips={statusChips}
            value={filters.status ?? null}
            onChange={(v) => setStatus(v as typeof filters.status)}
          />
          <div className="h-4 w-px bg-border-default" />
          <SavedFilters moduleId="obras" currentFilters={filters} onApply={setFilters} />
        </div>

        <button
          type="button"
          onClick={openColumnManager}
          className="flex items-center gap-1.5 rounded-md border border-border-default px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-surface-soft hover:text-text-body transition-all"
        >
          <SlidersHorizontal size={14} />
          Colunas
        </button>
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
        {isLoading && <TableSkeleton rows={8} cols={visibleColumns.length + 1} />}

        {isError && (
          <ErrorStateView
            type={(error as ApiError)?.type}
            status={(error as ApiError)?.status}
            onRetry={() => void refetch()}
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
          <div className="h-[600px]">
            <VirtualizedTable
              data={obras}
              selectedIds={selectedIds}
              onSelectRow={toggleSelection}
              onSelectAll={toggleAll}
              allSelected={allSelected}
              someSelected={someSelected}
              columns={visibleColumns.map((col) => ({
                key: col.id,
                header: col.label,
                width: col.id === 'nome' ? '30%' : '15%',
                render: (val, obra) => {
                  if (col.id === 'nome') {
                    return (
                      <Link to={`/obras/${obra.id}`}>
                        <TableCellStack
                          primary={obra.nome}
                          secondary={`${obra.cidade}/${obra.uf} · ${obra.responsavelNome}`}
                        />
                      </Link>
                    );
                  }
                  if (col.id === 'status') {
                    return <ObraStatusBadge status={obra.status} />;
                  }
                  if (col.id === 'progresso') {
                    return (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-soft">
                          <div
                            className="h-full rounded-full bg-jogab-700"
                            style={{ width: `${obra.percentualConcluido}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">{obra.percentualConcluido}%</span>
                      </div>
                    );
                  }
                  if (col.id === 'valor') {
                    return (
                      <div className="text-right tabular-nums">
                        {formatCurrency(obra.orcamentoPrevisto)}
                      </div>
                    );
                  }
                  if (col.id === 'prazo') {
                    return new Date(obra.dataPrevisaoFim).toLocaleDateString('pt-BR');
                  }
                  return val;
                },
              }))}
            />
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
            onClick: async () => {
              try {
                const { message } = await bulkUpdateObraStatus(selectedIds, 'concluida');
                await queryClient.invalidateQueries({ queryKey: ['obras'] });
                toast.success(message);
                clearSelection();
              } catch (error: any) {
                toast.error(error.message || 'Erro ao concluir obras');
              }
            },
            variant: 'success',
          },
          {
            label: 'Exportar',
            icon: <Download size={16} />,
            onClick: () => {
              toast.info('Funcionalidade de exportação em desenvolvimento');
              clearSelection();
            },
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={16} />,
            onClick: async () => {
              const idsToDelete = [...selectedIds];
              const itemsToDelete = obras.filter((o) => idsToDelete.includes(o.id));

              try {
                const { message } = await deleteObras(idsToDelete);
                await queryClient.invalidateQueries({ queryKey: ['obras'] });
                clearSelection();

                toast.success(message, {
                  action: {
                    label: 'Desfazer',
                    onClick: async () => {
                      try {
                        for (const item of itemsToDelete) {
                          // Note: In a real app we'd use a bulk restore endpoint
                          await restoreObra(item as any);
                        }
                        await queryClient.invalidateQueries({ queryKey: ['obras'] });
                        toast.success('Exclusão desfeita com sucesso.');
                      } catch (err: any) {
                        toast.error('Erro ao desfazer exclusão.');
                      }
                    },
                  },
                });
              } catch (error: any) {
                toast.error(error.message || 'Erro ao excluir obras');
              }
            },
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
}
