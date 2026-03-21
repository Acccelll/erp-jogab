import { BarChart3, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useRelatorios, useRelatoriosFilters } from '../hooks';
import { RelatorioCategoriaCard, RelatoriosFilters, RelatoriosResumoBar, RelatoriosTable } from '../components';

export function RelatoriosListPage() {
  const { filters, setSearch, setCategoria, setDisponibilidade, setFormato, setCompetencia, clearFilters, hasActiveFilters } = useRelatoriosFilters();
  const { data, isLoading, isError, refetch } = useRelatorios(filters);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Relatórios"
        subtitle="Catálogo consolidado de relatórios gerenciais e operacionais integrando Obras, RH, HE, FOPAG, Compras, Fiscal, Financeiro, Estoque, Medições e Documentos."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <BarChart3 size={16} />
              Dashboard
            </Link>
            <Link to="/obras" className="inline-flex items-center gap-1.5 rounded-md bg-jogab-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-jogab-600">
              <Building2 size={16} />
              Obras
            </Link>
          </div>
        }
      />

      <ContextBar />

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
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando catálogo de relatórios...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar relatórios"
            description="Não foi possível montar a visão principal do catálogo de relatórios."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-3">
              {data.categorias.map((item) => <RelatorioCategoriaCard key={item.categoria} item={item} />)}
            </section>

            {data.itens.length === 0 ? (
              <EmptyState
                title="Nenhum relatório encontrado"
                description={hasActiveFilters ? 'Nenhum relatório corresponde aos filtros selecionados.' : 'Ainda não há relatórios disponíveis para o contexto atual.'}
                action={hasActiveFilters ? <button type="button" onClick={clearFilters} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Limpar filtros</button> : undefined}
              />
            ) : (
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lista de relatórios</h2>
                  <p className="text-sm text-gray-500">Catálogo por categoria com disponibilidade, origens de dados e formatos de saída.</p>
                </div>
                <RelatoriosTable items={data.itens} />
              </section>
            )}
          </>
        )}
      </MainContent>
    </div>
  );
}
