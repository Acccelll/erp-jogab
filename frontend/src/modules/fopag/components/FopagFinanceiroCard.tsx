import { formatCurrency } from '@/shared/lib/utils';
import type { FopagFinanceiroResumo } from '../types';

interface FopagFinanceiroCardProps {
  financeiro: FopagFinanceiroResumo;
}

export function FopagFinanceiroCard({ financeiro }: FopagFinanceiroCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <h3 className="text-base font-semibold text-gray-900">Resumo financeiro</h3>
      <p className="mt-1 text-sm text-gray-500">
        Prepara a previsão de desembolso da folha e sua conciliação futura no Financeiro.
      </p>

      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Previsto</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(financeiro.valorPrevistoDesembolso)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Realizado</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(financeiro.valorRealizadoDesembolso)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Encargos</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(financeiro.valorEncargos)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Benefícios</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {formatCurrency(financeiro.valorBeneficios)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 md:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-gray-400">Leitura operacional</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">{financeiro.principalSaida}</dd>
        </div>
      </dl>
    </article>
  );
}
