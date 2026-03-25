import { formatCurrency } from '@/shared/lib/utils';
import type { FopagPrevistoRealizadoItem } from '../types';

interface FopagPrevistoRealizadoTableProps {
  items: FopagPrevistoRealizadoItem[];
}

export function FopagPrevistoRealizadoTable({ items }: FopagPrevistoRealizadoTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm shadow-gray-100/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-surface-soft">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-text-muted">Categoria</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Previsto</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Realizado</th>
              <th className="px-4 py-3 text-right font-semibold text-text-muted">Diferença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => {
              const diferenca = item.valorRealizado - item.valorPrevisto;
              return (
                <tr key={item.id} className="hover:bg-surface-soft/70">
                  <td className="px-4 py-3 font-medium text-text-strong">{item.categoria}</td>
                  <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorPrevisto)}</td>
                  <td className="px-4 py-3 text-right text-text-body">{formatCurrency(item.valorRealizado)}</td>
                  <td
                    className={
                      diferenca > 0
                        ? 'px-4 py-3 text-right font-medium text-red-600'
                        : 'px-4 py-3 text-right font-medium text-green-700'
                    }
                  >
                    {formatCurrency(diferenca)}
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
