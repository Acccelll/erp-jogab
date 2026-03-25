import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import {
  RelatorioCoberturaCard,
  RelatorioResumoCard,
  RelatorioSaidaCard,
  RelatoriosFilters,
  RelatoriosTable,
} from '../components';
import { useRelatorioCategoria, useRelatoriosFilters } from '../hooks';
import { RELATORIO_CATEGORIA_DESCRICOES, RELATORIO_CATEGORIA_LABELS } from '../types';
import type { RelatorioCategoria } from '../types';

export function RelatorioCategoriaPage() {
  const { categoria } = useParams<{ categoria: RelatorioCategoria }>();
  const categoriaKey = categoria as RelatorioCategoria | undefined;
  const {
    filters,
    setSearch,
    setCategoria,
    setDisponibilidade,
    setFormato,
    setCompetencia,
    clearFilters,
    hasActiveFilters,
  } = useRelatoriosFilters();
  const { data, isLoading, isError, refetch } = useRelatorioCategoria(categoriaKey, filters);

  const itens = data?.itens ?? [];
  const resumoCards = data?.resumoCards ?? [];
  const saidasOperacionais = data?.saidasOperacionais ?? [];
  const coberturaModulos = data?.coberturaModulos ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={categoriaKey ? RELATORIO_CATEGORIA_LABELS[categoriaKey] : 'Categoria de relatório'}
        subtitle={
          categoriaKey
            ? RELATORIO_CATEGORIA_DESCRICOES[categoriaKey]
            : 'Leitura por categoria do catálogo de relatórios.'
        }
        actions={
          <Link
            to="/relatorios"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <ArrowLeft size={16} />
            Voltar aos relatórios
          </Link>
        }
      />

      <RelatoriosFilters
        search={filters.search ?? ''}
        categoria={categoriaKey}
        disponibilidade={filters.disponibilidade}
        formato={filters.formato}
        competencia={filters.competencia}
        hasActiveFilters={hasActiveFilters}
        lockCategoria
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
        onDisponibilidadeChange={setDisponibilidade}
        onFormatoChange={setFormato}
        onCompetenciaChange={setCompetencia}
        onClear={clearFilters}
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando relatórios da categoria...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar categoria"
            description="Não foi possível carregar os relatórios da categoria selecionada."
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

        {!isLoading && !isError && data && itens.length > 0 && (
          <>
            <section className="grid gap-4 xl:grid-cols-2">
              {resumoCards.map((card) => (
                <RelatorioResumoCard key={card.id} card={card} />
              ))}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text-strong">Relatórios da categoria</h2>
                <p className="text-sm text-text-muted">
                  Lista operacional com origem dos dados, disponibilidade e formato principal.
                </p>
              </div>
              <RelatoriosTable items={itens} />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text-strong">Saídas e exportação</h2>
                <p className="text-sm text-text-muted">
                  Blocos operacionais para execução, distribuição e leitura do formato principal por relatório.
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {saidasOperacionais.map((item) => (
                  <RelatorioSaidaCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text-strong">Cobertura de módulos</h2>
                <p className="text-sm text-text-muted">
                  Módulos fonte já relacionados a esta categoria para análise gerencial e exportação.
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {coberturaModulos.map((item) => (
                  <RelatorioCoberturaCard key={item.modulo} item={item} />
                ))}
              </div>
            </section>
          </>
        )}

        {!isLoading && !isError && data && itens.length === 0 && (
          <EmptyState
            title="Nenhum relatório nesta categoria"
            description={
              hasActiveFilters
                ? 'Os filtros atuais não retornaram relatórios para esta categoria.'
                : 'Ainda não há relatórios cadastrados para esta categoria.'
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
        )}
      </MainContent>
    </div>
  );
}
