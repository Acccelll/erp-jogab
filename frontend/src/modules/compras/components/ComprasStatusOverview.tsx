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
        <h2 className="text-lg font-semibold text-text-strong">Visão por status</h2>
        <p className="text-sm text-text-muted">
          Leitura consolidada do pipeline de compras com foco em suprimentos, fiscal e financeiro.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.status}
            className="rounded-xl border border-border-default bg-white p-4 shadow-sm shadow-gray-100/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-strong">{item.label}</p>
                <p className="mt-1 text-xs text-text-muted">{item.descricao}</p>
              </div>
              <CompraStatusBadge status={item.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-soft p-3">
                <p className="text-xs uppercase tracking-wide text-text-subtle">Quantidade</p>
                <p className="mt-1 text-sm font-semibold text-text-strong">{item.quantidade}</p>
              </div>
              <div className="rounded-lg bg-surface-soft p-3">
                <p className="text-xs uppercase tracking-wide text-text-subtle">Valor</p>
                <p className="mt-1 text-sm font-semibold text-text-strong">{formatCurrency(item.valor)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
