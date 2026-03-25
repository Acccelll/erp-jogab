import { formatCurrency } from '@/shared/lib/utils';
import type { EstoqueKpis } from '../types';

interface EstoqueKpiBarProps {
  kpis: EstoqueKpis;
}

export function EstoqueKpiBar({ kpis }: EstoqueKpiBarProps) {
  const items = [
    { label: 'Itens', value: String(kpis.totalItens) },
    { label: 'Itens críticos', value: String(kpis.itensCriticos) },
    { label: 'Locais ativos', value: String(kpis.locaisAtivos) },
    { label: 'Valor estocado', value: formatCurrency(kpis.valorEstocado) },
    { label: 'Valor reservado', value: formatCurrency(kpis.valorReservado) },
    { label: 'Consumo mensal', value: formatCurrency(kpis.consumoMensal) },
    { label: 'Entradas pendentes', value: String(kpis.entradasPendentes) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-7">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border-default bg-white px-4 py-3 shadow-sm shadow-gray-100/60"
        >
          <p className="text-xs uppercase tracking-wide text-text-subtle">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-text-strong">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
