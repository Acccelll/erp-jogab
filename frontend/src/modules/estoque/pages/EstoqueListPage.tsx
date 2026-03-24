import { ArrowRightLeft, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useEstoque, useEstoqueFilters } from '../hooks';
import { EstoqueFilters, EstoqueItensTable, EstoqueKpiBar, EstoqueResumoCard, EstoqueVisaoGeral } from '../components';

export function EstoqueListPage() {
  const { filters, setSearch, setStatus, setTipo, setLocalId, setCompetencia, setMovimentacaoTipo, clearFilters, hasActiveFilters } = useEstoqueFilters();
  const { data, isLoading, isError, refetch } = useEstoque(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Estoque"
        subtitle="Visão operacional de itens, saldos e rastreabilidade por obra, almoxarifado e integração com Compras, Fiscal e Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/estoque/movimentacoes" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowRightLeft size={16} />
              Movimentações
            </Link>
            <Link to="/compras" className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600">
              <Boxes size={16} />
              Ir para Compras
            </Link>
          </div>
        }
      />

      <EstoqueFilters
        search={filters.search ?? ''}
        status={filters.status}
        tipo={filters.tipo}
        localId={filters.localId}
        competencia={filters.competencia}
        movimentacaoTipo={filters.movimentacaoTipo}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTipoChange={setTipo}
        onLocalIdChange={setLocalId}
        onCompetenciaChange={setCompetencia}
        onMovimentacaoTipoChange={setMovimentacaoTipo}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {data?.kpis && <EstoqueKpiBar kpis={data.kpis} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-gray-500">Carregando visão de estoque...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar estoque"
            description="Não foi possível montar a visão principal de itens, saldos e movimentações do estoque."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.resumoCards.map((card) => <EstoqueResumoCard key={card.id} card={card} />)}
            </section>

            <EstoqueVisaoGeral statusItems={data.statusResumo} localItems={data.localResumo} tipoItems={data.tipoResumo} />

            {data.itens.length === 0 ? (
              <EmptyState
                title="Nenhum item encontrado"
                description={hasActiveFilters ? 'Nenhum item de estoque corresponde aos filtros selecionados.' : 'Ainda não há itens disponíveis para a competência atual.'}
                action={hasActiveFilters ? <button type="button" onClick={clearFilters} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Limpar filtros</button> : undefined}
              />
            ) : (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Itens de estoque</h2>
                    <p className="text-sm text-gray-500">Saldos por item, local e obra com leitura de consumo e rastreabilidade de origem.</p>
                  </div>
                  <Link to="/estoque/movimentacoes" className="text-sm font-medium text-jogab-600 hover:text-jogab-700">Ver movimentações</Link>
                </div>
                <EstoqueItensTable items={data.itens} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
