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
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <h2 className="text-base font-semibold text-gray-900">Impostos e retenções</h2>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-medium text-gray-900">{formatCurrency(value as number)}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
