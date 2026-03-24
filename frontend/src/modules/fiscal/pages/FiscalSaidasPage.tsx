import { ReceiptText, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useFiscalFilters, useFiscalSaidas } from '../hooks';
import { FiscalFilters, FiscalKpiBar, FiscalResumoCard, FiscalTable } from '../components';

export function FiscalSaidasPage() {
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
  const { data, isLoading, isError, refetch } = useFiscalSaidas(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Fiscal · Saídas"
        subtitle="Faturamento e obrigações fiscais de saída com vínculo a medições, contratos e contas a receber."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/medicoes"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ReceiptText size={16} />
              Medições
            </Link>
            <Link
              to="/financeiro/contas-receber"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600"
            >
              <Wallet size={16} />
              Contas a receber
            </Link>
          </div>
        }
      />

      <FiscalFilters
        search={filters.search ?? ''}
        tipoOperacao="saida"
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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando saídas fiscais...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar saídas fiscais"
            description="Não foi possível carregar os documentos emitidos e obrigações de saída."
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

            {(data.documentos?.length ?? 0) === 0 ? (
              <EmptyState
                title="Nenhuma saída fiscal encontrada"
                description={
                  hasActiveFilters
                    ? 'Nenhuma saída corresponde aos filtros selecionados.'
                    : 'Ainda não há saídas fiscais para o contexto atual.'
                }
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Saídas fiscais</h2>
                  <p className="text-sm text-gray-500">
                    NF-es, NFS-es e guias ligadas ao faturamento, retenções e reflexos em contas a receber.
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
