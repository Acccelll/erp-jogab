import { Link } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useFiscal, useFiscalFilters } from '../hooks';
import { DocumentosFiscaisTable, FiscalFilters, FiscalKpiBar, FiscalOverviewCards, FiscalResumoCard } from '../components';

export function FiscalListPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setFluxo,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useFiscalFilters();

  const { data, isLoading, isError, refetch } = useFiscal(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal"
        subtitle="Documentos fiscais de entrada e saída com integração conceitual a Compras, Obra e Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/fiscal/entradas"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowDownCircle size={16} />
              Entradas
            </Link>
            <Link
              to="/fiscal/saidas"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <ArrowUpCircle size={16} />
              Saídas
            </Link>
          </div>
        }
      />

      <FiscalFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        fluxo={filters.fluxo}
        competencia={filters.competencia}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onFluxoChange={setFluxo}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <FiscalKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando visão fiscal...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar Fiscal"
            description="Não foi possível montar a visão consolidada de documentos fiscais."
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

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <FiscalResumoCard key={card.id} card={card} />
              ))}
            </section>

            <FiscalOverviewCards statusItems={data.statusResumo} tipoItems={data.tipoResumo} />

            {data.documentos.length === 0 ? (
              <EmptyState
                title="Nenhum documento fiscal encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum documento corresponde aos filtros selecionados.'
                    : 'Cadastre ou integre o primeiro documento fiscal para iniciar a operação do módulo.'
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
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Documentos recentes</h2>
                  <p className="text-sm text-gray-500">Leitura inicial da escrituração fiscal conectada a compras, faturamento e financeiro.</p>
                </div>
                <DocumentosFiscaisTable items={data.documentos} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
