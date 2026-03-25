import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_TIPO_LABELS } from '../types';
import { HoraExtraStatusBadge } from './HoraExtraStatusBadge';
import type { HoraExtraListItem } from '../types';

interface HorasExtrasTableProps {
  items: HoraExtraListItem[];
}

export function HorasExtrasTable({ items }: HorasExtrasTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200/80 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/60 text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Funcionário</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Obra</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Competência</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Data</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tipo</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Horas</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-3 py-1.5 align-top">
                  <div className="font-medium text-gray-900">{item.funcionarioNome}</div>
                  <div className="text-xs text-gray-500">{item.matricula}</div>
                </td>
                <td className="px-3 py-1.5 text-gray-700">{item.obraNome}</td>
                <td className="px-3 py-1.5 text-gray-700">{formatCompetencia(item.competencia)}</td>
                <td className="px-3 py-1.5 text-gray-700">
                  {new Date(item.dataLancamento).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-3 py-1.5 text-gray-700">{HORA_EXTRA_TIPO_LABELS[item.tipo]}</td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-800">
                  {item.quantidadeHoras.toFixed(1)} h
                </td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-800">
                  {formatCurrency(item.valorCalculado)}
                </td>
                <td className="px-3 py-1.5">
                  <HoraExtraStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
