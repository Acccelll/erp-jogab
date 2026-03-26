import { Link } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_TIPO_LABELS } from '../types';
import type { HoraExtraAprovacaoItem } from '../types';
import { useApproveHoraExtra, useRejectHoraExtra } from '../hooks/useHorasExtrasMutations';
import { useNotificationStore } from '@/shared/stores';

const COLUMNS = ['Funcionário', 'Obra', 'Competência', 'Tipo', 'Status', 'Horas', 'Valor', 'Ações', 'Links'];

export function HorasExtrasAprovacaoTable({ items }: { items: HoraExtraAprovacaoItem[] }) {
  const { mutate: approve, isPending: isApproving, variables: approvingId } = useApproveHoraExtra();
  const { mutate: reject, isPending: isRejecting, variables: rejectingPayload } = useRejectHoraExtra();
  const { addNotification } = useNotificationStore();

  const handleApprove = (id: string) => {
    approve(id, {
      onSuccess: () => {
        addNotification({
          title: 'Hora extra aprovada',
          message: 'O lançamento foi aprovado com sucesso.',
          type: 'success',
        });
      },
      onError: () => {
        addNotification({
          title: 'Erro ao aprovar',
          message: 'Ocorreu um erro ao processar a aprovação.',
          type: 'error',
        });
      },
    });
  };

  const handleReject = (id: string) => {
    const motivo = window.prompt('Informe o motivo da rejeição (opcional):');
    if (motivo === null) return; // Cancelled prompt

    reject(
      { id, observacao: motivo },
      {
        onSuccess: () => {
          addNotification({
            title: 'Hora extra rejeitada',
            message: 'O lançamento foi rejeitado com sucesso.',
            type: 'success',
          });
        },
        onError: () => {
          addNotification({
            title: 'Erro ao rejeitar',
            message: 'Ocorreu um erro ao processar a rejeição.',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-text-muted">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => {
              const tipoLabel = HORA_EXTRA_TIPO_LABELS[item.tipo as keyof typeof HORA_EXTRA_TIPO_LABELS] ?? item.tipo;
              const statusLabel =
                HORA_EXTRA_STATUS_LABELS[item.status as keyof typeof HORA_EXTRA_STATUS_LABELS] ?? item.status;

              return (
                <tr key={item.id} className="hover:bg-surface-soft/70">
                  <td className="px-4 py-3 text-text-body">
                    <div className="font-medium text-text-strong">{item.funcionarioNome}</div>
                    <div className="text-xs text-text-muted">
                      {item.matricula} • {item.gestorResponsavel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-body">{item.obraNome}</td>
                  <td className="px-4 py-3 text-text-body">{formatCompetencia(item.competencia)}</td>
                  <td className="px-4 py-3 text-text-body">{tipoLabel}</td>
                  <td className="px-4 py-3 text-text-body">{statusLabel}</td>
                  <td className="px-4 py-3 text-text-body">{item.quantidadeHoras}h</td>
                  <td className="px-4 py-3 text-text-body">{formatCurrency(item.valorCalculado)}</td>
                  <td className="px-4 py-3 text-text-body">
                    {item.status === 'pendente_aprovacao' || item.status === 'digitada' ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          disabled={isApproving || isRejecting}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
                          title="Aprovar"
                        >
                          {isApproving && approvingId === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item.id)}
                          disabled={isApproving || isRejecting}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          title="Rejeitar"
                        >
                          {isRejecting && rejectingPayload?.id === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted italic">Processado</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-body">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/rh/funcionarios/${item.funcionarioId}/horas-extras`}
                        className="text-xs font-medium text-jogab-700 hover:underline"
                      >
                        RH
                      </Link>
                      <Link
                        to={`/obras/${item.obraId}/equipe`}
                        className="text-xs font-medium text-jogab-700 hover:underline"
                      >
                        Obra
                      </Link>
                      <Link to="/fopag" className="text-xs font-medium text-jogab-700 hover:underline">
                        FOPAG
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
