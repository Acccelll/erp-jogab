import { formatCurrency } from '@/shared/lib/utils';
import type { FopagFuncionarioCompetencia } from '../types';

interface FopagFuncionariosTableProps {
  items: FopagFuncionarioCompetencia[];
}

export function FopagFuncionariosTable({ items }: FopagFuncionariosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Funcionário</th>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Obra</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Salário Base</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">HE</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Realizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3">
                  <div className="font-medium text-text-strong">{item.funcionarioNome}</div>
                  <div className="text-xs text-text-muted">
                    {item.matricula} • {item.cargo}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-body">{item.obraPrincipalNome}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.salarioBase)}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.horasExtrasValor)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-strong">
                  {formatCurrency(item.valorPrevisto)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-text-strong">
                  {formatCurrency(item.valorRealizado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
