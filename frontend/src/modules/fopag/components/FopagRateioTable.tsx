import { formatCurrency } from '@/shared/lib/utils';
import type { FopagRateioItem } from '../types';

interface FopagRateioTableProps {
  items: FopagRateioItem[];
}

export function FopagRateioTable({ items }: FopagRateioTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Centro de Custo</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Critério</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">%</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Valor Previsto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 font-medium text-text-strong">{item.centroCustoNome}</td>
                <td className="px-4 py-3 text-text-body">{item.obraNome}</td>
                <td className="px-4 py-3 text-text-body">{item.criterio}</td>
                <td className="px-4 py-3 text-right text-text-body">{item.percentual}%</td>
                <td className="px-4 py-3 text-right font-medium text-text-strong">
                  {formatCurrency(item.valorPrevisto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
