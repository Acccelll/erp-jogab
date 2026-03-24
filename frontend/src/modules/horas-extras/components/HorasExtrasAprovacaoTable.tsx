import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_TIPO_LABELS } from '../types';
import type { HoraExtraAprovacaoItem } from '../types';

const COLUMNS = [
  'Funcionário',
  'Obra',
  'Competência',
  'Tipo',
  'Status',
  'Horas',
  'Valor',
  'Navegação',
];

export function HorasExtrasAprovacaoTable({ items }: { items: HoraExtraAprovacaoItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => {
              const tipoLabel =
                HORA_EXTRA_TIPO_LABELS[item.tipo as keyof typeof HORA_EXTRA_TIPO_LABELS] ?? item.tipo;
              const statusLabel =
                HORA_EXTRA_STATUS_LABELS[item.status as keyof typeof HORA_EXTRA_STATUS_LABELS] ?? item.status;

              return (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 text-gray-700">
                    <div className="font-medium text-gray-900">{item.funcionarioNome}</div>
                    <div className="text-xs text-gray-500">
                      {item.matricula} • {item.gestorResponsavel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.obraNome}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCompetencia(item.competencia)}</td>
                  <td className="px-4 py-3 text-gray-700">{tipoLabel}</td>
                  <td className="px-4 py-3 text-gray-700">{statusLabel}</td>
                  <td className="px-4 py-3 text-gray-700">{item.quantidadeHoras}h</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(item.valorCalculado)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/rh/funcionarios/${item.funcionarioId}/horas-extras`}
                        className="text-xs font-medium text-jogab-700 hover:underline"
                      >
                        RH
                      </Link>
                      <Link
                        to={`/obras/${item.obraId}/equipe`}
                        className="text-xs font-medium text-jogab-700 hover:underline"
                      >
                        Obra
                      </Link>
                      <Link to="/fopag" className="text-xs font-medium text-jogab-700 hover:underline">
                        FOPAG
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
