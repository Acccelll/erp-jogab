import { ArrowLeft, ExternalLink, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { useMedicaoDetails } from '../hooks';
import { MEDICAO_APROVACAO_LABELS, MEDICAO_FATURAMENTO_LABELS, MEDICAO_ORIGEM_LABELS } from '../types';
import { MedicaoItensTable, MedicaoStatusBadge } from '../components';

export function MedicaoDetailPage() {
  const { medicaoId } = useParams<{ medicaoId: string }>();
  const { data, isLoading, isError, refetch } = useMedicaoDetails(medicaoId);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={data?.medicao.codigo ?? 'Detalhe da medição'}
        subtitle="Detalhe técnico-financeiro da medição com itens, aprovação, faturamento e vínculos com Obra e Financeiro."
        actions={
          <Link
            to="/medicoes"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body hover:bg-surface-soft"
          >
            <ArrowLeft size={16} />
            Voltar às medições
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && <div className="py-12 text-center text-sm text-text-muted">Carregando detalhe da medição...</div>}

        {isError && (
          <EmptyState
            title="Erro ao carregar medição"
            description="Não foi possível carregar o detalhe da medição solicitada."
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
            <section className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-jogab-700">Medição #{data.medicao.numeroMedicao}</p>
                    <h2 className="mt-1 text-xl font-semibold text-text-strong">{data.medicao.obraNome}</h2>
                    <p className="mt-1 text-sm text-text-muted">
                      {data.medicao.contratoCodigo} • {data.medicao.clienteNome}
                    </p>
                  </div>
                  <MedicaoStatusBadge status={data.medicao.status} />
                </div>

                <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Competência</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {formatCompetencia(data.medicao.competencia)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Período</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {data.medicao.periodoInicio} a {data.medicao.periodoFim}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Origem</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {MEDICAO_ORIGEM_LABELS[data.medicao.origem]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Aprovação</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {MEDICAO_APROVACAO_LABELS[data.medicao.aprovacaoStatus]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Faturamento</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">
                      {MEDICAO_FATURAMENTO_LABELS[data.medicao.faturamentoStatus]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-text-subtle">Avanço</dt>
                    <dd className="mt-1 text-sm font-medium text-text-strong">{data.medicao.percentualAvanco}%</dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-text-strong">Resumo de faturamento</h2>
                <div className="mt-4 space-y-3 text-sm text-text-muted">
                  <div className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-text-subtle">Valor medido</p>
                    <p className="mt-1 text-base font-semibold text-text-strong">
                      {formatCurrency(data.medicao.resumoFinanceiro.valorMedido)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-text-subtle">Valor liberado para faturamento</p>
                    <p className="mt-1 text-base font-semibold text-text-strong">
                      {formatCurrency(data.medicao.resumoFinanceiro.valorLiberadoFaturamento)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-text-subtle">Valor faturado / recebido</p>
                    <p className="mt-1 text-base font-semibold text-text-strong">
                      {formatCurrency(data.medicao.resumoFinanceiro.valorFaturado)} /{' '}
                      {formatCurrency(data.medicao.resumoFinanceiro.valorRecebido)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border-light bg-surface-soft px-3 py-2">
                    <p className="flex items-center gap-2">
                      <Wallet size={14} className="text-jogab-700" />{' '}
                      {data.medicao.resumoFinanceiro.tituloFinanceiroCodigo ?? 'Sem título financeiro vinculado'}
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-text-strong">Integrações conceituais</h2>
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

              <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
                <h2 className="text-base font-semibold text-text-strong">Linha do tempo de aprovação</h2>
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

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text-strong">Itens da medição</h2>
                <p className="text-sm text-text-muted">
                  Itens técnicos e financeiros medidos no período, preparados para comparativo com contrato e
                  faturamento.
                </p>
              </div>
              <MedicaoItensTable items={data.itens} />
            </section>

            <section className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
              <h2 className="text-base font-semibold text-text-strong">Observações operacionais</h2>
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
