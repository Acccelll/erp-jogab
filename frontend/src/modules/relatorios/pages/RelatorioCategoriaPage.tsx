import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
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

        {!isLoading && !isError && data && data.itens.length > 0 && (
          <>
            {data.resumoCards.length > 0 && (
              <section className="grid gap-4 xl:grid-cols-2">
                {data.resumoCards.map((card) => (
                  <article key={card.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                    <h2 className="text-base font-semibold text-gray-900">{card.titulo}</h2>
                    <p className="mt-1 text-sm text-gray-500">{card.descricao}</p>
                    <div className="mt-4 space-y-3">
                      {card.itens.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                          <span className="text-sm text-gray-600">{item.label}</span>
                          <span className={item.destaque ? 'text-sm font-semibold text-jogab-700' : 'text-sm font-medium text-gray-900'}>{item.valor}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </section>
            )}

            {data.linhas.length > 0 && (
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-base font-semibold text-gray-900">Resumo gerencial da categoria</h2>
                  <p className="mt-1 text-sm text-gray-500">Leitura reaproveitando a base atual por obra, competência, centro de custo e funcionário quando aplicável.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Referência</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra / Centro</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor / Qtde</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Descrição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {data.linhas.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/70">
                          <td className="px-4 py-3 align-top"><div className="font-medium text-gray-900">{item.label}</div>{item.funcionarioNome && <div className="text-xs text-gray-500">{item.funcionarioNome}</div>}</td>
                          <td className="px-4 py-3 text-gray-700">{[item.obraNome, item.centroCustoNome].filter(Boolean).join(' • ') || '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{item.competencia ? formatCompetencia(item.competencia) : '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{typeof item.previsto === 'number' ? formatCurrency(item.previsto) : '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{typeof item.realizado === 'number' ? formatCurrency(item.realizado) : '—'}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{typeof item.valor === 'number' ? formatCurrency(item.valor) : typeof item.quantidade === 'number' ? String(item.quantidade) : '—'}</td>
                          <td className="px-4 py-3 text-gray-700">{item.descricao ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <RelatoriosTable items={data.itens} />
            <section className="grid gap-4 xl:grid-cols-2">
              {data.itens.slice(0, 2).map((item) => <RelatorioPreviewPlaceholder key={item.id} item={item} />)}
            </section>
          </>
        )}

        {!isLoading && !isError && data && data.itens.length === 0 && (
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
