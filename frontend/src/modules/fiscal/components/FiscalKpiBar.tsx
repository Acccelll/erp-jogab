import { formatCurrency } from '@/shared/lib/utils';
import type { FiscalKpis } from '../types';

interface FiscalKpiBarProps {
  kpis: FiscalKpis;
}

export function FiscalKpiBar({ kpis }: FiscalKpiBarProps) {
  const items = [
    { label: 'Documentos', value: String(kpis.totalDocumentos) },
    { label: 'Entradas', value: String(kpis.entradas) },
    { label: 'Saídas', value: String(kpis.saidas) },
    { label: 'Aguardando validação', value: String(kpis.aguardandoValidacao) },
    { label: 'Aguardando financeiro', value: String(kpis.aguardandoFinanceiro) },
    { label: 'Valor total', value: formatCurrency(kpis.valorTotal) },
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm shadow-gray-100/60">
          <p className="text-xs uppercase tracking-wide text-gray-400">{item.label}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
