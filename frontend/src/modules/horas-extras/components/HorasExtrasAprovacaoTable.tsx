import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { HORA_EXTRA_STATUS_LABELS, HORA_EXTRA_TIPO_LABELS } from '../types';
import type { HoraExtraAprovacaoItem } from '../types';

const COLUMNS = ['Funcionário', 'Obra', 'Competência', 'Tipo', 'Status', 'Horas', 'Valor', 'Navegação'];

export function HorasExtrasAprovacaoTable({ items }: { items: HoraExtraAprovacaoItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-text-muted">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => {
              const tipoLabel = HORA_EXTRA_TIPO_LABELS[item.tipo as keyof typeof HORA_EXTRA_TIPO_LABELS] ?? item.tipo;
              const statusLabel =
                HORA_EXTRA_STATUS_LABELS[item.status as keyof typeof HORA_EXTRA_STATUS_LABELS] ?? item.status;

              return (
                <tr key={item.id} className="hover:bg-surface-soft/70">
                  <td className="px-4 py-3 text-text-body">
                    <div className="font-medium text-text-strong">{item.funcionarioNome}</div>
                    <div className="text-xs text-text-muted">
                      {item.matricula} • {item.gestorResponsavel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-body">{item.obraNome}</td>
                  <td className="px-4 py-3 text-text-body">{formatCompetencia(item.competencia)}</td>
                  <td className="px-4 py-3 text-text-body">{tipoLabel}</td>
                  <td className="px-4 py-3 text-text-body">{statusLabel}</td>
                  <td className="px-4 py-3 text-text-body">{item.quantidadeHoras}h</td>
                  <td className="px-4 py-3 text-text-body">{formatCurrency(item.valorCalculado)}</td>
                  <td className="px-4 py-3 text-text-body">
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
