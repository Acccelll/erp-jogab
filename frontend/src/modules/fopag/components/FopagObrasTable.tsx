import { formatCurrency } from '@/shared/lib/utils';
import type { FopagObraCompetencia } from '../types';

interface FopagObrasTableProps {
  items: FopagObraCompetencia[];
}

export function FopagObrasTable({ items }: FopagObrasTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Obra</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Funcionários</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Realizado</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Horas Extras</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Participação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-soft/70">
                <td className="px-4 py-3 font-medium text-text-strong">{item.obraNome}</td>
                <td className="px-4 py-3 text-right text-text-body">{item.totalFuncionarios}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorPrevisto)}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorRealizado)}</td>
                <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorHorasExtras)}</td>
                <td className="px-4 py-3 text-right font-medium text-text-strong">{item.percentualParticipacao}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
