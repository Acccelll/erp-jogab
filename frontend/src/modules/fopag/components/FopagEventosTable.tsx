import { formatCurrency } from '@/shared/lib/utils';
import type { FopagEventoCompetencia } from '../types';

interface FopagEventosTableProps {
  items: FopagEventoCompetencia[];
}

export function FopagEventosTable({ items }: FopagEventosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Evento</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Origem</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Lançamentos</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3"><div className="font-medium text-gray-900">{item.nome}</div><div className="text-xs text-gray-500">{item.codigo} • {item.tipo}</div></td>
                <td className="px-4 py-3 text-gray-700">{item.origem}</td>
                <td className="px-4 py-3 text-right text-gray-800">{item.quantidadeLancamentos}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.valorPrevisto)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.valorRealizado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
