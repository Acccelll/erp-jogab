import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia } from '@/shared/lib/utils';
import { DocumentoStatusBadge } from '../components';
import { useDocumentoDetails } from '../hooks';
import { DOCUMENTO_ALERTA_LABELS, DOCUMENTO_ENTIDADE_LABELS, DOCUMENTO_TIPO_LABELS } from '../types';

export function DocumentoDetailPage() {
  const { documentoId } = useParams<{ documentoId: string }>();
  const { data, isLoading, isError, refetch } = useDocumentoDetails(documentoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={data?.documento.titulo ?? 'Detalhe do documento'}
        subtitle="Detalhe documental com vínculo de entidade, obra, contrato, status e vencimento."
        actions={
          <Link
            to="/documentos"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Voltar aos documentos
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando detalhe do documento...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar documento"
            description="Não foi possível carregar o detalhe do documento solicitado."
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
            <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-600">{data.documento.codigo}</p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">{data.documento.titulo}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {DOCUMENTO_ENTIDADE_LABELS[data.documento.entidade]} • {data.documento.entidadeNome}
                    </p>
                  </div>
                  <DocumentoStatusBadge status={data.documento.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {DOCUMENTO_TIPO_LABELS[data.documento.tipo]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Versão</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.versao}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Competência</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.documento.competencia ? formatCompetencia(data.documento.competencia) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Obra</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.documento.obraNome ?? 'Sem obra vinculada'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Contrato</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.documento.contratoCodigo ?? 'Sem contrato vinculado'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Responsável</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.responsavelNome}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Emitido em</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.documento.vencimento.dataEmissao
                        ? new Date(data.documento.vencimento.dataEmissao).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Vencimento</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {data.documento.vencimento.dataVencimento
                        ? new Date(data.documento.vencimento.dataVencimento).toLocaleDateString('pt-BR')
                        : 'Sem vencimento'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Alerta</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {DOCUMENTO_ALERTA_LABELS[data.documento.vencimento.alerta]}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Observações</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-gray-600">
                    {(data.observacoes ?? []).map((observacao) => (
                      <li key={observacao}>• {observacao}</li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Integrações</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    O documento preserva rastreabilidade com a entidade de origem e seus vínculos operacionais.
                  </p>
                </div>

                {(data.integracoes ?? []).map((integracao) => (
                  <div key={integracao.modulo} className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{integracao.modulo}</p>
                      {integracao.href ? (
                        <Link
                          to={integracao.href}
                          className="inline-flex items-center gap-1 text-xs font-medium text-jogab-600 hover:text-jogab-700"
                        >
                          Abrir
                          <ExternalLink size={12} />
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{integracao.descricao}</p>
                  </div>
                ))}
              </article>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">Histórico documental</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Eventos recentes preservados para auditoria e rastreabilidade da evolução documental.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Evento</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Descrição</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {(data.historico ?? []).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                        <td className="px-4 py-3 text-gray-700">{item.descricao}</td>
                        <td className="px-4 py-3 text-gray-700">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
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
