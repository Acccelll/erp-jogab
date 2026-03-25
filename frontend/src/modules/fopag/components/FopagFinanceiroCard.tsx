import { formatCurrency } from '@/shared/lib/utils';
import type { FopagFinanceiroResumo } from '../types';

interface FopagFinanceiroCardProps {
  financeiro: FopagFinanceiroResumo;
}

export function FopagFinanceiroCard({ financeiro }: FopagFinanceiroCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-text-strong">Resumo financeiro</h3>
      <p className="mt-1 text-sm text-text-muted">
        Prepara a previsão de desembolso da folha e sua conciliação futura no Financeiro.
      </p>

      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Previsto</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">
            {formatCurrency(financeiro.valorPrevistoDesembolso)}
          </dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Realizado</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">
            {formatCurrency(financeiro.valorRealizadoDesembolso)}
          </dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Encargos</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{formatCurrency(financeiro.valorEncargos)}</dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Benefícios</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{formatCurrency(financeiro.valorBeneficios)}</dd>
        </div>
        <div className="rounded-lg bg-surface-soft p-3 md:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-text-subtle">Leitura operacional</dt>
          <dd className="mt-1 text-sm font-semibold text-text-strong">{financeiro.principalSaida}</dd>
        </div>
      </dl>
    </article>
  );
}
