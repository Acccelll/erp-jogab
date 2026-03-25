import { Link } from 'react-router-dom';
import { KeyRound, Users } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useAdmin, useAdminFilters } from '../hooks';
import { AdminCategoriaCard, AdminFilters, AdminResumoBar } from '../components';

export function AdminPage() {
  const { filters, setSearch, setCategoria, setStatus, setCompetencia, clearFilters, hasActiveFilters } =
    useAdminFilters();
  const { data, isLoading, isError, refetch } = useAdmin(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Administração"
        subtitle="Governança do ERP com usuários, perfis, permissões, parâmetros, logs e integrações."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/usuarios"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
            >
              <Users size={16} />
              Usuários
            </Link>
            <Link
              to="/admin/permissoes"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
            >
              <KeyRound size={16} />
              Permissões
            </Link>
          </div>
        }
      />

      <AdminFilters
        search={filters.search ?? ''}
        categoria={filters.categoria}
        status={filters.status}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onStatusChange={setStatus}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      {data?.resumo && <AdminResumoBar resumo={data.resumo} />}

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando administração...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar administração"
            description="Não foi possível carregar a visão principal de governança."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading &&
          !isError &&
          data &&
          ((data.categorias?.length ?? 0) ? (
            <section className="grid gap-4 xl:grid-cols-3">
              {data.categorias.map((item) => (
                <AdminCategoriaCard key={item.categoria} item={item} />
              ))}
            </section>
          ) : (
            <EmptyState
              title="Nenhuma categoria encontrada"
              description="Não há categorias de administração disponíveis para os filtros atuais."
            />
          ))}
      </MainContent>
    </div>
  );
}
