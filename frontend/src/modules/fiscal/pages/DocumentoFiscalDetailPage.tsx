import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useDocumentoFiscalDetails } from '../hooks';
import { FiscalStatusBadge } from '../components';
import { FISCAL_TIPO_LABELS } from '../types';

export function DocumentoFiscalDetailPage() {
  const { documentoId } = useParams<{ documentoId: string }>();
  const { data, isLoading, isError, refetch } = useDocumentoFiscalDetails(documentoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Detalhe do Documento Fiscal"
        subtitle="Visão consolidada do documento, itens, impostos e integrações futuras com Compras, Obra e Financeiro."
        actions={
          <Link to="/fiscal" className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Voltar para Fiscal
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <p className="text-sm text-gray-500">Carregando detalhe do documento fiscal...</p>}

        {isError && (
          <EmptyState
            title="Erro ao carregar documento fiscal"
            description="Não foi possível carregar o detalhe do documento."
            action={
              <button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && !data && (
          <EmptyState
            title="Documento não encontrado"
            description="O identificador informado não corresponde a um documento fiscal disponível nos mocks atuais."
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{data.documento.numero}</h2>
                    <p className="text-sm text-gray-500">{FISCAL_TIPO_LABELS[data.documento.tipo]} • {data.documento.emitenteNome}</p>
                  </div>
                  <FiscalStatusBadge status={data.documento.status} />
                </div>

                <dl className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Obra</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{data.documento.obraNome}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Competência</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{formatCompetencia(data.documento.competencia)}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Valor total</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(data.documento.valorTotal)}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Valor líquido</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(data.documento.valorLiquido)}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Pedido de compra</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{data.documento.pedidoCompraId ?? 'Não aplicável'}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Título financeiro</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{data.documento.financeiroTituloId ?? 'Ainda não vinculado'}</dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-gray-900">Impostos e integrações</h3>
                <div className="mt-4 grid gap-3 text-sm text-gray-600">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Origem</p>
                    <p className="mt-1 font-medium text-gray-900">{data.documento.origemResumo}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase tracking-wide text-gray-400">ICMS</p><p className="mt-1 font-medium text-gray-900">{formatCurrency(data.documento.impostos.icms)}</p></div>
                    <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase tracking-wide text-gray-400">ISS</p><p className="mt-1 font-medium text-gray-900">{formatCurrency(data.documento.impostos.iss)}</p></div>
                    <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase tracking-wide text-gray-400">PIS</p><p className="mt-1 font-medium text-gray-900">{formatCurrency(data.documento.impostos.pis)}</p></div>
                    <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs uppercase tracking-wide text-gray-400">COFINS</p><p className="mt-1 font-medium text-gray-900">{formatCurrency(data.documento.impostos.cofins)}</p></div>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-gray-900">Itens do documento</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Descrição</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Qtd.</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Unitário</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.itens.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{item.descricao}</div>
                            <div className="text-xs text-gray-500">{item.centroCustoNome}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">{item.quantidade} {item.unidade}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.valorUnitario)}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.valorTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h3 className="text-base font-semibold text-gray-900">Linha do tempo</h3>
                <ol className="mt-4 space-y-4 border-l border-gray-200 pl-4">
                  {data.timeline.map((item) => (
                    <li key={item.id} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-jogab-500" />
                      <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                      <p className="text-xs text-gray-500">{new Date(item.data).toLocaleString('pt-BR')}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.descricao}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900">Observações</h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    {data.observacoes.map((observacao) => (
                      <li key={observacao} className="rounded-lg bg-gray-50 px-3 py-2">{observacao}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
