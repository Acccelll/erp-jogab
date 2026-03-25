import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useDocumentoFiscalDetails } from '../hooks';
import { FISCAL_DOCUMENTO_TIPO_LABELS, FISCAL_TIPO_OPERACAO_LABELS } from '../types';
import { FiscalImpostosBloco, FiscalStatusBadge, FiscalVinculosBloco } from '../components';

export function DocumentoFiscalDetailPage() {
  const { documentoId } = useParams<{ documentoId: string }>();
  const { data, isLoading, isError, refetch } = useDocumentoFiscalDetails(documentoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={data?.documento.codigo ?? 'Documento Fiscal'}
        subtitle="Detalhe fiscal com rastreabilidade de impostos, vínculos de compra, obra, estoque e financeiro."
        actions={
          <Link
            to="/fiscal"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <ArrowLeft size={16} />
            Voltar ao Fiscal
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="py-12 text-center text-sm text-text-muted">Carregando detalhe do documento fiscal...</div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar documento fiscal"
            description="Não foi possível carregar o detalhe do documento solicitado."
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
            <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-700">{data.documento.codigo}</p>
                    <h2 className="mt-1 text-xl font-semibold text-text-strong">{data.documento.resumo}</h2>
                    <p className="mt-1 text-sm text-text-muted">
                      {data.documento.emitenteNome} → {data.documento.destinatarioNome}
                    </p>
                  </div>
                  <FiscalStatusBadge status={data.documento.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Operação</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {FISCAL_TIPO_OPERACAO_LABELS[data.documento.tipoOperacao]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {FISCAL_DOCUMENTO_TIPO_LABELS[data.documento.documentoTipo]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Número / série</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {data.documento.numero}
                      {data.documento.serie ? ` · Série ${data.documento.serie}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Competência</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {formatCompetencia(data.documento.competencia)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Emissão</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">{data.documento.emissao}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Lançamento</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">{data.documento.lancamento}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Vencimento</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {data.documento.vencimento ?? 'Sem vencimento'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Obra</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {data.documento.obraNome ?? 'Sem obra vinculada'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Valor do documento</dt>
                    <dd className="mt-1 text-sm font-semibold text-text-strong">
                      {formatCurrency(data.documento.valorDocumento)}
                    </dd>
                  </div>
                </dl>

                {data.documento.chaveAcesso ? (
                  <div className="mt-6 rounded-lg border border-border-light bg-surface-soft px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-text-subtle">Chave de acesso</p>
                    <p className="mt-1 break-all text-sm font-medium text-text-strong">{data.documento.chaveAcesso}</p>
                  </div>
                ) : null}
              </article>

              <FiscalVinculosBloco vinculos={data.documento.vinculos} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
              <FiscalImpostosBloco impostos={data.documento.impostos} />

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-text-strong">Linha do tempo</h2>
                <div className="mt-4 space-y-4">
                  {(data.timeline ?? []).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-jogab-700" />
                      <div>
                        <p className="text-sm font-semibold text-text-strong">{item.label}</p>
                        <p className="text-xs text-text-subtle">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                        <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-text-strong">Observações operacionais</h2>
                {data.documento.vinculos.tituloFinanceiroHref ? (
                  <Link
                    to={data.documento.vinculos.tituloFinanceiroHref}
                    className="inline-flex items-center gap-1 text-xs font-medium text-jogab-700 hover:text-jogab-700"
                  >
                    Ver reflexo financeiro
                    <ExternalLink size={12} />
                  </Link>
                ) : null}
              </div>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                {(data.observacoes ?? []).map((observacao) => (
                  <li key={observacao} className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
                    {observacao}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
