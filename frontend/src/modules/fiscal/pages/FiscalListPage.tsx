import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader, TableSkeleton, CardSkeleton, ErrorStateView } from '@/shared/components';
import { type ApiError } from '@/shared/lib/api';
import { useFiscal, useFiscalFilters } from '../hooks';
import { FiscalFilters, FiscalKpiBar, FiscalResumoCard, FiscalTable } from '../components';

export function FiscalListPage() {
  const {
    filters,
    setSearch,
    setTipoOperacao,
    setDocumentoTipo,
    setStatus,
    setEstoqueStatus,
    setFinanceiroStatus,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useFiscalFilters();
  const { data, isLoading, isError, refetch } = useFiscal(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal"
        subtitle="Gestão fiscal de entradas e saídas com reflexo em Compras, Estoque, Obra e Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/fiscal/entradas"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
            >
              <ArrowDownToLine size={16} />
              Entradas
            </Link>
            <Link
              to="/fiscal/saidas"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
            >
              <ArrowUpFromLine size={16} />
              Saídas
            </Link>
          </div>
        }
      />

      <FiscalFilters
        search={filters.search ?? ''}
        tipoOperacao={filters.tipoOperacao}
        documentoTipo={filters.documentoTipo}
        status={filters.status}
        estoqueStatus={filters.estoqueStatus}
        financeiroStatus={filters.financeiroStatus}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onTipoOperacaoChange={setTipoOperacao}
        onDocumentoTipoChange={setDocumentoTipo}
        onStatusChange={setStatus}
        onEstoqueStatusChange={setEstoqueStatus}
        onFinanceiroStatusChange={setFinanceiroStatus}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      {data?.kpis && <FiscalKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-3">
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
              <CardSkeleton rows={2} />
            </div>
            <TableSkeleton rows={8} cols={6} />
          </div>
        )}

        {isError && (
          <ErrorStateView
            type={(data as unknown as ApiError)?.type ?? 'unknown'}
            status={(data as unknown as ApiError)?.status}
            onRetry={() => void refetch()}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <FiscalResumoCard key={card.id} card={card} />
              ))}
            </section>

            {(data.documentos?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhum documento fiscal encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum documento fiscal corresponde aos filtros selecionados.'
                    : 'Ainda não há documentos fiscais disponíveis para o contexto atual.'
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
                  <h2 className="text-lg font-semibold text-text-strong">Lista principal de documentos fiscais</h2>
                  <p className="text-sm text-text-muted">
                    Rastreabilidade operacional entre documento, compra, obra, estoque e reflexo financeiro.
                  </p>
                </div>
                <FiscalTable items={data.documentos} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
