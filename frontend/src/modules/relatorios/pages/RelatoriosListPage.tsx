import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { EmptyState, MainContent } from '@/shared/components';
import { RelatorioCategoriaCard, RelatoriosTable } from '../components';
import { useRelatorios, useRelatoriosFilters } from '../hooks';

export function RelatoriosListPage() {
  const { filters, setSearch, setCategoria, setDisponibilidade, setFormato, clearFilters, hasActiveFilters } =
    useRelatoriosFilters();
  const { data, isLoading, isError, refetch } = useRelatorios(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const itens = data?.itens ?? [];
  const categorias = data?.categorias ?? [];

  return (
    <div className="flex flex-1 flex-col">
      {/* Compact filter bar */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm">
            <Search size={14} className="text-text-subtle" />
            <input
              type="text"
              placeholder="Buscar relatório..."
              value={filters.search ?? ''}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 border-0 bg-transparent text-sm outline-none placeholder:text-text-subtle"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="rounded-md p-1.5 text-text-subtle hover:bg-surface-soft hover:text-text-muted"
          >
            <SlidersHorizontal size={16} />
          </button>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-xs text-text-muted hover:text-text-body">
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex items-center gap-2 border-b border-border-light bg-surface-muted px-4 py-2">
          <select
            value={filters.categoria ?? ''}
            onChange={(e) => setCategoria((e.target.value || undefined) as typeof filters.categoria)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Categoria</option>
            <option value="obras">Obras</option>
            <option value="rh">RH</option>
            <option value="financeiro">Financeiro</option>
            <option value="compras">Compras</option>
            <option value="estoque">Estoque</option>
            <option value="horas_extras">Horas Extras</option>
            <option value="fopag">FOPAG</option>
            <option value="fiscal">Fiscal</option>
            <option value="execucao">Execução</option>
            <option value="gerencial">Gerencial</option>
          </select>
          <select
            value={filters.disponibilidade ?? ''}
            onChange={(e) => setDisponibilidade((e.target.value || undefined) as typeof filters.disponibilidade)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Disponibilidade</option>
            <option value="disponivel">Disponível</option>
            <option value="planejado">Planejado</option>
            <option value="indisponivel">Indisponível</option>
          </select>
          <select
            value={filters.formato ?? ''}
            onChange={(e) => setFormato((e.target.value || undefined) as typeof filters.formato)}
            className="rounded-md border border-border-default bg-surface px-2.5 py-1 text-sm text-text-body"
          >
            <option value="">Formato</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
            <option value="tela">Tela</option>
          </select>
        </div>
      )}

      <MainContent className="space-y-4">
        {isLoading && (
          <div className="space-y-0">
            <p className="sr-only">Carregando catálogo de relatórios...</p>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-border-light px-4 py-3">
                <div className="h-4 w-2/5 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar relatórios"
            description="Não foi possível montar o catálogo de relatórios."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-brand-primary px-3 py-1.5 text-sm text-white hover:bg-brand-primary-hover"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && data && (
          <>
            {/* Category chips — compact discovery */}
            {categorias.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {categorias.map((item) => (
                  <RelatorioCategoriaCard key={item.categoria} item={item} />
                ))}
              </div>
            )}

            {/* Reports table — protagonist */}
            {itens.length === 0 ? (
              <EmptyState
                title="Nenhum relatório encontrado"
                description={
                  hasActiveFilters
                    ? 'Nenhum relatório corresponde aos filtros selecionados.'
                    : 'Ainda não há relatórios disponíveis para o contexto atual.'
                }
                action={
                  hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-md border border-border-default px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                    >
                      Limpar filtros
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <RelatoriosTable items={itens} />
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
