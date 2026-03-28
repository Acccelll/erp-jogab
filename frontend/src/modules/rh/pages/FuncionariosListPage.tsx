/**
 * FuncionariosListPage — Tela principal de listagem de funcionários.
 *
 * Padrão redesign: QuickFilterChips → Tabela densa
 */
import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Trash2, Download, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
import { FuncionarioStatusBadge } from '../components/FuncionarioStatusBadge';
import { FuncionarioMutationDrawerForm } from '../components/FuncionarioMutationDrawerForm';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { useFuncionarioFilters } from '../hooks/useFuncionarioFilters';
import {
  deleteFuncionarios,
  bulkUpdateFuncionarioStatus,
  restoreFuncionario,
} from '../services/funcionarios.service';
import { useBulkSelection } from '@/shared/hooks/useBulkSelection';
import { type ApiError } from '@/shared/lib/api';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

const DEFAULT_FUNC_COLUMNS: ColumnPreference[] = [
  { id: 'nome', label: 'Nome', visible: true },
  { id: 'cargo', label: 'Cargo', visible: true },
  { id: 'obra', label: 'Obra', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'matricula', label: 'Matrícula', visible: false },
  { id: 'departamento', label: 'Departamento', visible: false },
  { id: 'tipoContrato', label: 'Contrato', visible: false },
  { id: 'dataAdmissao', label: 'Admissão', visible: false },
];

