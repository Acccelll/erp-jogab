import { CalendarCheck2, Loader2 } from 'lucide-react';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { StatusBadge } from '@/shared/components';
import { FECHAMENTO_STATUS_LABELS, FECHAMENTO_STATUS_VARIANTS } from '../types';
import type { FechamentoCompetencia } from '../types';

interface HorasExtrasFechamentoCardProps {
  fechamento: FechamentoCompetencia;
  onClose?: (competencia: string) => void;
  isClosing?: boolean;
}

export function HorasExtrasFechamentoCard({ fechamento, onClose, isClosing }: HorasExtrasFechamentoCardProps) {
  const canClose = fechamento.pendentesAprovacao === 0 && fechamento.status !== 'fechada_para_fopag';

  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jogab-50 text-jogab-700">
            <CalendarCheck2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-strong">
              Competência {formatCompetencia(fechamento.competencia)}
            </h3>
            <p className="text-sm text-text-muted">
              Última atualização em {new Date(fechamento.updatedAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <StatusBadge
          label={FECHAMENTO_STATUS_LABELS[fechamento.status]}
          variant={FECHAMENTO_STATUS_VARIANTS[fechamento.status]}
        />
      </div>

      <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Lançamentos</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{fechamento.totalLancamentos}</dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Pendentes</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{fechamento.pendentesAprovacao}</dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Horas Totais</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{fechamento.horasTotais.toFixed(1)} h</dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Valor Total</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{formatCurrency(fechamento.valorTotal)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={!canClose || !onClose || isClosing}
          onClick={() => onClose?.(fechamento.competencia)}
          className="inline-flex items-center gap-2 rounded-md border border-jogab-200 px-3 py-2 text-sm font-medium text-jogab-700 disabled:opacity-50"
        >
          {isClosing ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck2 size={16} />}
          Fechar competência
        </button>
      </div>
    </article>
  );
}
