import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useRelatorioCategoria, useRelatoriosFilters } from '../hooks';
import { RelatorioPreviewPlaceholder, RelatoriosFilters, RelatoriosTable } from '../components';
import { RELATORIO_CATEGORIA_DESCRICOES, RELATORIO_CATEGORIA_LABELS } from '../types';
import type { RelatorioCategoria } from '../types';

export function RelatorioCategoriaPage() {
  const { categoria } = useParams<{ categoria: RelatorioCategoria }>();
  const categoriaKey = categoria as RelatorioCategoria | undefined;
  const { filters, setSearch, setCategoria, setDisponibilidade, setFormato, setCompetencia, clearFilters, hasActiveFilters } = useRelatoriosFilters();
  const { data, isLoading, isError, refetch } = useRelatorioCategoria(categoriaKey, filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={categoriaKey ? RELATORIO_CATEGORIA_LABELS[categoriaKey] : 'Categoria de relatório'}
        subtitle={categoriaKey ? RELATORIO_CATEGORIA_DESCRICOES[categoriaKey] : 'Leitura por categoria do catálogo de relatórios.'}
        actions={
          <Link to="/relatorios" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={16} />
            Voltar aos relatórios
          </Link>
        }
      />

      <ContextBar />

      <RelatoriosFilters
        search={filters.search ?? ''}
        categoria={categoriaKey}
        disponibilidade={filters.disponibilidade}
        formato={filters.formato}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onDisponibilidadeChange={setDisponibilidade}
        onFormatoChange={setFormato}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando relatórios da categoria...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar categoria"
            description="Não foi possível carregar os relatórios da categoria selecionada."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <>
            <RelatoriosTable items={data} />
            <section className="grid gap-4 xl:grid-cols-2">
              {data.slice(0, 2).map((item) => <RelatorioPreviewPlaceholder key={item.id} item={item} />)}
            </section>
          </>
        )}

        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            title="Nenhum relatório nesta categoria"
            description={hasActiveFilters ? 'Os filtros atuais não retornaram relatórios para esta categoria.' : 'Ainda não há relatórios cadastrados para esta categoria.'}
            action={hasActiveFilters ? <button type="button" onClick={clearFilters} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Limpar filtros</button> : undefined}
          />
        )}
      </MainContent>
    </div>
  );
}
