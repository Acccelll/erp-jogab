import { BarChart3, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import {
  RelatorioCategoriaCard,
  RelatorioCoberturaCard,
  RelatorioResumoCard,
  RelatorioSaidaCard,
  RelatoriosFilters,
  RelatoriosResumoBar,
  RelatoriosTable,
} from '../components';
import { useRelatorios, useRelatoriosFilters } from '../hooks';

export function RelatoriosListPage() {
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
  const { data, isLoading, isError, refetch } = useRelatorios(filters);

  const itens = data?.itens ?? [];
  const categorias = data?.categorias ?? [];
  const resumoCards = data?.resumoCards ?? [];
  const saidasOperacionais = data?.saidasOperacionais ?? [];
  const coberturaModulos = data?.coberturaModulos ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Relatórios"
        subtitle="Catálogo consolidado de relatórios gerenciais e operacionais integrando Obras, RH, HE, FOPAG, Compras, Fiscal, Financeiro, Estoque, Medições e Documentos."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-surface px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
            >
              <BarChart3 size={16} />
              Dashboard
            </Link>
            <Link
              to="/obras"
              className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-800"
            >
              <Building2 size={16} />
              Obras
            </Link>
          </div>
        }
      />

      <RelatoriosFilters
        search={filters.search ?? ''}
        categoria={filters.categoria}
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

      {data?.resumo && <RelatoriosResumoBar resumo={data.resumo} />}

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando catálogo de relatórios...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar relatórios"
            description="Não foi possível montar a visão principal do catálogo de relatórios."
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
            <section className="grid gap-4 xl:grid-cols-2">
              {resumoCards.map((card) => (
                <RelatorioResumoCard key={card.id} card={card} />
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              {categorias.map((item) => (
                <RelatorioCategoriaCard key={item.categoria} item={item} />
              ))}
            </section>

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
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-text-body hover:bg-surface-soft"
                    >
                      Limpar filtros
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <>
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-strong">Lista de relatórios</h2>
                    <p className="text-sm text-text-muted">
                      Catálogo por categoria com disponibilidade, origens de dados e operação de saída.
                    </p>
                  </div>
                  <RelatoriosTable items={itens} />
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-strong">Saídas operacionais</h2>
                    <p className="text-sm text-text-muted">
                      Área mais concreta de exportação, execução e distribuição do catálogo.
                    </p>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-2">
                    {saidasOperacionais.slice(0, 4).map((item) => (
                      <RelatorioSaidaCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-strong">Cobertura por módulo</h2>
                    <p className="text-sm text-text-muted">
                      Visão de como o domínio Relatórios já conversa com os módulos operacionais e gerenciais.
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
          </>
        )}
      </MainContent>
    </div>
  );
}
