import { Boxes, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useFiscalEntradas, useFiscalFilters } from '../hooks';
import { FiscalFilters, FiscalKpiBar, FiscalResumoCard, FiscalTable } from '../components';

export function FiscalEntradasPage() {
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
  const { data, isLoading, isError, refetch } = useFiscalEntradas(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal · Entradas"
        subtitle="Recebimento fiscal de compras e serviços com integração a estoque, obra e contas a pagar."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/compras" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ShoppingCart size={16} />
              Compras
            </Link>
            <Link to="/estoque" className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600">
              <Boxes size={16} />
              Estoque
            </Link>
          </div>
        }
      />

      <FiscalFilters
        search={filters.search ?? ''}
        tipoOperacao="entrada"
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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando entradas fiscais...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar entradas fiscais"
            description="Não foi possível carregar as notas de entrada e documentos recebidos."
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
                title="Nenhuma entrada fiscal encontrada"
                description={hasActiveFilters ? 'Nenhuma entrada corresponde aos filtros selecionados.' : 'Ainda não há entradas fiscais para o contexto atual.'}
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Entradas fiscais</h2>
                  <p className="text-sm text-gray-500">Notas de entrada, CT-es e NFS-es de recebimento já vinculados ao ciclo de compras.</p>
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
