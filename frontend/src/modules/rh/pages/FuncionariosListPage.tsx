/**
 * FuncionariosListPage — Tela principal de listagem de funcionários.
 *
 * Padrão redesign: QuickFilterChips → Tabela densa
 */
import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Trash2, Download, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainContent, EmptyState, QuickFilterChips, TableCellStack, PageHeader, BulkActionBar } from '@/shared/components';
import { useDrawerStore } from '@/shared/stores';
import { FuncionarioStatusBadge } from '../components/FuncionarioStatusBadge';
import { FuncionarioMutationDrawerForm } from '../components/FuncionarioMutationDrawerForm';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { useFuncionarioFilters } from '../hooks/useFuncionarioFilters';
import { useBulkSelection } from '@/shared/hooks/useBulkSelection';
import { cn } from '@/shared/lib/utils';
import type { QuickFilterChip } from '@/shared/components/QuickFilterChips';

export function FuncionariosListPage() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const { filters, setSearch, setStatus, setTipoContrato, clearFilters, hasActiveFilters } = useFuncionarioFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading, isError } = useFuncionarios(filters);

  const funcionarios = data?.data ?? [];
  const {
    selectedIds,
    selectedCount,
    isSelected,
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
      <div className="flex items-center border-b border-border-default bg-surface px-6 py-2">
        <QuickFilterChips
          chips={statusChips}
          value={filters.status ?? null}
          onChange={(v) => setStatus(v as typeof filters.status)}
        />
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
            title="Erro ao carregar funcionários"
            description="Não foi possível carregar a lista de funcionários. Tente novamente."
            action={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border-default bg-surface-muted">
                  <th className="w-10 px-4 py-1.5">
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
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-text-muted">Nome</th>
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-text-muted">Cargo</th>
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-text-muted">Obra</th>
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {funcionarios.map((func) => (
                  <tr
                    key={func.id}
                    className={cn(
                      'hover:bg-surface-soft transition-colors',
                      isSelected(func.id) && 'bg-brand-primary/[0.02]'
                    )}
                  >
                    <td className="px-4 py-1.5">
                      <input
                        type="checkbox"
                        checked={isSelected(func.id)}
                        onChange={() => toggleSelection(func.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </td>
                    <td className="px-4 py-1.5">
                      <Link to={`/rh/funcionarios/${func.id}`}>
                        <TableCellStack primary={func.nome} secondary={`${func.matricula} · ${func.departamento}`} />
                      </Link>
                    </td>
                    <td className="px-4 py-1.5 text-sm text-text-body">{func.cargo}</td>
                    <td className="px-4 py-1.5 text-sm text-text-muted">{func.obraAlocadoNome ?? '—'}</td>
                    <td className="px-4 py-1.5">
                      <FuncionarioStatusBadge status={func.status} />
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
            label: 'Ativar',
            icon: <UserCheck size={16} />,
            onClick: () => {
              console.log('Ativando funcionários:', selectedIds);
              clearSelection();
            },
            variant: 'success',
          },
          {
            label: 'Exportar',
            icon: <Download size={16} />,
            onClick: () => {
              console.log('Exportando funcionários:', selectedIds);
              clearSelection();
            },
          },
          {
            label: 'Excluir',
            icon: <Trash2 size={16} />,
            onClick: () => {
              if (confirm(`Deseja excluir ${selectedCount} funcionário(s) selecionado(s)?`)) {
                console.log('Excluindo funcionários:', selectedIds);
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
