import { formatCurrency } from '@/shared/lib/utils';
import type { FopagObraCompetencia } from '../types';

interface FopagObrasTableProps {
  items: FopagObraCompetencia[];
}

export function FopagObrasTable({ items }: FopagObrasTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Funcionários</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Horas Extras</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Participação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 font-medium text-gray-900">{item.obraNome}</td>
                <td className="px-4 py-3 text-right text-gray-800">{item.totalFuncionarios}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.valorPrevisto)}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.valorRealizado)}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.valorHorasExtras)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{item.percentualParticipacao}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
