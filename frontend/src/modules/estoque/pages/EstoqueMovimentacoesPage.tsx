import { Boxes, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useEstoqueFilters, useMovimentacoesEstoque } from '../hooks';
import { EstoqueFilters, EstoqueMovimentacoesTable } from '../components';

export function EstoqueMovimentacoesPage() {
  const { filters, setSearch, setStatus, setTipo, setLocalId, setCompetencia, setMovimentacaoTipo, clearFilters, hasActiveFilters } = useEstoqueFilters();
  const { data, isLoading, isError, refetch } = useMovimentacoesEstoque(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Movimentações de estoque"
        subtitle="Entradas, saídas, transferências e ajustes preparados para conciliação conceitual com Compras, Fiscal, Obra e Financeiro."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/estoque" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Boxes size={16} />
              Visão principal
            </Link>
            <Link to="/financeiro" className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600">
              <Wallet size={16} />
              Ver Financeiro
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
        showMovimentacaoTipo
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando movimentações...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar movimentações"
            description="Não foi possível carregar as entradas, saídas, transferências e ajustes do estoque."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && (
          data && data.length > 0 ? (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Linha do tempo operacional</h2>
                <p className="text-sm text-gray-500">Leitura consolidada das movimentações com vínculo ao item, à obra, ao documento e ao responsável.</p>
              </div>
              <EstoqueMovimentacoesTable items={data} />
            </section>
          ) : (
            <EmptyState
              title="Nenhuma movimentação encontrada"
              description={hasActiveFilters ? 'Nenhuma movimentação corresponde aos filtros selecionados.' : 'Ainda não há movimentações disponíveis para o contexto atual.'}
              action={hasActiveFilters ? <button type="button" onClick={clearFilters} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Limpar filtros</button> : undefined}
            />
          )
        )}
      </MainContent>
    </div>
  );
}
