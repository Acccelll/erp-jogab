import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { usePedidoCompraDetails } from '../hooks';
import { CompraStatusBadge } from '../components';
import { COMPRA_CATEGORIA_LABELS, COMPRA_PRIORIDADE_LABELS } from '../types';

export function PedidoCompraDetailPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const { data, isLoading, isError, refetch } = usePedidoCompraDetails(pedidoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Detalhe do Pedido"
        subtitle="Visão consolidada do pedido, origem da solicitação, apoio da cotação e impactos futuros em Fiscal e Financeiro."
        actions={
          <Link
            to="/compras/pedidos"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            Voltar para pedidos
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <p className="text-sm text-text-muted">Carregando detalhe do pedido...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar pedido"
            description="Não foi possível carregar o detalhe do pedido de compra."
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

        {!isLoading && !isError && !data && (
          <EmptyState
            title="Pedido não encontrado"
            description="O identificador informado não corresponde a um pedido disponível nos mocks atuais."
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-strong">{data.pedido.codigo}</h2>
                    <p className="text-sm text-text-muted">
                      Fornecedor {data.pedido.fornecedorNome} • Obra {data.pedido.obraNome}
                    </p>
                  </div>
                  <CompraStatusBadge status={data.pedido.status} />
                </div>

                <dl className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Competência</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {formatCompetencia(data.pedido.competencia)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Valor do pedido</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {formatCurrency(data.pedido.valorPedido)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Categoria</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {COMPRA_CATEGORIA_LABELS[data.pedido.categoria]}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Prioridade</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {COMPRA_PRIORIDADE_LABELS[data.pedido.prioridade]}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Fiscal</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {data.pedido.fiscalStatus.replaceAll('_', ' ')}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-soft p-3">
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Financeiro</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {data.pedido.financeiroStatus.replaceAll('_', ' ')}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-text-strong">Origem da compra</h3>
                <div className="mt-4 space-y-4 text-sm text-text-muted">
                  <div>
                    <p className="font-medium text-text-strong">Solicitação</p>
                    <p>
                      {data.solicitacao
                        ? `${data.solicitacao.codigo} • ${data.solicitacao.titulo}`
                        : 'Sem solicitação vinculada'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-text-strong">Cotação</p>
                    <p>
                      {data.cotacao
                        ? `${data.cotacao.codigo} • ${data.cotacao.fornecedorPrincipal}`
                        : 'Pedido direto sem cotação formal'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-text-strong">Observações de integração</p>
                    <ul className="mt-2 space-y-2">
                      {data.observacoes.map((observacao) => (
                        <li key={observacao} className="rounded-lg bg-surface-soft px-3 py-2">
                          {observacao}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-text-strong">Itens do pedido</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-surface-soft">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-text-muted">Descrição</th>
                        <th className="px-4 py-3 text-right font-semibold text-text-muted">Qtd.</th>
                        <th className="px-4 py-3 text-right font-semibold text-text-muted">Unitário</th>
                        <th className="px-4 py-3 text-right font-semibold text-text-muted">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.itens.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-text-strong">{item.descricao}</div>
                            <div className="text-xs text-text-muted">{item.obraAplicacao}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-text-body">
                            {item.quantidade} {item.unidade}
                          </td>
                          <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorUnitario)}</td>
                          <td className="px-4 py-3 text-right font-medium text-text-strong">
                            {formatCurrency(item.valorTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-text-strong">Linha do tempo</h3>
                <ol className="mt-4 space-y-4 border-l border-border-default pl-4">
                  {data.timeline.map((item) => (
                    <li key={item.id} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-jogab-700" />
                      <p className="text-sm font-medium text-text-strong">{item.titulo}</p>
                      <p className="text-xs text-text-muted">{new Date(item.data).toLocaleString('pt-BR')}</p>
                      <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
                    </li>
                  ))}
                </ol>
              </article>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
