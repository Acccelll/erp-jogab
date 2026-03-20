import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_TIPO_LABELS } from '../types';
import { HoraExtraStatusBadge } from './HoraExtraStatusBadge';
import type { HoraExtraListItem } from '../types';

interface HorasExtrasTableProps {
  items: HoraExtraListItem[];
}

export function HorasExtrasTable({ items }: HorasExtrasTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Funcionário</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Competência</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Data</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Horas</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{item.funcionarioNome}</div>
                  <div className="text-xs text-gray-500">{item.matricula}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(item.dataLancamento).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-gray-700">{HORA_EXTRA_TIPO_LABELS[item.tipo]}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{item.quantidadeHoras.toFixed(1)} h</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(item.valorCalculado)}</td>
                <td className="px-4 py-3"><HoraExtraStatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