export function FuncionariosListPage() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const queryClient = useQueryClient();
  const { filters, setSearch, setStatus, setTipoContrato, setFilters, clearFilters, hasActiveFilters } =
    useFuncionarioFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError, error, refetch } = useFuncionarios(filters);
  const columnsPref = usePreferencesStore((state) => state.columns['funcionarios'] || DEFAULT_FUNC_COLUMNS);

  const funcionarios = data?.data ?? [];
  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    toggleAll,
    clearSelection,
    allSelected,
    someSelected,
  } = useBulkSelection(funcionarios);
  const kpis = data?.kpis;

  const statusChips = useMemo<QuickFilterChip[]>(() => {
    if (!kpis) return [];
    return [
      { label: 'Todos', value: null, count: kpis.totalFuncionarios },
      { label: 'Ativos', value: 'ativo', count: kpis.ativos, variant: 'success' },
      { label: 'Afastados', value: 'afastado', count: kpis.afastados, variant: 'warning' },
      { label: 'Férias', value: 'ferias', count: kpis.ferias, variant: 'info' },
      { label: 'Desligados', value: 'desligado', count: kpis.desligados, variant: 'danger' },
    ];
  }, [kpis]);

  const openCreateDrawer = () => {
    openDrawer({
      title: 'Novo funcionário',
      content: <FuncionarioMutationDrawerForm />,
      width: '760px',
    });
  };

  const openColumnManager = () => {
    openDrawer({
      title: 'Configurar colunas',
      content: (
        <ColumnManager
          moduleId="funcionarios"
          defaultColumns={DEFAULT_FUNC_COLUMNS}
          onClose={() => useDrawerStore.getState().closeDrawer()}
        />
      ),
      width: '420px',
    });
  };

  const visibleColumns = columnsPref.filter((c) => c.visible);

  return (
    <div className="flex flex-1 flex-col bg-surface-secondary">
      {/* Operational Header with standard PageHeader component */}
      <PageHeader
        title="Funcionários"
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
              title="Filtros avançados"
            >
              <SlidersHorizontal size={16} />
            </button>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-hover active:transform active:scale-95 transition-all"
            >
              <Plus size={14} />
              Novo Funcionário
            </button>
          </div>
        }
      />

      {/* Primary Context / Filter Bar */}
      <div className="flex items-center justify-between border-b border-border-default bg-surface px-6 py-2">
        <div className="flex items-center gap-4">
          <QuickFilterChips
            chips={statusChips}
            value={filters.status ?? null}
            onChange={(v) => setStatus(v as typeof filters.status)}
          />
          <div className="h-4 w-px bg-border-default" />
          <SavedFilters moduleId="funcionarios" currentFilters={filters} onApply={setFilters} />
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
        <div className="flex items-center gap-2 border-b border-border-light bg-surface-muted px-4 py-2">
          <select
            value={filters.tipoContrato ?? ''}
            onChange={(e) => setTipoContrato((e.target.value || undefined) as typeof filters.tipoContrato)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Tipo contrato</option>
            <option value="clt">CLT</option>
            <option value="pj">PJ</option>
            <option value="temporario">Temporário</option>
            <option value="estagio">Estágio</option>
            <option value="aprendiz">Aprendiz</option>
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

        {!isLoading && !isError && data && funcionarios.length === 0 && (
          <EmptyState
            title="Nenhum funcionário encontrado"
            description={
              hasActiveFilters
                ? 'Nenhum funcionário corresponde aos filtros selecionados.'
                : 'Cadastre o primeiro funcionário para começar.'
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                >
                  Limpar filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateDrawer}
                  className="flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
                >
                  <Plus size={16} />
                  Novo Funcionário
                </button>
              )
            }
          />
        )}

        {!isLoading && !isError && funcionarios.length > 0 && (
          <div className="h-[600px]">
            <VirtualizedTable
              data={funcionarios}
              selectedIds={selectedIds}
              onSelectRow={toggleSelection}
              onSelectAll={toggleAll}
              allSelected={allSelected}
              someSelected={someSelected}
              columns={visibleColumns.map((col) => ({
                key: col.id,
                header: col.label,
                width: col.id === 'nome' ? '30%' : '15%',
                render: (val, func) => {
                  if (col.id === 'nome') {
                    return (
                      <Link to={`/rh/funcionarios/${func.id}`}>
                        <TableCellStack
                          primary={func.nome}
                          secondary={`${func.matricula} · ${func.departamento}`}
                        />
                      </Link>
                    );
                  }
                  if (col.id === 'status') {
                    return <FuncionarioStatusBadge status={func.status} />;
                  }
                  if (col.id === 'obra') {
                    return func.obraAlocadoNome ?? '—';
                  }
                  if (col.id === 'dataAdmissao') {
                    return new Date(func.dataAdmissao).toLocaleDateString('pt-BR');
                  }
                  if (col.id === 'tipoContrato') {
                    return <span className="uppercase">{func.tipoContrato}</span>;
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
            label: 'Ativar',
            icon: <UserCheck size={16} />,
            onClick: async () => {
              try {
                const { message } = await bulkUpdateFuncionarioStatus(selectedIds, 'ativo');
                await queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
                toast.success(message);
                clearSelection();
              } catch (error: any) {
                toast.error(error.message || 'Erro ao ativar funcionários');
              }
            },
            variant: 'success',
          },
          {
            label: 'Exportar',
            icon: <Download size={16} />,
            onClick: () => {
              toast.info('Exportação em desenvolvimento');
              clearSelection();
            },
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={16} />,
            onClick: async () => {
              const idsToDelete = [...selectedIds];
              const itemsToDelete = funcionarios.filter((f) => idsToDelete.includes(f.id));

              try {
                const { message } = await deleteFuncionarios(idsToDelete);
                await queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
                clearSelection();

                toast.success(message, {
                  action: {
                    label: 'Desfazer',
                    onClick: async () => {
                      try {
                        for (const item of itemsToDelete) {
                          await restoreFuncionario(item as any);
                        }
                        await queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
                        toast.success('Exclusão desfeita com sucesso.');
                      } catch (err: any) {
                        toast.error('Erro ao desfazer exclusão.');
                      }
                    },
                  },
                });
              } catch (error: any) {
                toast.error(error.message || 'Erro ao excluir funcionários');
              }
            },
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
}
