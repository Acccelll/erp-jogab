import { formatCurrency } from '@/shared/lib/utils';
import type { MedicaoItem } from '../types';

interface MedicaoItensTableProps {
  items: MedicaoItem[];
}

export function MedicaoItensTable({ items }: MedicaoItensTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Item</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Etapa</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Qtd. período</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Acumulado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">% executado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor período</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 text-gray-800">{item.descricao}</td>
                <td className="px-4 py-3 text-gray-600">{item.etapa}</td>
                <td className="px-4 py-3 text-right text-gray-700">{item.quantidadePeriodo} {item.unidade}</td>
                <td className="px-4 py-3 text-right text-gray-700">{item.quantidadeAcumulada} {item.unidade}</td>
                <td className="px-4 py-3 text-right text-gray-700">{item.percentualExecutado}%</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorPeriodo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
