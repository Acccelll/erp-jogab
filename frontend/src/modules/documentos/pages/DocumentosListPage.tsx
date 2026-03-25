import { FolderOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useDocumentos, useDocumentosFilters } from '../hooks';
import {
  DocumentosFilters,
  DocumentosKpiBar,
  DocumentosOverview,
  DocumentosResumoCard,
  DocumentosTable,
} from '../components';

export function DocumentosListPage() {
  const {
    filters,
    setSearch,
    setStatus,
    setTipo,
    setEntidade,
    setAlerta,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useDocumentosFilters();

  const { data, isLoading, isError, refetch } = useDocumentos(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Documentos"
        subtitle="Gestão documental vinculada a Obras, RH, Fornecedores, Contratos e controle de vencimentos."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/obras"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
            >
              <FolderOpen size={16} />
              Obras
            </Link>
            <Link
              to="/rh/funcionarios"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
            >
              <Users size={16} />
              Funcionários
            </Link>
          </div>
        }
      />

      <DocumentosFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        entidade={filters.entidade}
        alerta={filters.alerta}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onEntidadeChange={setEntidade}
        onAlertaChange={setAlerta}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      {data?.kpis && <DocumentosKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-text-muted">Carregando visão documental...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar documentos"
            description="Não foi possível montar a visão principal de documentos, status e vencimentos."
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

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <DocumentosResumoCard key={card.id} card={card} />
              ))}
            </section>

            <DocumentosOverview statusItems={data.statusResumo} vencimentoItems={data.vencimentoResumo} />

            {(data.documentos?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhum documento encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum documento corresponde aos filtros selecionados.'
                    : 'Ainda não há documentos disponíveis para o contexto atual.'
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
                  ) : undefined
                }
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-strong">Lista principal de documentos</h2>
                  <p className="text-sm text-text-muted">
                    Documentos vinculados a obras, funcionários, fornecedores, contratos e empresa com leitura de
                    vencimentos.
                  </p>
                </div>
                <DocumentosTable items={data.documentos} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
