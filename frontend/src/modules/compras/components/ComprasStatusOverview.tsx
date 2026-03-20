import { formatCurrency } from '@/shared/lib/utils';
import { CompraStatusBadge } from './CompraStatusBadge';
import type { ComprasStatusResumo } from '../types';

interface ComprasStatusOverviewProps {
  items: ComprasStatusResumo[];
}

export function ComprasStatusOverview({ items }: ComprasStatusOverviewProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Visão por status</h2>
        <p className="text-sm text-gray-500">Leitura consolidada do pipeline de compras com foco em suprimentos, fiscal e financeiro.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.status} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="mt-1 text-xs text-gray-500">{item.descricao}</p>
              </div>
              <CompraStatusBadge status={item.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-400">Quantidade</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{item.quantidade}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-400">Valor</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(item.valor)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
