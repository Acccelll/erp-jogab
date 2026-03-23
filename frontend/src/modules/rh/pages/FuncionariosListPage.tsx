/**
 * FuncionariosListPage — Tela principal de listagem de funcionários.
 *
 * Segue o padrão de tela obrigatório:
 *   PageHeader → FilterBar → KPISection → MainContent
 *
 * Referência: CLAUDE.md "Padrão de tela obrigatório", docs/06
 */
import { Plus } from 'lucide-react';
import { PageHeader, MainContent, EmptyState } from '@/shared/components';
import { useDrawerStore } from '@/shared/stores';
import { FuncionarioKpiBar } from '../components/FuncionarioKpiBar';
import { FuncionarioFilters } from '../components/FuncionarioFilters';
import { FuncionarioCard } from '../components/FuncionarioCard';
import { FuncionarioMutationDrawerForm } from '../components/FuncionarioMutationDrawerForm';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { useFuncionarioFilters } from '../hooks/useFuncionarioFilters';

export function FuncionariosListPage() {
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const {
    filters,
    setSearch,
    setStatus,
    setTipoContrato,
    clearFilters,
    hasActiveFilters,
  } = useFuncionarioFilters();

  const { data, isLoading, isError } = useFuncionarios(filters);

  const openCreateDrawer = () => {
    openDrawer({
      title: 'Novo funcionário',
      content: <FuncionarioMutationDrawerForm />,
      width: '760px',
    });
  };

  const openEditDrawer = (funcionarioId: string) => {
    openDrawer({
      title: 'Editar funcionário',
      content: <FuncionarioMutationDrawerForm funcionarioId={funcionarioId} />,
      width: '760px',
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Funcionários"
        subtitle="Gestão de funcionários, alocações e vínculos trabalhistas"
        actions={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-jogab-600"
          >
            <Plus size={16} />
            Novo Funcionário
          </button>
        }
      />

      <FuncionarioFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipoContrato={filters.tipoContrato}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoContratoChange={setTipoContrato}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <FuncionarioKpiBar kpis={data.kpis} />}

      <MainContent>
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando funcionários...</p>
            </div>
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
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
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
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Limpar filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateDrawer}
                  className="flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
                >
                  <Plus size={16} />
                  Novo Funcionário
                </button>
              )
            }
          />
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((func) => (
              <FuncionarioCard key={func.id} funcionario={func} onEdit={openEditDrawer} />
            ))}
          </div>
        )}
      </MainContent>
    </div>
  );
}
