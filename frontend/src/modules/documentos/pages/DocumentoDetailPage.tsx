import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ContextBar, EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia } from '@/shared/lib/utils';
import { useDocumentoDetails } from '../hooks';
import {
  DOCUMENTO_ALERTA_LABELS,
  DOCUMENTO_ENTIDADE_LABELS,
  DOCUMENTO_TIPO_LABELS,
} from '../types';
import { DocumentoStatusBadge } from '../components';

export function DocumentoDetailPage() {
  const { documentoId } = useParams<{ documentoId: string }>();
  const { data, isLoading, isError, refetch } = useDocumentoDetails(documentoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={data?.documento.titulo ?? 'Detalhe do documento'}
        subtitle="Detalhe documental com vínculo de entidade, obra, contrato, status e vencimento."
        actions={
          <Link to="/documentos" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={16} />
            Voltar aos documentos
          </Link>
        }
      />

      <ContextBar />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-gray-500">Carregando detalhe do documento...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar documento"
            description="Não foi possível carregar o detalhe do documento solicitado."
            action={<button type="button" onClick={() => void refetch()} className="rounded-md bg-jogab-500 px-3 py-1.5 text-sm text-white hover:bg-jogab-600">Tentar novamente</button>}
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
                    <p className="mt-1 text-sm text-gray-500">{DOCUMENTO_ENTIDADE_LABELS[data.documento.entidade]} • {data.documento.entidadeNome}</p>
                  </div>
                  <DocumentoStatusBadge status={data.documento.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{DOCUMENTO_TIPO_LABELS[data.documento.tipo]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Versão</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.versao}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Competência</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.competencia ? formatCompetencia(data.documento.competencia) : '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Obra</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.obraNome ?? 'Sem obra vinculada'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Contrato</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.contratoCodigo ?? 'Sem contrato vinculado'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">Responsável</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{data.documento.responsavelNome}</dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-gray-900">Vencimento e alerta</h2>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Emissão</p>
                    <p className="mt-1 font-medium text-gray-900">{data.documento.vencimento.dataEmissao ?? 'Não informado'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Vencimento</p>
                    <p className="mt-1 font-medium text-gray-900">{data.documento.vencimento.dataVencimento ?? 'Sem vencimento'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Alerta</p>
                    <p className="mt-1 font-medium text-gray-900">{DOCUMENTO_ALERTA_LABELS[data.documento.vencimento.alerta]}</p>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-gray-900">Integrações conceituais</h2>
                <div className="mt-4 space-y-3">
                  {data.integracoes.map((item) => (
                    <div key={item.modulo} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900">{item.modulo}</p>
                        {item.href ? (
                          <Link to={item.href} className="inline-flex items-center gap-1 text-xs font-medium text-jogab-600 hover:text-jogab-700">
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

              <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-gray-900">Histórico do documento</h2>
                <div className="mt-4 space-y-4">
                  {data.historico.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-jogab-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-gray-900">Observações operacionais</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {data.observacoes.map((observacao) => (
                  <li key={observacao} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">{observacao}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
