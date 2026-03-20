import { formatCurrency } from '@/shared/lib/utils';
import type { FopagRateioItem } from '../types';

interface FopagRateioTableProps {
  items: FopagRateioItem[];
}

export function FopagRateioTable({ items }: FopagRateioTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Centro de Custo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Critério</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">%</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor Previsto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 font-medium text-gray-900">{item.centroCustoNome}</td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-700">{item.criterio}</td>
                <td className="px-4 py-3 text-right text-gray-800">{item.percentual}%</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.valorPrevisto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
