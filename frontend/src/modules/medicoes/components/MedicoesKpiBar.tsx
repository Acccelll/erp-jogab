import { formatCurrency } from '@/shared/lib/utils';
import type { MedicoesKpis } from '../types';

interface MedicoesKpiBarProps {
  kpis: MedicoesKpis;
}

export function MedicoesKpiBar({ kpis }: MedicoesKpiBarProps) {
  const items = [
    { label: 'Medições', value: String(kpis.totalMedicoes) },
    { label: 'Em aprovação', value: String(kpis.medicoesEmAprovacao) },
    { label: 'Aprovadas', value: String(kpis.medicoesAprovadas) },
    { label: 'Valor medido', value: formatCurrency(kpis.valorMedido) },
    { label: 'Valor faturado', value: formatCurrency(kpis.valorFaturado) },
    { label: 'A receber', value: formatCurrency(kpis.valorReceber) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-6">
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
