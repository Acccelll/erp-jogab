import { formatCurrency } from '@/shared/lib/utils';
import type { FiscalImpostos } from '../types';

export function FiscalImpostosBloco({ impostos }: { impostos: FiscalImpostos }) {
  const items = [
    ['Base de cálculo', impostos.baseCalculo],
    ['ICMS', impostos.valorIcms],
    ['ISS', impostos.valorIss],
    ['PIS', impostos.valorPis],
    ['COFINS', impostos.valorCofins],
    ['Retenções', impostos.valorRetencoes],
    ['Total tributos', impostos.valorTotalImpostos],
  ].filter(([, value]) => typeof value === 'number');

  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <h2 className="text-base font-semibold text-text-strong">Impostos e retenções</h2>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-border-light bg-surface-soft px-3 py-2"
          >
            <span className="text-sm text-text-muted">{label}</span>
            <span className="text-sm font-medium text-text-strong">{formatCurrency(value as number)}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
