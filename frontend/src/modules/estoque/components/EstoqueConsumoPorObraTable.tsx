import { formatCurrency } from '@/shared/lib/utils';
import type { EstoqueConsumoObra } from '../types';

interface EstoqueConsumoPorObraTableProps {
  items: EstoqueConsumoObra[];
}

export function EstoqueConsumoPorObraTable({ items }: EstoqueConsumoPorObraTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Centro de custo</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Quantidade consumida</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor apropriado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Última leitura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={`${item.obraId}-${item.centroCusto}`} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 text-gray-800">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-600">{item.centroCusto}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{item.quantidadeConsumida}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorConsumido)}</td>
                <td className="px-4 py-3 text-gray-600">{item.ultimaLeituraEm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
