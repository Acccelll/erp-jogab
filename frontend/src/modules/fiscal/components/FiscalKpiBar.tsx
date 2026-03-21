import { formatCurrency } from '@/shared/lib/utils';
import type { FiscalKpis } from '../types';

export function FiscalKpiBar({ kpis }: { kpis: FiscalKpis }) {
  const items = [
    ['Total de documentos', String(kpis.totalDocumentos)],
    ['Entradas', String(kpis.totalEntradas)],
    ['Saídas', String(kpis.totalSaidas)],
    ['Valor entradas', formatCurrency(kpis.valorEntradas)],
    ['Valor saídas', formatCurrency(kpis.valorSaidas)],
    ['Em validação', String(kpis.validando)],
    ['Com erro', String(kpis.comErro)],
  ];

  return (
    <section className="grid gap-3 border-b border-border-light bg-surface-secondary px-6 py-4 md:grid-cols-2 xl:grid-cols-7">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm shadow-gray-100/60"
        >
          <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
        </div>
      ))}
    </section>
  );
}
