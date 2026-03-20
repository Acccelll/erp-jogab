import { formatCurrency } from '@/shared/lib/utils';
import type { FopagFuncionarioCompetencia } from '../types';

interface FopagFuncionariosTableProps {
  items: FopagFuncionarioCompetencia[];
}

export function FopagFuncionariosTable({ items }: FopagFuncionariosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Funcionário</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Obra</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Salário Base</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">HE</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Realizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3"><div className="font-medium text-gray-900">{item.funcionarioNome}</div><div className="text-xs text-gray-500">{item.matricula} • {item.cargo}</div></td>
                <td className="px-4 py-3 text-gray-700">{item.obraPrincipalNome}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.salarioBase)}</td>
                <td className="px-4 py-3 text-right text-gray-800">{formatCurrency(item.horasExtrasValor)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.valorPrevisto)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.valorRealizado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
