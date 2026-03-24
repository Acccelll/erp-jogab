import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useFopagCompetencias, useFopagFilters } from '../hooks';
import { FopagCompetenciaCard, FopagFilters, FopagKpiBar } from '../components';

export function FopagListPage() {
  const { filters, setSearch, setStatus, setCompetencia, clearFilters, hasActiveFilters } = useFopagFilters();

  const { data, isLoading, isError, refetch } = useFopagCompetencias(filters);

  const competencias = data?.data ?? [];
  const kpis = data?.kpis;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="FOPAG"
        subtitle="Consolidação da folha prevista por competência, com leitura por funcionário, obra, eventos, rateio e integração futura com Financeiro."
        actions={
          <Link
            to="/fopag/2026-03"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <CalendarDays size={16} />
            Abrir competência atual
          </Link>
        }
      />

      <FopagFilters
        search={filters.search ?? ''}
        status={filters.status}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {kpis && <FopagKpiBar kpis={kpis} />}

      <MainContent>
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando competências...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar competências da FOPAG"
            description="Não foi possível carregar a lista de competências da folha prevista."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && competencias.length === 0 && (
          <EmptyState
            title="Nenhuma competência encontrada"
            description={
              hasActiveFilters
                ? 'Nenhuma competência corresponde aos filtros selecionados.'
                : 'Cadastre ou consolide a primeira competência para iniciar a FOPAG.'
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
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && competencias.length > 0 && (
          <div className="grid gap-4 xl:grid-cols-2">
            {competencias.map((competencia) => (
              <FopagCompetenciaCard key={competencia.id} competencia={competencia} />
            ))}
          </div>
        )}
      </MainContent>
    </div>
  );
}
