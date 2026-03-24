import { ArrowLeft, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useItemEstoqueDetails } from '../hooks';
import { ESTOQUE_TIPO_LABELS } from '../types';
import { EstoqueConsumoPorObraTable, EstoqueMovimentacoesTable, EstoqueStatusBadge } from '../components';

export function EstoqueItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const { data, isLoading, isError, refetch } = useItemEstoqueDetails(itemId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={data?.item.descricao ?? 'Detalhe do item'}
        subtitle="Detalhe operacional do item com saldo, rastreabilidade de origem, movimentações e leitura de consumo por obra."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/estoque"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Voltar ao estoque
            </Link>
          </div>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando detalhe do item...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar item"
            description="Não foi possível carregar o detalhe do item de estoque solicitado."
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
            <section className="grid gap-4 xl:grid-cols-[1.4fr,1fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-600">{data.item.codigo}</p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">{data.item.descricao}</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {ESTOQUE_TIPO_LABELS[data.item.tipo]} • {data.item.unidade} • Competência{' '}
                      {formatCompetencia(data.item.competencia)}
                    </p>
                  </div>
                  <EstoqueStatusBadge status={data.item.status} />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Saldo atual</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {data.item.saldo.quantidadeAtual} {data.item.unidade}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Disponível</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {data.item.saldo.quantidadeDisponivel} {data.item.unidade}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Reservado</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {data.item.saldo.quantidadeReservada} {data.item.unidade}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Valor total</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(data.item.saldo.valorTotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <p>
                      <strong className="text-gray-900">Obra:</strong> {data.item.obraNome}
                    </p>
                    <p>
                      <strong className="text-gray-900">Local:</strong> {data.item.localNome}
                    </p>
                    <p>
                      <strong className="text-gray-900">Centro de custo:</strong> {data.item.centroCusto}
                    </p>
                    <p>
                      <strong className="text-gray-900">Cobertura:</strong> {data.item.saldo.coberturaDias} dias
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <ShoppingCart size={14} className="text-jogab-600" />{' '}
                      {data.item.pedidoCompraCodigo ?? 'Sem pedido vinculado'}
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <Receipt size={14} className="text-jogab-600" />{' '}
                      {data.item.documentoFiscal ?? 'Sem documento fiscal vinculado'}
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <Wallet size={14} className="text-jogab-600" />{' '}
                      {data.item.tituloFinanceiroCodigo ?? 'Sem título financeiro vinculado'}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-gray-900">Observações e preparação futura</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {(data.observacoes ?? []).map((observacao) => (
                    <li key={observacao} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                      {observacao}
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Consumo por obra</h2>
                <p className="text-sm text-gray-500">
                  Leitura de apropriação operacional preparada para apoiar custos realizados da obra e futuras medições.
                </p>
              </div>
              <EstoqueConsumoPorObraTable items={data.consumoPorObra} />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Movimentações do item</h2>
                <p className="text-sm text-gray-500">
                  Histórico de entradas, saídas, ajustes e transferências com vínculo de origem e responsável.
                </p>
              </div>
              <EstoqueMovimentacoesTable items={data.movimentacoes} />
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
