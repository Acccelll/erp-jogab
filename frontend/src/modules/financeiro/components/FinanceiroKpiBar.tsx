import { formatCurrency } from '@/shared/lib/utils';
import type { FinanceiroKpis } from '../types';

interface FinanceiroKpiBarProps {
  kpis: FinanceiroKpis;
}

export function FinanceiroKpiBar({ kpis }: FinanceiroKpiBarProps) {
  const items = [
    { label: 'Títulos', value: String(kpis.totalTitulos) },
    { label: 'Contas a pagar', value: String(kpis.totalPagar) },
    { label: 'Contas a receber', value: String(kpis.totalReceber) },
    { label: 'Valor a pagar', value: formatCurrency(kpis.valorPagar) },
    { label: 'Valor a receber', value: formatCurrency(kpis.valorReceber) },
    { label: 'Vencido', value: formatCurrency(kpis.valorVencido) },
    { label: 'Saldo projetado', value: formatCurrency(kpis.saldoProjetado) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-7">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm shadow-gray-100/60">
          <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
