import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, FileText, Check, X, Loader2, History } from 'lucide-react';
import { EmptyState, MainContent, PageHeader } from '@/shared/components';
import { useHoraExtraDetails } from '../hooks';
import { HORA_EXTRA_TIPO_LABELS, HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_STATUS_VARIANTS } from '../types';
import type { HoraExtraStatus } from '../types';
import { useApproveHoraExtra, useRejectHoraExtra } from '../hooks/useHorasExtrasMutations';
import { useNotificationStore } from '@/shared/stores';
import { useHorasExtrasAprovacao } from '../hooks/useHorasExtrasAprovacao';

function StatusBadgeInline({ status }: { status: HoraExtraStatus }) {
  const variant = HORA_EXTRA_STATUS_VARIANTS[status];
  const label = HORA_EXTRA_STATUS_LABELS[status];
  const colors: Record<string, string> = {
    default: 'bg-surface-soft text-text-body',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors[variant] ?? colors.default}`}
    >
      {label}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-sm font-medium text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-text-strong">{value ?? '—'}</dd>
    </div>
  );
}

export function HorasExtrasDetailPage() {
  const { lancamentoId } = useParams<{ lancamentoId: string }>();
  const { horaExtra, isLoading, isError, refetch } = useHoraExtraDetails(lancamentoId);
  const { data: aprovacaoData } = useHorasExtrasAprovacao(horaExtra?.competencia);

  const { mutate: approve, isPending: isApproving } = useApproveHoraExtra();
  const { mutate: reject, isPending: isRejecting } = useRejectHoraExtra();
  const { addNotification } = useNotificationStore();

  const handleApprove = () => {
    if (!horaExtra) return;
    approve(horaExtra.id, {
      onSuccess: () => {
        addNotification({ title: 'Aprovado', message: 'Lançamento aprovado com sucesso.', type: 'success' });
        void refetch();
      }
    });
  };

  const handleReject = () => {
    if (!horaExtra) return;
    const motivo = window.prompt('Motivo da rejeição:');
    if (motivo === null) return;
    reject({ id: horaExtra.id, observacao: motivo }, {
      onSuccess: () => {
        addNotification({ title: 'Rejeitado', message: 'Lançamento rejeitado.', type: 'success' });
        void refetch();
      }
    });
  };

  const historico = aprovacaoData?.historico.filter(h => h.horaExtraId === lancamentoId) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Detalhe do Lançamento"
        subtitle={horaExtra ? `${horaExtra.funcionarioNome} — ${horaExtra.obraNome}` : 'Carregando...'}
        actions={
          <Link
            to="/horas-extras/lancamentos"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-soft"
          >
            <ArrowLeft size={16} />
            Voltar aos lançamentos
          </Link>
        }
      />

      <MainContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jogab-500 border-t-transparent" />
              <p className="text-sm text-text-muted">Carregando lançamento...</p>
            </div>
          </div>
        )}

        {isError && (
          <EmptyState
            title="Erro ao carregar lançamento"
            description="Não foi possível carregar os dados deste lançamento de hora extra."
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

        {!isLoading && !isError && !horaExtra && (
          <EmptyState
            title="Lançamento não encontrado"
            description="O lançamento solicitado não existe ou foi removido."
            action={
              <Link
                to="/horas-extras/lancamentos"
                className="inline-flex items-center gap-1.5 rounded-md bg-jogab-700 px-3 py-1.5 text-sm text-white hover:bg-jogab-800"
              >
                Voltar aos lançamentos
              </Link>
            }
          />
        )}

        {!isLoading && !isError && horaExtra && (
          <>
            <section className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-strong">Informações gerais</h2>
                <StatusBadgeInline status={horaExtra.status} />
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Funcionário" value={horaExtra.funcionarioNome} />
                <DetailField label="Matrícula" value={horaExtra.matricula} />
                <DetailField label="Cargo" value={horaExtra.cargo} />
                <DetailField label="Obra" value={horaExtra.obraNome} />
                <DetailField label="Centro de Custo" value={horaExtra.centroCustoNome} />
                <DetailField label="Filial" value={horaExtra.filialNome} />
              </dl>
            </section>

            <section className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Clock size={18} className="text-jogab-700" />
                <h2 className="text-lg font-semibold text-text-strong">Dados do lançamento</h2>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Competência" value={horaExtra.competencia} />
                <DetailField label="Data do lançamento" value={horaExtra.dataLancamento} />
                <DetailField label="Tipo" value={HORA_EXTRA_TIPO_LABELS[horaExtra.tipo]} />
                <DetailField label="Quantidade de horas" value={`${horaExtra.quantidadeHoras.toFixed(1)}h`} />
                <DetailField
                  label="Valor calculado"
                  value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    horaExtra.valorCalculado,
                  )}
                />
                <DetailField label="Origem" value={horaExtra.origem} />
              </dl>
            </section>

            <section className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User size={18} className="text-jogab-700" />
                <h2 className="text-lg font-semibold text-text-strong">Aprovação</h2>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Status atual" value={HORA_EXTRA_STATUS_LABELS[horaExtra.status]} />
                <DetailField label="Aprovador" value={horaExtra.aprovadorNome ?? 'Sem aprovador definido'} />
              </dl>
            </section>

            {horaExtra.observacao && (
              <section className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-jogab-700" />
                  <h2 className="text-lg font-semibold text-text-strong">Justificativa / Observação</h2>
                </div>
                <p className="text-sm text-text-body">{horaExtra.observacao}</p>
              </section>
            )}

            {(horaExtra.status === 'pendente_aprovacao' || horaExtra.status === 'digitada') && (
              <section className="rounded-xl border border-jogab-100 bg-jogab-50/30 p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-text-strong">Ações de aprovação</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Aprovar lançamento
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isApproving || isRejecting}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    Rejeitar lançamento
                  </button>
                </div>
              </section>
            )}

            <section className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <History size={18} className="text-jogab-700" />
                <h2 className="text-lg font-semibold text-text-strong">Histórico operacional</h2>
              </div>
              {historico.length === 0 ? (
                <p className="text-sm text-text-muted italic">Nenhum evento registrado no histórico.</p>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {historico.map((event, idx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {idx !== historico.length - 1 && (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jogab-50 ring-8 ring-white">
                                <Clock size={14} className="text-jogab-700" />
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-text-body">
                                  {event.descricao}{' '}
                                  <span className="font-medium text-text-strong">por {event.responsavel}</span>
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-text-muted">
                                {new Date(event.dataEvento).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </>
        )}
      </MainContent>
    </div>
  );
}
