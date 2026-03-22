import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
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
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowDownToLine size={16} />
              Entradas
            </Link>
            <Link
              to="/fiscal/saidas"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <ArrowUpFromLine size={16} />
              Saídas
            </Link>
          </div>
        }
      />

      <ContextBar />

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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando visão fiscal...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar fiscal"
            description="Não foi possível montar a visão principal de documentos fiscais."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => (
                <FiscalResumoCard key={card.id} card={card} />
              ))}
            </section>

            {data.documentos.length === 0 ? (
              <EmptyState
                title="Nenhum documento fiscal encontrado"
                description={hasActiveFilters ? 'Nenhum documento fiscal corresponde aos filtros selecionados.' : 'Ainda não há documentos fiscais disponíveis para o contexto atual.'}
                action={hasActiveFilters ? <button type="button" onClick={clearFilters} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Limpar filtros</button> : undefined}
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lista principal de documentos fiscais</h2>
                  <p className="text-sm text-gray-500">Rastreabilidade operacional entre documento, compra, obra, estoque e reflexo financeiro.</p>
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
