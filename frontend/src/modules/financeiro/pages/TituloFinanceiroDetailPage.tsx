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
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <ArrowLeftRight size={16} />
            Voltar ao Financeiro
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando detalhe do título...</div>}

        {isError && (
          <EmptyState
            icon={<ReceiptText size={28} />}
            title="Erro ao carregar título financeiro"
            description="Não foi possível buscar o detalhe completo do título solicitado."
            action={
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white"
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
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-700">{data.titulo.codigo}</p>
                    <h2 className="mt-1 text-xl font-semibold text-text-strong">{data.titulo.descricao}</h2>
                    <p className="mt-1 text-sm text-text-muted">{data.titulo.fornecedorCliente}</p>
                  </div>
                  <FinanceiroStatusBadge status={data.titulo.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Obra</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">{data.titulo.obraNome}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Centro de custo</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">{data.titulo.centroCusto}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Competência</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {formatCompetencia(data.titulo.competencia)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {FINANCEIRO_TIPO_LABELS[data.titulo.tipo]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Origem</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {FINANCEIRO_ORIGEM_LABELS[data.titulo.origem]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Documento</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {data.titulo.documentoNumero ?? 'Sem documento fiscal vinculado'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Vencimento</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {new Date(data.titulo.vencimento).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Valor</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">{formatCurrency(data.titulo.valor)}</dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-text-strong">Integrações conceituais</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Relações preservadas entre Financeiro, Obra, FOPAG, Compras, Fiscal e demais módulos alimentadores.
                </p>

                <div className="mt-4 space-y-3">
                  {(data.integracoes ?? []).map((item) => (
                    <div key={item.modulo} className="rounded-lg bg-surface-soft p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-text-strong">{item.modulo}</p>
                        {item.href ? (
                          <Link
                            to={item.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-jogab-700 hover:text-jogab-700"
                          >
                            Acessar
                            <ExternalLink size={12} />
                          </Link>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
              <div className="border-b border-border-default px-5 py-4">
                <h2 className="text-base font-semibold text-text-strong">Timeline financeira</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Eventos do ciclo do título para apoiar rastreabilidade de previsão, baixa, conciliação e integração
                  entre módulos.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-surface-soft">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-text-muted">Data</th>
                      <th className="px-4 py-3 text-left font-semibold text-text-muted">Evento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {(data.timeline ?? []).map((item) => (
                      <tr key={item.id} className="hover:bg-surface-soft/70">
                        <td className="px-4 py-3 text-text-body">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 font-medium text-text-strong">{item.label}</td>
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
