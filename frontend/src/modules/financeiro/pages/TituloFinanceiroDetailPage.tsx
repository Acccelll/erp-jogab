import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, ExternalLink, ReceiptText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FinanceiroStatusBadge } from '../components';
import { fetchTituloFinanceiroById } from '../services/financeiro.service';
import { FINANCEIRO_ORIGEM_LABELS, FINANCEIRO_TIPO_LABELS } from '../types';

export function TituloFinanceiroDetailPage() {
  const { tituloId } = useParams<{ tituloId: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['financeiro-titulo-detail', tituloId],
    queryFn: () => fetchTituloFinanceiroById(tituloId as string),
    enabled: Boolean(tituloId),
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Financeiro · Detalhe do título"
        subtitle="Rastreabilidade completa do título financeiro com vínculos de obra, competência, origem e módulos relacionados."
        actions={
          <Link
            to="/financeiro"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeftRight size={16} />
            Voltar ao Financeiro
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="py-12 text-center text-sm text-gray-500">
            Carregando detalhe do título...
          </div>
        )}

        {isError && (
          <EmptyState
            icon={<ReceiptText size={28} />}
            title="Erro ao carregar título financeiro"
            description="Não foi possível buscar o detalhe completo do título solicitado."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white"
              >
                Tentar novamente
              </button>
            }
          />
        )}

        {!isLoading && !isError && !data && (
          <EmptyState
            title="Título não encontrado"
            description="O identificador informado não corresponde a um título financeiro disponível nesta fase do frontend."
          />
        )}

        {!isLoading && !isError && data && (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-600">
                      {data.titulo.codigo}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                      {data.titulo.descricao}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {data.titulo.fornecedorCliente}
                    </p>
                  </div>
                  <FinanceiroStatusBadge status={data.titulo.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Obra</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.titulo.obraNome}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      Centro de custo
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.titulo.centroCusto}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      Competência
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {formatCompetencia(data.titulo.competencia)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {FINANCEIRO_TIPO_LABELS[data.titulo.tipo]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Origem</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {FINANCEIRO_ORIGEM_LABELS[data.titulo.origem]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      Documento
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.titulo.documentoNumero ?? 'Sem documento fiscal vinculado'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      Vencimento
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {new Date(data.titulo.vencimento).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Valor</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(data.titulo.valor)}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-gray-900">
                  Integrações conceituais
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Relações preservadas entre Financeiro, Obra, FOPAG, Compras, Fiscal e
                  demais módulos alimentadores.
                </p>

                <div className="mt-4 space-y-3">
                  {data.integracoes.map((item) => (
                    <div key={item.modulo} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900">{item.modulo}</p>
                        {item.href ? (
                          <Link
                            to={item.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-jogab-600 hover:text-jogab-700"
                          >
                            Acessar
                            <ExternalLink size={12} />
                          </Link>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Timeline financeira
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Eventos do ciclo do título para apoiar rastreabilidade de previsão,
                  baixa, conciliação e integração entre módulos.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Evento
                      </th>
                                          </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {data.timeline.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(item.data).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.label}
                        </td>
                                              </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
